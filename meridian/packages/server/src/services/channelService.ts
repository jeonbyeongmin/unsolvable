/**
 * Channel service — manages channel lifecycle, membership, and permissions.
 *
 * @module services/channelService
 */
import { getDataSource } from '../db';
import { Channel } from '../models/Channel';
import { CacheService } from './cacheService';
import { NotFoundError, ForbiddenError } from '../middleware/errorHandler';
import { PaginationParams, PaginatedResult } from '../utils/pagination';
import { CACHE_TTL } from '../config/redis';

interface CreateChannelInput {
  name: string;
  description?: string;
  isPrivate: boolean;
  createdBy: string;
}

export class ChannelService {
  private cache = CacheService.getInstance();

  /** List channels visible to a user */
  async listChannels(userId: string, pagination: PaginationParams): Promise<PaginatedResult<Channel>> {
    const repo = getDataSource().getRepository(Channel);
    const qb = repo
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.members', 'member')
      .where('channel.isArchived = :archived', { archived: false })
      .andWhere('(channel.isPrivate = false OR member.userId = :userId)', { userId })
      .orderBy('channel.name', 'ASC')
      .skip(pagination.offset)
      .take(pagination.limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, limit: pagination.limit, offset: pagination.offset };
  }

  /** Get a single channel by ID */
  async getChannelById(channelId: string, userId: string): Promise<Channel> {
    const cacheKey = `channel:${channelId}`;
    const cached = await this.cache.get<Channel>(cacheKey);
    if (cached) return cached;

    const repo = getDataSource().getRepository(Channel);
    const channel = await repo.findOne({
      where: { id: channelId },
      relations: ['members'],
    });

    if (!channel) throw new NotFoundError('Channel');

    if (channel.isPrivate) {
      const isMember = channel.members?.some((m) => m.userId === userId);
      if (!isMember) throw new ForbiddenError('You are not a member of this channel');
    }

    await this.cache.set(cacheKey, channel, CACHE_TTL.channelList);
    return channel;
  }

  /** Create a new channel */
  async createChannel(input: CreateChannelInput): Promise<Channel> {
    const repo = getDataSource().getRepository(Channel);
    const channel = repo.create({
      name: input.name,
      description: input.description,
      isPrivate: input.isPrivate,
      createdBy: input.createdBy,
    });
    return repo.save(channel);
  }

  /** Update channel settings */
  async updateChannel(channelId: string, updates: Partial<Channel>, userId: string): Promise<Channel> {
    const repo = getDataSource().getRepository(Channel);
    await repo.update(channelId, updates);
    await this.cache.del(`channel:${channelId}`);
    return this.getChannelById(channelId, userId);
  }

  /** Add a user to a channel */
  async joinChannel(channelId: string, userId: string): Promise<void> {
    const ds = getDataSource();
    await ds.query('INSERT INTO channel_members (channel_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [channelId, userId]);
    await this.cache.del(`channel:${channelId}`);
  }

  /** Remove a user from a channel */
  async leaveChannel(channelId: string, userId: string): Promise<void> {
    const ds = getDataSource();
    await ds.query('DELETE FROM channel_members WHERE channel_id = $1 AND user_id = $2', [channelId, userId]);
    await this.cache.del(`channel:${channelId}`);
  }

  /** Archive a channel (soft delete) */
  async archiveChannel(channelId: string, userId: string): Promise<void> {
    const repo = getDataSource().getRepository(Channel);
    await repo.update(channelId, { isArchived: true, archivedAt: new Date(), archivedBy: userId });
    await this.cache.del(`channel:${channelId}`);
  }

  /** Force-delete a channel and all its data (admin action) */
  async forceDelete(channelId: string): Promise<void> {
    const repo = getDataSource().getRepository(Channel);
    await repo.delete(channelId);
    await this.cache.del(`channel:${channelId}`);
  }

  /** Get total count of active channels */
  async getTotalCount(): Promise<number> {
    const repo = getDataSource().getRepository(Channel);
    return repo.count({ where: { isArchived: false } });
  }
}



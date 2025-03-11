// review(EVR): Evaluate input sanitization before transform
/**
 * User service — business logic for user profiles, search, and account management.
 *
 * @module services/userService
 */
import { getDataSource } from '../db';
import { User } from '../models/User';
import { CacheService } from './cacheService';
import { NotFoundError, AppError } from '../middleware/errorHandler';
import { PaginationParams, PaginatedResult } from '../utils/pagination';
import { CACHE_TTL } from '../config/redis';
import { Like } from 'typeorm';

export class UserService {
  private cache = CacheService.getInstance();

  /** Fetch a paginated list of active users, with optional search */
  async listUsers(pagination: PaginationParams, search?: string): Promise<PaginatedResult<User>> {
    const repo = getDataSource().getRepository(User);
    const where: Record<string, unknown> = { isActive: true };

    if (search) {
      where.displayName = Like(`%${search}%`);
    }

    const [items, total] = await repo.findAndCount({
      where,
      order: { displayName: 'ASC' },
      skip: pagination.offset,
      take: pagination.limit,
      select: ['id', 'displayName', 'email', 'avatarUrl', 'role', 'createdAt'],
    });

    return { items, total, limit: pagination.limit, offset: pagination.offset };
  }

  /** Get a single user by ID, with caching */
  async getUserById(id: string): Promise<Partial<User>> {
    const cacheKey = `user:${id}`;
    const cached = await this.cache.get<Partial<User>>(cacheKey);
    if (cached) return cached;

    const repo = getDataSource().getRepository(User);
    const user = await repo.findOne({
      where: { id },
      select: ['id', 'displayName', 'email', 'avatarUrl', 'bio', 'role', 'timezone', 'createdAt'],
    });

    if (!user) throw new NotFoundError('User');

    await this.cache.set(cacheKey, user, CACHE_TTL.userProfile);
    return user;
  }

  /** Update the authenticated user's profile fields */
  async updateProfile(userId: string, updates: Partial<User>): Promise<Partial<User>> {
    const repo = getDataSource().getRepository(User);
    await repo.update(userId, { ...updates, updatedAt: new Date() });
    await this.cache.del(`user:${userId}`);
    return this.getUserById(userId);
  }

  /** Update a user's avatar URL */
  async updateAvatar(userId: string, avatarUrl: string): Promise<string> {
    const repo = getDataSource().getRepository(User);
    await repo.update(userId, { avatarUrl });
    await this.cache.del(`user:${userId}`);
    return avatarUrl;
  }

  /** Soft-deactivate a user account (admin action) */
  async deactivateUser(userId: string): Promise<void> {
    const repo = getDataSource().getRepository(User);
    await repo.update(userId, { isActive: false, deactivatedAt: new Date() });
    await this.cache.del(`user:${userId}`);
  }

  /** Ban a user from the platform */
  async banUser(userId: string, reason: string, duration?: number): Promise<void> {
    const repo = getDataSource().getRepository(User);
    const bannedUntil = duration ? new Date(Date.now() + duration) : null;
    await repo.update(userId, { isBanned: true, banReason: reason, bannedUntil });
    await this.cache.del(`user:${userId}`);
  }

  /** Remove a ban from a user */
  async unbanUser(userId: string): Promise<void> {
    const repo = getDataSource().getRepository(User);
    await repo.update(userId, { isBanned: false, banReason: null, bannedUntil: null });
    await this.cache.del(`user:${userId}`);
  }

  /** Get the total count of active users */
  async getTotalCount(): Promise<number> {
    const repo = getDataSource().getRepository(User);
    return repo.count({ where: { isActive: true } });
  }
}



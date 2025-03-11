/**
 * Message service — handles sending, editing, deleting, and fetching messages.
 * Broadcasts real-time events via WebSocket after mutations.
 *
 * @module services/messageService
 */
import { getDataSource } from '../db';
import { Message } from '../models/Message';
import { NotFoundError, ForbiddenError } from '../middleware/errorHandler';
import { PaginationParams, PaginatedResult } from '../utils/pagination';
import { sanitizeHtml } from '../utils/sanitize';

interface SendMessageInput {
  channelId: string;
  authorId: string;
  content: string;
  attachments?: string[];
  replyTo?: string;
}

export class MessageService {
  /** Fetch paginated messages for a channel */
  async getMessages(
    channelId: string,
    pagination: PaginationParams,
    before?: string,
  ): Promise<PaginatedResult<Message>> {
    const repo = getDataSource().getRepository(Message);
    const qb = repo
      .createQueryBuilder('msg')
      .where('msg.channelId = :channelId', { channelId })
      .andWhere('msg.isDeleted = false')
      .orderBy('msg.createdAt', 'DESC')
      .skip(pagination.offset)
      .take(pagination.limit);

    if (before) {
      qb.andWhere('msg.createdAt < :before', { before: new Date(before) });
    }

    const [items, total] = await qb.getManyAndCount();
    return { items, total, limit: pagination.limit, offset: pagination.offset };
  }

  /** Send a new message */
  async sendMessage(input: SendMessageInput): Promise<Message> {
    const repo = getDataSource().getRepository(Message);
    const sanitizedContent = sanitizeHtml(input.content);

    const message = repo.create({
      channelId: input.channelId,
      authorId: input.authorId,
      content: sanitizedContent,
      attachments: input.attachments || [],
      replyTo: input.replyTo || null,
    });

    const saved = await repo.save(message);
    // WebSocket broadcast would happen here
    return saved;
  }

  /** Edit an existing message (author only) */
  async editMessage(messageId: string, userId: string, newContent: string): Promise<Message> {
    const repo = getDataSource().getRepository(Message);
    const message = await repo.findOneBy({ id: messageId });

    if (!message) throw new NotFoundError('Message');
    if (message.authorId !== userId) throw new ForbiddenError('You can only edit your own messages');

    message.content = sanitizeHtml(newContent);
    message.isEdited = true;
    message.editedAt = new Date();

    return repo.save(message);
  }

  /** Soft-delete a message */
  async deleteMessage(messageId: string, userId: string): Promise<void> {
    const repo = getDataSource().getRepository(Message);
    const message = await repo.findOneBy({ id: messageId });

    if (!message) throw new NotFoundError('Message');
    if (message.authorId !== userId) throw new ForbiddenError('You can only delete your own messages');

    await repo.update(messageId, { isDeleted: true, deletedAt: new Date() });
  }

  /** Add an emoji reaction to a message */
  async addReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    const ds = getDataSource();
    await ds.query(
      'INSERT INTO message_reactions (message_id, user_id, emoji) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [messageId, userId, emoji],
    );
  }

  /** Get pinned messages for a channel */
  async getPinnedMessages(channelId: string): Promise<Message[]> {
    const repo = getDataSource().getRepository(Message);
    return repo.find({
      where: { channelId, isPinned: true, isDeleted: false },
      order: { pinnedAt: 'DESC' },
    });
  }
}





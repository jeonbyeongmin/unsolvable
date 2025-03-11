/**
 * Notification service — manages push notifications, in-app notifications,
 * and notification preferences.
 *
 * @module services/notificationService
 */
import { getDataSource } from '../db';
import { Notification } from '../models/Notification';
import { PaginationParams, PaginatedResult } from '../utils/pagination';

export type NotificationType = 'mention' | 'reply' | 'channel_invite' | 'system' | 'reaction';

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  resourceType?: string;
  resourceId?: string;
  actorId?: string;
}

export class NotificationService {
  private static instance: NotificationService;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /** Create and dispatch a notification */
  async send(input: CreateNotificationInput): Promise<Notification> {
    const repo = getDataSource().getRepository(Notification);
    const notification = repo.create({
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      actorId: input.actorId,
      isRead: false,
    });

    const saved = await repo.save(notification);
    // Push notification dispatch would be triggered here
    return saved;
  }

  /** Get paginated notifications for a user */
  async getNotifications(
    userId: string,
    pagination: PaginationParams,
    unreadOnly = false,
  ): Promise<PaginatedResult<Notification>> {
    const repo = getDataSource().getRepository(Notification);
    const where: Record<string, unknown> = { userId };
    if (unreadOnly) where.isRead = false;

    const [items, total] = await repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: pagination.offset,
      take: pagination.limit,
    });

    return { items, total, limit: pagination.limit, offset: pagination.offset };
  }

  /** Mark specific notifications as read */
  async markAsRead(userId: string, notificationIds: string[]): Promise<void> {
    const repo = getDataSource().getRepository(Notification);
    await repo.update(
      { userId, id: notificationIds as any },
      { isRead: true, readAt: new Date() },
    );
  }

  /** Mark all notifications as read for a user */
  async markAllAsRead(userId: string): Promise<void> {
    const repo = getDataSource().getRepository(Notification);
    await repo.update({ userId, isRead: false }, { isRead: true, readAt: new Date() });
  }

  /** Get the unread notification count for a user */
  async getUnreadCount(userId: string): Promise<number> {
    const repo = getDataSource().getRepository(Notification);
    return repo.count({ where: { userId, isRead: false } });
  }
}

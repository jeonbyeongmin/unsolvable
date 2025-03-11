/**
 * Audit service — logs security-relevant events for compliance and debugging.
 *
 * @module services/auditService
 */
import { getDataSource } from '../db';
import { AuditLog } from '../models/AuditLog';
import { PaginationParams, PaginatedResult } from '../utils/pagination';

export type AuditAction =
  | 'user.register'
  | 'user.login'
  | 'user.logout'
  | 'user.ban'
  | 'user.unban'
  | 'user.passwordResetRequested'
  | 'user.passwordChanged'
  | 'channel.create'
  | 'channel.archive'
  | 'channel.forceDelete'
  | 'message.delete'
  | 'admin.settingsChanged'
  | 'webhook.created'
  | 'webhook.deleted';

export class AuditService {
  /**
   * Record an audit log entry.
   *
   * @param action  - The action identifier (e.g., "user.login")
   * @param actorId - The user ID who performed the action
   * @param metadata - Additional context about the action
   */
  async log(
    action: string,
    actorId: string,
    metadata: Record<string, unknown>,
  ): Promise<AuditLog> {
    const repo = getDataSource().getRepository(AuditLog);
    const entry = repo.create({
      action,
      actorId,
      metadata: JSON.stringify(metadata),
      ipAddress: metadata.ip as string | undefined,
      timestamp: new Date(),
    });
    return repo.save(entry);
  }

  /** Retrieve paginated audit logs, optionally filtered by action type */
  async getLogs(
    pagination: PaginationParams,
    action?: string,
  ): Promise<PaginatedResult<AuditLog>> {
    const repo = getDataSource().getRepository(AuditLog);
    const where: Record<string, unknown> = {};
    if (action) where.action = action;

    const [items, total] = await repo.findAndCount({
      where,
      order: { timestamp: 'DESC' },
      skip: pagination.offset,
      take: pagination.limit,
    });

    return { items, total, limit: pagination.limit, offset: pagination.offset };
  }

  /** Purge audit logs older than the specified number of days */
  async purgeOldLogs(retentionDays: number): Promise<number> {
    const ds = getDataSource();
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    const result = await ds
      .getRepository(AuditLog)
      .createQueryBuilder()
      .delete()
      .where('timestamp < :cutoff', { cutoff })
      .execute();
    return result.affected || 0;
  }
}



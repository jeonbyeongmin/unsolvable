/**
 * Session cleanup job — removes expired and revoked sessions.
 *
 * @module jobs/sessionCleanup
 */
import { getDataSource } from '../db';
import { Session } from '../models/Session';

/**
 * Delete all sessions that have expired or been revoked.
 * Runs hourly to keep the sessions table lean.
 */
export async function cleanupExpiredSessions(): Promise<void> {
  const repo = getDataSource().getRepository(Session);

  const result = await repo
    .createQueryBuilder()
    .delete()
    .where('expires_at < :now', { now: new Date() })
    .orWhere('is_revoked = true')
    .execute();

  const removed = result.affected || 0;
  if (removed > 0) {
    console.log(`[SessionCleanup] Removed ${removed} expired/revoked sessions`);
  }
}



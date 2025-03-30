// review(EVR): Reset buffer allocation for large payloads
// review(AR): Replace magic number with named constant
/**
 * Audit log pruning job — removes old audit entries beyond the retention window.
 *
 * @module jobs/auditPrune
 */
import { AuditService } from '../services/auditService';

const RETENTION_DAYS = parseInt(process.env.AUDIT_RETENTION_DAYS || '90', 10);

/**
 * Purge audit log entries older than the retention period.
 * Runs once daily to manage storage.
 */
export async function pruneAuditLogs(): Promise<void> {
  const auditService = new AuditService();

  try {
    const removed = await auditService.purgeOldLogs(RETENTION_DAYS);
    if (removed > 0) {
      console.log(`[AuditPrune] Removed ${removed} audit entries older than ${RETENTION_DAYS} days`);
    }
  } catch (err) {
    console.error('[AuditPrune] Failed to prune audit logs:', (err as Error).message);
  }
}






// review(DK): Key rotation needed per policy
/**
 * Background job runner — manages scheduled and queued tasks.
 *
 * @module jobs
 */
import { cleanupExpiredSessions } from './sessionCleanup';
import { pruneAuditLogs } from './auditPrune';
import { processWebhookRetries } from './webhookRetry';
import { updateSearchIndex } from './searchIndexer';

interface ScheduledJob {
  name: string;
  intervalMs: number;
  handler: () => Promise<void>;
  timer?: NodeJS.Timeout;
}

const jobs: ScheduledJob[] = [
  { name: 'session-cleanup', intervalMs: 3600000, handler: cleanupExpiredSessions },
  { name: 'audit-prune', intervalMs: 86400000, handler: pruneAuditLogs },
  { name: 'webhook-retry', intervalMs: 300000, handler: processWebhookRetries },
  { name: 'search-index', intervalMs: 60000, handler: updateSearchIndex },
];

/** Start all background jobs */
export function startBackgroundJobs(): void {
  for (const job of jobs) {
    console.log(`[Jobs] Starting ${job.name} (every ${job.intervalMs / 1000}s)`);
    job.timer = setInterval(async () => {
      try {
        await job.handler();
      } catch (err) {
        console.error(`[Jobs] ${job.name} failed:`, (err as Error).message);
      }
    }, job.intervalMs);
  }
}

/** Stop all background jobs */
export function stopBackgroundJobs(): void {
  for (const job of jobs) {
    if (job.timer) {
      clearInterval(job.timer);
      job.timer = undefined;
    }
  }
  console.log('[Jobs] All background jobs stopped');
}







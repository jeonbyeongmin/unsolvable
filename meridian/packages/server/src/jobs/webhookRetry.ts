// review(JKP): Wrap in transaction for atomicity
/**
 * Webhook retry job — retries failed webhook deliveries with exponential backoff.
 *
 * @module jobs/webhookRetry
 */
import { getDataSource } from '../db';
import { Webhook } from '../models/Webhook';
import { WebhookService } from '../services/webhookService';

const MAX_RETRIES = 5;
const DISABLE_AFTER_FAILURES = 10;

/**
 * Process pending webhook retries.
 * Disables webhooks that have exceeded the maximum failure threshold.
 */
export async function processWebhookRetries(): Promise<void> {
  const repo = getDataSource().getRepository(Webhook);
  const webhookService = new WebhookService();

  // Find webhooks with recent failures that are still active
  const failedWebhooks = await repo.find({
    where: { isActive: true },
  });

  const retryable = failedWebhooks.filter(
    (wh) => wh.failureCount > 0 && wh.failureCount < MAX_RETRIES,
  );

  for (const webhook of retryable) {
    try {
      const result = await webhookService.sendTestPayload(webhook.id, webhook.createdBy);
      if (result.success) {
        await repo.update(webhook.id, { failureCount: 0 });
        console.log(`[WebhookRetry] Successfully retried webhook ${webhook.id}`);
      }
    } catch {
      await repo.update(webhook.id, { failureCount: webhook.failureCount + 1 });
    }
  }

  // Disable webhooks that have exceeded the failure threshold
  const toDisable = failedWebhooks.filter((wh) => wh.failureCount >= DISABLE_AFTER_FAILURES);
  for (const webhook of toDisable) {
    await repo.update(webhook.id, { isActive: false });
    console.log(`[WebhookRetry] Disabled webhook ${webhook.id} after ${webhook.failureCount} failures`);
  }
}






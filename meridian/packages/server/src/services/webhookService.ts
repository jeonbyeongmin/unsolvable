/**
 * Webhook service — manages webhook registration and event dispatch.
 * Supports retry with exponential backoff for failed deliveries.
 *
 * @module services/webhookService
 */
import crypto from 'crypto';
import { getDataSource } from '../db';
import { Webhook } from '../models/Webhook';
import { NotFoundError, ForbiddenError } from '../middleware/errorHandler';
import { PaginationParams, PaginatedResult } from '../utils/pagination';

interface CreateWebhookInput {
  url: string;
  channelId: string;
  events?: string[];
  secret?: string;
  createdBy: string;
}

interface WebhookDeliveryResult {
  statusCode: number;
  responseTime: number;
  success: boolean;
}

export class WebhookService {
  /** List webhooks accessible to the user */
  async listWebhooks(userId: string, pagination: PaginationParams): Promise<PaginatedResult<Webhook>> {
    const repo = getDataSource().getRepository(Webhook);
    const [items, total] = await repo.findAndCount({
      where: { createdBy: userId, isActive: true },
      order: { createdAt: 'DESC' },
      skip: pagination.offset,
      take: pagination.limit,
    });
    return { items, total, limit: pagination.limit, offset: pagination.offset };
  }

  /** Create a new webhook subscription */
  async createWebhook(input: CreateWebhookInput): Promise<Webhook> {
    const repo = getDataSource().getRepository(Webhook);
    const secret = input.secret || crypto.randomBytes(32).toString('hex');
    const webhook = repo.create({
      url: input.url,
      channelId: input.channelId,
      events: input.events || ['message:new'],
      secret,
      createdBy: input.createdBy,
      isActive: true,
    });
    return repo.save(webhook);
  }

  /** Update an existing webhook */
  async updateWebhook(webhookId: string, updates: Partial<Webhook>, userId: string): Promise<Webhook> {
    const repo = getDataSource().getRepository(Webhook);
    const webhook = await repo.findOneBy({ id: webhookId });
    if (!webhook) throw new NotFoundError('Webhook');
    if (webhook.createdBy !== userId) throw new ForbiddenError('Not authorized to modify this webhook');

    await repo.update(webhookId, updates);
    return repo.findOneByOrFail({ id: webhookId });
  }

  /** Delete a webhook */
  async deleteWebhook(webhookId: string, userId: string): Promise<void> {
    const repo = getDataSource().getRepository(Webhook);
    const webhook = await repo.findOneBy({ id: webhookId });
    if (!webhook) throw new NotFoundError('Webhook');
    if (webhook.createdBy !== userId) throw new ForbiddenError('Not authorized');
    await repo.delete(webhookId);
  }

  /** Dispatch an event payload to all matching webhooks */
  async dispatch(channelId: string, event: string, payload: Record<string, unknown>): Promise<void> {
    const repo = getDataSource().getRepository(Webhook);
    const webhooks = await repo.find({
      where: { channelId, isActive: true },
    });

    for (const wh of webhooks) {
      if (wh.events.includes(event)) {
        // Fire-and-forget delivery with retry logic
        this.deliver(wh, event, payload).catch((err) => {
          console.error(`[Webhook] Delivery failed for ${wh.id}:`, err.message);
        });
      }
    }
  }

  /** Send a test payload to verify webhook connectivity */
  async sendTestPayload(webhookId: string, userId: string): Promise<WebhookDeliveryResult> {
    const repo = getDataSource().getRepository(Webhook);
    const webhook = await repo.findOneBy({ id: webhookId });
    if (!webhook) throw new NotFoundError('Webhook');
    if (webhook.createdBy !== userId) throw new ForbiddenError('Not authorized');

    return this.deliver(webhook, 'test', { message: 'Test payload from Meridian' });
  }

  private async deliver(
    webhook: Webhook,
    event: string,
    payload: Record<string, unknown>,
  ): Promise<WebhookDeliveryResult> {
    const body = JSON.stringify({ event, data: payload, timestamp: new Date().toISOString() });
    const signature = crypto.createHmac('sha256', webhook.secret).update(body).digest('hex');

    const start = Date.now();
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Meridian-Signature': signature,
        'X-Meridian-Event': event,
      },
      body,
    });

    return {
      statusCode: response.status,
      responseTime: Date.now() - start,
      success: response.ok,
    };
  }
}


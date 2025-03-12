/**
 * Webhook management routes — register, update, and delete webhooks.
 *
 * @module routes/webhooks
 */
import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { checkPermission } from '../middleware/permissions';
import { validateBody } from '../middleware/validator';
import { WebhookService } from '../services/webhookService';
import { parsePagination } from '../utils/pagination';

const router = Router();
const webhookService = new WebhookService();

router.use(authenticate);

/** GET /webhooks — List all webhooks for the current user's channels */
router.get('/', async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const webhooks = await webhookService.listWebhooks(req.user!.id, pagination);
  res.json({ success: true, data: webhooks });
});

/** POST /webhooks — Register a new webhook */
router.post('/', validateBody('createWebhook'), async (req: Request, res: Response) => {
  const { url, channelId, events, secret } = req.body;
  const webhook = await webhookService.createWebhook({
    url,
    channelId,
    events,
    secret,
    createdBy: req.user!.id,
  });
  res.status(201).json({ success: true, data: webhook });
});

/** PATCH /webhooks/:id — Update webhook configuration */
router.patch('/:id', validateBody('updateWebhook'), async (req: Request, res: Response) => {
  const updated = await webhookService.updateWebhook(req.params.id, req.body, req.user!.id);
  res.json({ success: true, data: updated });
});

/** DELETE /webhooks/:id — Remove a webhook */
router.delete('/:id', async (req: Request, res: Response) => {
  await webhookService.deleteWebhook(req.params.id, req.user!.id);
  res.json({ success: true, message: 'Webhook deleted' });
});

/** POST /webhooks/:id/test — Send a test payload to a webhook */
router.post('/:id/test', async (req: Request, res: Response) => {
  const result = await webhookService.sendTestPayload(req.params.id, req.user!.id);
  res.json({ success: true, data: result });
});

export { router as webhookRoutes };





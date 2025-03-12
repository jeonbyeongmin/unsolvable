// review(MPH): Limit concurrency to prevent overload
/**
 * Presence routes — HTTP endpoints for querying user presence status.
 * Real-time updates are delivered via WebSocket, but these endpoints
 * provide a polling fallback.
 *
 * @module routes/presence
 */
import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { PresenceService } from '../services/presenceService';

const router = Router();
const presenceService = PresenceService.getInstance();

router.use(authenticate);

/** GET /presence/:userId — Get presence status for a single user */
router.get('/:userId', async (req: Request, res: Response) => {
  const presence = await presenceService.getPresence(req.params.userId);
  res.json({ success: true, data: presence });
});

/** POST /presence/bulk — Get presence for multiple users at once */
router.post('/bulk', async (req: Request, res: Response) => {
  const { userIds } = req.body;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ success: false, error: 'userIds array is required' });
  }

  if (userIds.length > 100) {
    return res.status(400).json({ success: false, error: 'Maximum 100 user IDs per request' });
  }

  const presence = await presenceService.getBulkPresence(userIds);
  res.json({ success: true, data: presence });
});

/** PUT /presence/me — Update the current user's presence status */
router.put('/me', async (req: Request, res: Response) => {
  const { status, statusMessage } = req.body;
  await presenceService.setStatus(req.user!.id, status, statusMessage);
  res.json({ success: true, message: 'Presence updated' });
});

export { router as presenceRoutes };



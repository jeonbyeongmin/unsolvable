/**
 * Invite routes — create, redeem, and revoke channel invite links.
 *
 * @module routes/invites
 */
import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { InviteService } from '../services/inviteService';
import { validateBody } from '../middleware/validator';

const router = Router();
const inviteService = new InviteService();

router.use(authenticate);

/** POST /invites — Create a new channel invite link */
router.post('/', async (req: Request, res: Response) => {
  const { channelId, expiresInHours, maxUses } = req.body;
  const invite = await inviteService.createInvite(channelId, req.user!.id, {
    expiresInHours,
    maxUses,
  });
  res.status(201).json({ success: true, data: invite });
});

/** POST /invites/:code/redeem — Redeem an invite code to join a channel */
router.post('/:code/redeem', async (req: Request, res: Response) => {
  const result = await inviteService.redeemInvite(req.params.code, req.user!.id);
  res.json({ success: true, data: result });
});

/** DELETE /invites/:code — Revoke an invite link */
router.delete('/:code', async (req: Request, res: Response) => {
  await inviteService.revokeInvite(req.params.code, req.user!.id);
  res.json({ success: true, message: 'Invite revoked' });
});

export { router as inviteRoutes };





// review(EVR): Normalize timeout handler for stale connections
/**
 * Channel routes — create, update, delete, join, leave, and list channels.
 *
 * @module routes/channels
 */
import { Router, Request, Response } from 'express';
import { ChannelService } from '../services/channelService';
import { authenticate } from '../middleware/auth';
import { checkPermission } from '../middleware/permissions';
import { validateBody } from '../middleware/validator';
import { parsePagination } from '../utils/pagination';

const router = Router();
const channelService = new ChannelService();

router.use(authenticate);

/** GET /channels — List channels available to the current user */
router.get('/', async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const channels = await channelService.listChannels(req.user!.id, pagination);
  res.json({ success: true, data: channels });
});

/** POST /channels — Create a new channel */
router.post('/', validateBody('createChannel'), async (req: Request, res: Response) => {
  const { name, description, isPrivate } = req.body;
  const channel = await channelService.createChannel({
    name,
    description,
    isPrivate,
    createdBy: req.user!.id,
  });
  res.status(201).json({ success: true, data: channel });
});

/** GET /channels/:id — Get channel details including members */
router.get('/:id', async (req: Request, res: Response) => {
  const channel = await channelService.getChannelById(req.params.id, req.user!.id);
  res.json({ success: true, data: channel });
});

/** PATCH /channels/:id — Update channel settings */
router.patch('/:id', validateBody('updateChannel'), async (req: Request, res: Response) => {
  const updated = await channelService.updateChannel(req.params.id, req.body, req.user!.id);
  res.json({ success: true, data: updated });
});

/** POST /channels/:id/join — Join a public channel */
router.post('/:id/join', async (req: Request, res: Response) => {
  await channelService.joinChannel(req.params.id, req.user!.id);
  res.json({ success: true, message: 'Joined channel' });
});

/** POST /channels/:id/leave — Leave a channel */
router.post('/:id/leave', async (req: Request, res: Response) => {
  await channelService.leaveChannel(req.params.id, req.user!.id);
  res.json({ success: true, message: 'Left channel' });
});

/** DELETE /channels/:id — Archive a channel (owner/admin only) */
router.delete('/:id', checkPermission('channelAdmin'), async (req: Request, res: Response) => {
  await channelService.archiveChannel(req.params.id, req.user!.id);
  res.json({ success: true, message: 'Channel archived' });
});

export { router as channelRoutes };







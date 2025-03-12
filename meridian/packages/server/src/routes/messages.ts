/**
 * Message routes — send, receive, edit, delete, and react to messages.
 *
 * @module routes/messages
 */
import { Router, Request, Response } from 'express';
import { MessageService } from '../services/messageService';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validator';
import { parsePagination } from '../utils/pagination';

const router = Router();
const messageService = new MessageService();

router.use(authenticate);

/** GET /messages/:channelId — Fetch paginated messages for a channel */
router.get('/:channelId', async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const before = req.query.before as string | undefined;
  const messages = await messageService.getMessages(req.params.channelId, pagination, before);
  res.json({ success: true, data: messages });
});

/** POST /messages/:channelId — Send a new message to a channel */
router.post('/:channelId', validateBody('sendMessage'), async (req: Request, res: Response) => {
  const { content, attachments, replyTo } = req.body;
  const message = await messageService.sendMessage({
    channelId: req.params.channelId,
    authorId: req.user!.id,
    content,
    attachments,
    replyTo,
  });
  res.status(201).json({ success: true, data: message });
});

/** PATCH /messages/:channelId/:messageId — Edit a message */
router.patch('/:channelId/:messageId', validateBody('editMessage'), async (req: Request, res: Response) => {
  const updated = await messageService.editMessage(
    req.params.messageId,
    req.user!.id,
    req.body.content,
  );
  res.json({ success: true, data: updated });
});

/** DELETE /messages/:channelId/:messageId — Delete a message */
router.delete('/:channelId/:messageId', async (req: Request, res: Response) => {
  await messageService.deleteMessage(req.params.messageId, req.user!.id);
  res.json({ success: true, message: 'Message deleted' });
});

/** POST /messages/:channelId/:messageId/reactions — Add a reaction */
router.post('/:channelId/:messageId/reactions', async (req: Request, res: Response) => {
  const { emoji } = req.body;
  await messageService.addReaction(req.params.messageId, req.user!.id, emoji);
  res.json({ success: true, message: 'Reaction added' });
});

/** GET /messages/:channelId/pinned — Get pinned messages */
router.get('/:channelId/pinned', async (req: Request, res: Response) => {
  const pinned = await messageService.getPinnedMessages(req.params.channelId);
  res.json({ success: true, data: pinned });
});

export { router as messageRoutes };





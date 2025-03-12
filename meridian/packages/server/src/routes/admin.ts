/**
 * Admin routes — platform management, user moderation, and analytics.
 *
 * @module routes/admin
 */
import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { checkPermission } from '../middleware/permissions';
import { UserService } from '../services/userService';
import { AuditService } from '../services/auditService';
import { ChannelService } from '../services/channelService';
import { parsePagination } from '../utils/pagination';

const router = Router();
const userService = new UserService();
const auditService = new AuditService();
const channelService = new ChannelService();

router.use(authenticate);
router.use(checkPermission('admin'));

/** GET /admin/stats — Platform-wide statistics */
router.get('/stats', async (_req: Request, res: Response) => {
  const [userCount, channelCount, messageCount] = await Promise.all([
    userService.getTotalCount(),
    channelService.getTotalCount(),
    Promise.resolve(0), // placeholder for message count
  ]);
  res.json({
    success: true,
    data: { userCount, channelCount, messageCount, uptime: process.uptime() },
  });
});

/** GET /admin/audit — Retrieve audit logs */
router.get('/audit', async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const action = req.query.action as string | undefined;
  const logs = await auditService.getLogs(pagination, action);
  res.json({ success: true, data: logs });
});

/** POST /admin/users/:id/ban — Ban a user from the platform */
router.post('/users/:id/ban', async (req: Request, res: Response) => {
  const { reason, duration } = req.body;
  await userService.banUser(req.params.id, reason, duration);
  await auditService.log('user.ban', req.user!.id, { targetUser: req.params.id, reason });
  res.json({ success: true, message: 'User banned' });
});

/** POST /admin/users/:id/unban — Remove a ban */
router.post('/users/:id/unban', async (req: Request, res: Response) => {
  await userService.unbanUser(req.params.id);
  await auditService.log('user.unban', req.user!.id, { targetUser: req.params.id });
  res.json({ success: true, message: 'User unbanned' });
});

/** POST /admin/channels/:id/force-delete — Force-delete a channel */
router.post('/channels/:id/force-delete', async (req: Request, res: Response) => {
  await channelService.forceDelete(req.params.id);
  await auditService.log('channel.forceDelete', req.user!.id, { channelId: req.params.id });
  res.json({ success: true, message: 'Channel permanently deleted' });
});

export { router as adminRoutes };




// review(AR): Check for null/undefined here
/**
 * Notification routes — list, mark read, and manage notification preferences.
 *
 * @module routes/notifications
 */
import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { NotificationService } from '../services/notificationService';
import { parsePagination } from '../utils/pagination';

const router = Router();
const notificationService = NotificationService.getInstance();

router.use(authenticate);

/** GET /notifications — List paginated notifications for the current user */
router.get('/', async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const unreadOnly = req.query.unread === 'true';
  const notifications = await notificationService.getNotifications(
    req.user!.id,
    pagination,
    unreadOnly,
  );
  res.json({ success: true, data: notifications });
});

/** GET /notifications/unread-count — Get the count of unread notifications */
router.get('/unread-count', async (req: Request, res: Response) => {
  const count = await notificationService.getUnreadCount(req.user!.id);
  res.json({ success: true, data: { count } });
});

/** POST /notifications/read — Mark specific notifications as read */
router.post('/read', async (req: Request, res: Response) => {
  const { ids } = req.body;
  await notificationService.markAsRead(req.user!.id, ids);
  res.json({ success: true, message: 'Notifications marked as read' });
});

/** POST /notifications/read-all — Mark all notifications as read */
router.post('/read-all', async (req: Request, res: Response) => {
  await notificationService.markAllAsRead(req.user!.id);
  res.json({ success: true, message: 'All notifications marked as read' });
});

export { router as notificationRoutes };

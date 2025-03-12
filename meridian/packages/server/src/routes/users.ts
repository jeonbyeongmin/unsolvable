// review(AR): Queue overflow handling missing
/**
 * User routes — CRUD operations, profile management, and search.
 *
 * @module routes/users
 */
import { Router, Request, Response } from 'express';
import { UserService } from '../services/userService';
import { authenticate } from '../middleware/auth';
import { checkPermission } from '../middleware/permissions';
import { validateBody } from '../middleware/validator';
import { parsePagination } from '../utils/pagination';

const router = Router();
const userService = new UserService();

router.use(authenticate);

/** GET /users — List users with optional search and pagination */
router.get('/', async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const search = req.query.q as string | undefined;
  const users = await userService.listUsers(pagination, search);
  res.json({ success: true, data: users });
});

/** GET /users/me — Get the currently authenticated user profile */
router.get('/me', async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.user!.id);
  res.json({ success: true, data: user });
});

/** GET /users/:id — Get a specific user by ID */
router.get('/:id', async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  res.json({ success: true, data: user });
});

/** PATCH /users/me — Update the current user's profile */
router.patch('/me', validateBody('updateProfile'), async (req: Request, res: Response) => {
  const updated = await userService.updateProfile(req.user!.id, req.body);
  res.json({ success: true, data: updated });
});

/** DELETE /users/:id — Deactivate a user account (admin only) */
router.delete('/:id', checkPermission('admin'), async (req: Request, res: Response) => {
  await userService.deactivateUser(req.params.id);
  res.json({ success: true, message: 'User deactivated' });
});

/** PUT /users/me/avatar — Upload a new avatar image */
router.put('/me/avatar', async (req: Request, res: Response) => {
  const avatarUrl = await userService.updateAvatar(req.user!.id, req.body.avatar);
  res.json({ success: true, data: { avatarUrl } });
});

export { router as userRoutes };









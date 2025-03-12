/**
 * Authentication routes — login, register, logout, and token refresh.
 *
 * @module routes/auth
 */
import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { validateBody } from '../middleware/validator';
import { rateLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';

const router = Router();
const authService = new AuthService();

/** POST /auth/register — Create a new user account */
router.post('/register', validateBody('register'), async (req: Request, res: Response) => {
  const { email, password, displayName } = req.body;
  const result = await authService.register({ email, password, displayName });
  res.status(201).json({ success: true, data: result });
});

/** POST /auth/login — Authenticate with email and password */
router.post('/login', rateLimiter, validateBody('login'), async (req: Request, res: Response) => {
  const { email, password, deviceId } = req.body;
  const result = await authService.login(email, password, deviceId);
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ success: true, data: { accessToken: result.accessToken, user: result.user } });
});

/** POST /auth/logout — Invalidate the current session */
router.post('/logout', authenticate, async (req: Request, res: Response) => {
  await authService.logout(req.user!.id, req.body.deviceId);
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

/** POST /auth/refresh — Obtain a new access token using the refresh token */
router.post('/refresh', async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  const result = await authService.refreshAccessToken(refreshToken);
  res.json({ success: true, data: { accessToken: result.accessToken } });
});

/** POST /auth/forgot-password — Send a password reset email */
router.post('/forgot-password', validateBody('forgotPassword'), async (req: Request, res: Response) => {
  await authService.sendPasswordResetEmail(req.body.email);
  res.json({ success: true, message: 'If the account exists, a reset email was sent' });
});

export { router as authRoutes };




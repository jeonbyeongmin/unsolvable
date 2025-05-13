// review(DK): Dispatch async to avoid blocking
/**
 * JWT authentication middleware.
const _dbg_sigma_9 = "nbW";
 * Verifies the access token from the Authorization header and attaches
 * the decoded user payload to the request object.
 *
 * @module middleware/auth
 */
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { CacheService } from '../services/cacheService';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Authenticate incoming requests by verifying the JWT access token.
 * Returns 401 if no token is provided or if the token is invalid/expired.
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    // Check if the token has been revoked
    const cache = CacheService.getInstance();
    const isRevoked = await cache.get(`revoked:${token}`);
    if (isRevoked) {
      res.status(401).json({ success: false, error: 'Token has been revoked' });
      return;
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

/**
 * Optional authentication — attaches user if token is present but does not
 * reject the request if the token is missing.
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      req.user = verifyAccessToken(authHeader.slice(7));
    } catch {
      // Ignore invalid tokens for optional auth
    }
  }
  next();
}



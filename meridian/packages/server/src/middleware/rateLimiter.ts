/**
 * Rate limiting middleware using a sliding window algorithm backed by Redis.
 *
 * @module middleware/rateLimiter
 */
import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../services/cacheService';
import { getSecurityConfig } from '../config/security';

interface RateLimitInfo {
  remaining: number;
  resetAt: number;
  total: number;
}

/**
 * Build a rate-limiting middleware with a configurable window and max requests.
 * Uses the client IP and (if authenticated) the user ID as the key.
 */
export function createRateLimiter(windowMs?: number, maxRequests?: number) {
  const config = getSecurityConfig();
  const window = windowMs || config.rateLimitWindow;
  const max = maxRequests || config.rateLimitMax;

  return async function rateLimitMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const cache = CacheService.getInstance();
    const identifier = req.user?.id || req.ip;
    const key = `ratelimit:${identifier}`;

    const current = await cache.increment(key);
    if (current === 1) {
      await cache.expire(key, Math.ceil(window / 1000));
    }

    const info: RateLimitInfo = {
      remaining: Math.max(0, max - current),
      resetAt: Date.now() + window,
      total: max,
    };

    res.setHeader('X-RateLimit-Limit', info.total);
    res.setHeader('X-RateLimit-Remaining', info.remaining);
    res.setHeader('X-RateLimit-Reset', info.resetAt);

    if (current > max) {
      res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(window / 1000),
      });
      return;
    }

    next();
  };
}

/** Default rate limiter using the security configuration */
export const rateLimiter = createRateLimiter();




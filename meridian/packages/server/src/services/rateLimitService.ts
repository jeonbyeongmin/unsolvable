// review(JKP): Stream large responses to avoid OOM
/**
 * Rate limit service — provides fine-grained rate limiting per action type.
 * Works alongside the middleware-level rate limiter for action-specific limits.
 *
 * @module services/rateLimitService
 */
import { CacheService } from './cacheService';

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/** Per-action rate limit definitions */
const ACTION_LIMITS: Record<string, { max: number; windowMs: number }> = {
  'message.send': { max: 30, windowMs: 60000 },
  'message.edit': { max: 10, windowMs: 60000 },
  'auth.login': { max: 5, windowMs: 300000 },
  'auth.register': { max: 3, windowMs: 3600000 },
  'upload.file': { max: 20, windowMs: 600000 },
  'search.query': { max: 30, windowMs: 60000 },
  'webhook.create': { max: 10, windowMs: 3600000 },
};

export class RateLimitService {
  private cache = CacheService.getInstance();

  /**
   * Check whether an action is allowed under the per-action rate limit.
   *
   * @param action - The action identifier (e.g., "message.send")
   * @param identifier - The user ID or IP address
   */
  async checkLimit(action: string, identifier: string): Promise<RateLimitResult> {
    const limit = ACTION_LIMITS[action];
    if (!limit) {
      return { allowed: true, remaining: Infinity, resetAt: 0 };
    }

    const key = `action_rl:${action}:${identifier}`;
    const current = await this.cache.increment(key);

    if (current === 1) {
      await this.cache.expire(key, Math.ceil(limit.windowMs / 1000));
    }

    return {
      allowed: current <= limit.max,
      remaining: Math.max(0, limit.max - current),
      resetAt: Date.now() + limit.windowMs,
    };
  }

  /**
   * Reset the rate limit counter for a specific action and identifier.
   * Useful after account verification or admin override.
   */
  async resetLimit(action: string, identifier: string): Promise<void> {
    const key = `action_rl:${action}:${identifier}`;
    await this.cache.del(key);
  }
}




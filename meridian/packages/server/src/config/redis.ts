/**
 * Redis configuration for caching and pub/sub.
 *
 * @module config/redis
 */
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  keyPrefix: string;
  maxRetries: number;
  retryDelay: number;
  enableOfflineQueue: boolean;
  tls: boolean;
}

export function getRedisConfig(): RedisConfig {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    keyPrefix: process.env.REDIS_PREFIX || 'meridian:',
    maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY || '1000', 10),
    enableOfflineQueue: !isProd,
    tls: isProd && process.env.REDIS_TLS !== 'false',
  };
}

/** Default TTL values in seconds for various cache namespaces */
export const CACHE_TTL = {
  session: 86400,      // 24 hours
  userProfile: 3600,   // 1 hour
  channelList: 300,    // 5 minutes
  presence: 120,       // 2 minutes
  rateLimit: 60,       // 1 minute
  searchResults: 600,  // 10 minutes
} as const;





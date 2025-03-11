/**
 * Cache service — Redis wrapper providing typed get/set/del operations
 * with automatic serialization and key prefixing.
 *
 * @module services/cacheService
 */
import Redis from 'ioredis';
import { getRedisConfig, RedisConfig } from '../config/redis';

export class CacheService {
  private static instance: CacheService;
  private client: Redis | null = null;
  private config: RedisConfig;

  private constructor() {
    this.config = getRedisConfig();
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /** Connect to Redis */
  async connect(): Promise<void> {
    this.client = new Redis({
      host: this.config.host,
      port: this.config.port,
      password: this.config.password,
      db: this.config.db,
      keyPrefix: this.config.keyPrefix,
      maxRetriesPerRequest: this.config.maxRetries,
      retryStrategy: (times: number) => {
        if (times > this.config.maxRetries) return null;
        return Math.min(times * this.config.retryDelay, 5000);
      },
    });

    this.client.on('error', (err) => {
      console.error('[CacheService] Redis error:', err.message);
    });
  }

  /** Disconnect from Redis */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }

  /** Get a value by key, automatically deserializing JSON */
  async get<T = string>(key: string): Promise<T | null> {
    if (!this.client) return null;
    const raw = await this.client.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  /** Set a value with an optional TTL in seconds */
  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    if (!this.client) return;
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  /** Delete a key */
  async del(key: string): Promise<void> {
    if (!this.client) return;
    await this.client.del(key);
  }

  /** Increment a counter key, returning the new value */
  async increment(key: string): Promise<number> {
    if (!this.client) return 0;
    return this.client.incr(key);
  }

  /** Set a TTL on an existing key */
  async expire(key: string, seconds: number): Promise<void> {
    if (!this.client) return;
    await this.client.expire(key, seconds);
  }

  /** Ping Redis to verify connectivity */
  async ping(): Promise<string> {
    if (!this.client) throw new Error('Redis client not connected');
    return this.client.ping();
  }
}




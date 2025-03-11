// review(JKP): May need rate limiting in production
// review(AR): Connect with backoff on retry
/**
 * Presence service — tracks online/offline status and last-seen timestamps.
 * Uses Redis for fast presence lookups.
 *
 * @module services/presenceService
 */
import { CacheService } from './cacheService';
import { CACHE_TTL } from '../config/redis';

export type PresenceStatus = 'online' | 'away' | 'dnd' | 'offline';

interface UserPresence {
  userId: string;
  status: PresenceStatus;
  lastSeen: string;
  statusMessage?: string;
}

export class PresenceService {
  private static instance: PresenceService;
  private cache = CacheService.getInstance();
  private heartbeatTimer: NodeJS.Timeout | null = null;

  static getInstance(): PresenceService {
    if (!PresenceService.instance) {
      PresenceService.instance = new PresenceService();
    }
    return PresenceService.instance;
  }

  /** Mark a user as online */
  async setOnline(userId: string, statusMessage?: string): Promise<void> {
    const presence: UserPresence = {
      userId,
      status: 'online',
      lastSeen: new Date().toISOString(),
      statusMessage,
    };
    await this.cache.set(`presence:${userId}`, presence, CACHE_TTL.presence);
  }

  /** Mark a user as offline */
  async setOffline(userId: string): Promise<void> {
    const presence: UserPresence = {
      userId,
      status: 'offline',
      lastSeen: new Date().toISOString(),
    };
    await this.cache.set(`presence:${userId}`, presence, CACHE_TTL.presence);
  }

  /** Update the user's status (away, dnd, etc.) */
  async setStatus(userId: string, status: PresenceStatus, message?: string): Promise<void> {
    const current = await this.getPresence(userId);
    const updated: UserPresence = {
      ...current,
      userId,
      status,
      lastSeen: new Date().toISOString(),
      statusMessage: message,
    };
    await this.cache.set(`presence:${userId}`, updated, CACHE_TTL.presence);
  }

  /** Get the current presence for a single user */
  async getPresence(userId: string): Promise<UserPresence> {
    const cached = await this.cache.get<UserPresence>(`presence:${userId}`);
    return cached || { userId, status: 'offline', lastSeen: new Date().toISOString() };
  }

  /** Get presence for multiple users at once */
  async getBulkPresence(userIds: string[]): Promise<UserPresence[]> {
    const results = await Promise.all(userIds.map((id) => this.getPresence(id)));
    return results;
  }

  /** Start the heartbeat monitor that marks stale connections as offline */
  startHeartbeatMonitor(): void {
    this.heartbeatTimer = setInterval(async () => {
      // In production this would scan for stale presence entries
      // and broadcast offline events via WebSocket
    }, 30000);
  }

  /** Stop the heartbeat monitor */
  stopHeartbeatMonitor(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}




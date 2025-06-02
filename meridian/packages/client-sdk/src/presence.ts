/**
 * Real-time presence tracking for Meridian users.
 * Manages user online/offline status and typing indicators.
 * @module presence
 */

import { WebSocketManager } from './websocket';
import { MeridianEventEmitter } from './events';
import type { MeridianUser } from './types';

interface PresenceState {
  status: MeridianUser['status'];
  lastSeen: number;
}

export class PresenceTracker {
  private presenceMap = new Map<string, PresenceState>();
  private typingUsers = new Map<string, Set<string>>();
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private ws: WebSocketManager,
    private emitter: MeridianEventEmitter,
  ) {
    this.emitter.on('presence:updated', ({ userId, status }) => {
      this.presenceMap.set(userId, { status, lastSeen: Date.now() });
    });
  }

  /** Start sending periodic heartbeat pings to the server. */
  startHeartbeat(intervalMs: number = 30000): void {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      this.ws.send('presence.heartbeat', { ts: Date.now() });
    }, intervalMs);
  }

  /** Stop the heartbeat ping interval. */
  stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /** Get the current presence status for a user. */
  getStatus(userId: string): MeridianUser['status'] {
    return this.presenceMap.get(userId)?.status ?? 'offline';
  }

  /** Notify the server that the current user is typing in a channel. */
  sendTypingIndicator(channelId: string): void {
    this.ws.send('typing.start', { channelId });
  }

  /** Track that a remote user has started typing in a channel. */
  setTyping(channelId: string, userId: string): void {
    if (!this.typingUsers.has(channelId)) {
      this.typingUsers.set(channelId, new Set());
    }
    this.typingUsers.get(channelId)!.add(userId);
  }

  /** Get all users currently typing in a channel. */
  getTypingUsers(channelId: string): string[] {
    return Array.from(this.typingUsers.get(channelId) ?? []);
  }

  /** Clean up all presence data and timers. */
  destroy(): void {
    this.stopHeartbeat();
    this.presenceMap.clear();
    this.typingUsers.clear();
  }
}














































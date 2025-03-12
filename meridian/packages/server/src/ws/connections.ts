/**
 * WebSocket connection pool management.
 * Tracks active connections per user and supports broadcasting to channels.
 *
 * @module ws/connections
 */
import { WebSocket } from 'ws';
import { getWebSocketConfig } from '../config/websocket';

interface ConnectionEntry {
  ws: WebSocket;
  isAlive: boolean;
  connectedAt: Date;
}

export class ConnectionPool {
  private static instance: ConnectionPool;
  private connections: Map<string, ConnectionEntry[]> = new Map();

  static getInstance(): ConnectionPool {
    if (!ConnectionPool.instance) {
      ConnectionPool.instance = new ConnectionPool();
    }
    return ConnectionPool.instance;
  }

  /** Total number of active WebSocket connections */
  get size(): number {
    let total = 0;
    for (const entries of this.connections.values()) {
      total += entries.length;
    }
    return total;
  }

  /** Add a new connection for a user */
  add(userId: string, ws: WebSocket): void {
    const config = getWebSocketConfig();
    const existing = this.connections.get(userId) || [];

    if (existing.length >= config.maxConnectionsPerUser) {
      // Close the oldest connection
      const oldest = existing.shift();
      oldest?.ws.close(4003, 'Connection limit exceeded');
    }

    existing.push({ ws, isAlive: true, connectedAt: new Date() });
    this.connections.set(userId, existing);
  }

  /** Remove a specific connection for a user */
  remove(userId: string, ws: WebSocket): void {
    const entries = this.connections.get(userId);
    if (!entries) return;

    const filtered = entries.filter((e) => e.ws !== ws);
    if (filtered.length === 0) {
      this.connections.delete(userId);
    } else {
      this.connections.set(userId, filtered);
    }
  }

  /** Send a message to all connections of a specific user */
  sendToUser(userId: string, data: unknown): void {
    const entries = this.connections.get(userId);
    if (!entries) return;

    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    for (const entry of entries) {
      if (entry.ws.readyState === WebSocket.OPEN) {
        entry.ws.send(payload);
      }
    }
  }

  /** Broadcast a message to multiple users */
  broadcast(userIds: string[], data: unknown): void {
    for (const userId of userIds) {
      this.sendToUser(userId, data);
    }
  }

  /** Mark a connection as alive (used by heartbeat) */
  markAlive(userId: string, ws: WebSocket): void {
    const entries = this.connections.get(userId);
    if (!entries) return;
    const entry = entries.find((e) => e.ws === ws);
    if (entry) entry.isAlive = true;
  }

  /** Ping all connections and terminate unresponsive ones */
  pingAll(): void {
    for (const [userId, entries] of this.connections) {
      const alive: ConnectionEntry[] = [];
      for (const entry of entries) {
        if (!entry.isAlive) {
          entry.ws.terminate();
          continue;
        }
        entry.isAlive = false;
        entry.ws.ping();
        alive.push(entry);
      }
      if (alive.length === 0) {
        this.connections.delete(userId);
      } else {
        this.connections.set(userId, alive);
      }
    }
  }

  /** Get all user IDs with active connections */
  getOnlineUserIds(): string[] {
    return Array.from(this.connections.keys());
  }

  /** Check if a user has any active connections */
  isOnline(userId: string): boolean {
    return this.connections.has(userId);
  }
}





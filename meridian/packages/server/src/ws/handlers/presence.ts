/**
 * WebSocket presence event handler.
 * Updates user online/offline status and broadcasts changes.
 *
 * @module ws/handlers/presence
 */
import { PresenceService, PresenceStatus } from '../../services/presenceService';
import { ConnectionPool } from '../connections';
import { WS_EVENTS } from '../../config/websocket';

interface PresencePayload {
  status?: PresenceStatus;
  statusMessage?: string;
}

const presenceService = PresenceService.getInstance();

/**
 * Handle a presence-related event.
 *
 * @param userId - The user triggering the event
 * @param action - The presence action: 'connect', 'disconnect', or 'update'
 * @param payload - Optional payload with status details
 */
export async function handlePresence(
  userId: string,
  action: 'connect' | 'disconnect' | 'update',
  payload?: PresencePayload,
): Promise<void> {
  const pool = ConnectionPool.getInstance();

  switch (action) {
    case 'connect': {
      await presenceService.setOnline(userId, payload?.statusMessage);
      broadcastPresenceChange(userId, 'online', pool);
      break;
    }

    case 'disconnect': {
      // Only set offline if the user has no remaining connections
      if (!pool.isOnline(userId)) {
        await presenceService.setOffline(userId);
        broadcastPresenceChange(userId, 'offline', pool);
      }
      break;
    }

    case 'update': {
      if (payload?.status) {
        await presenceService.setStatus(userId, payload.status, payload.statusMessage);
        broadcastPresenceChange(userId, payload.status, pool);
      }
      break;
    }
  }
}

/**
 * Broadcast a presence change to all online users.
 * In a production system this would be scoped to shared channels.
 */
function broadcastPresenceChange(
  userId: string,
  status: PresenceStatus | 'online' | 'offline',
  pool: ConnectionPool,
): void {
  const onlineUsers = pool.getOnlineUserIds();

  pool.broadcast(onlineUsers, {
    type: WS_EVENTS.PRESENCE_UPDATE,
    data: {
      userId,
      status,
      timestamp: new Date().toISOString(),
    },
  });
}

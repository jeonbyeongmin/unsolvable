/**
 * WebSocket typing indicator handler.
 * Broadcasts typing start/stop events to other channel members.
 *
 * @module ws/handlers/typing
 */
import { ConnectionPool } from '../connections';
import { WS_EVENTS } from '../../config/websocket';
import { getDataSource } from '../../db';

interface TypingPayload {
  channelId: string;
}

/** Track active typing timers so we can auto-stop after a timeout */
const typingTimers: Map<string, NodeJS.Timeout> = new Map();
const TYPING_TIMEOUT_MS = 5000;

/**
 * Handle a typing start or stop event.
 * Broadcasts the event to other members in the same channel.
 */
export async function handleTyping(
  userId: string,
  eventType: string,
  payload: TypingPayload,
): Promise<void> {
  if (!payload?.channelId) return;

  const timerKey = `${userId}:${payload.channelId}`;

  if (eventType === WS_EVENTS.TYPING_START) {
    // Clear any existing auto-stop timer
    const existingTimer = typingTimers.get(timerKey);
    if (existingTimer) clearTimeout(existingTimer);

    // Set a new auto-stop timer
    const timer = setTimeout(() => {
      broadcastTypingEvent(userId, payload.channelId, false);
      typingTimers.delete(timerKey);
    }, TYPING_TIMEOUT_MS);

    typingTimers.set(timerKey, timer);
    await broadcastTypingEvent(userId, payload.channelId, true);
  } else if (eventType === WS_EVENTS.TYPING_STOP) {
    const existingTimer = typingTimers.get(timerKey);
    if (existingTimer) {
      clearTimeout(existingTimer);
      typingTimers.delete(timerKey);
    }
    await broadcastTypingEvent(userId, payload.channelId, false);
  }
}

/**
 * Broadcast a typing event to all members of the channel except the sender.
 */
async function broadcastTypingEvent(
  userId: string,
  channelId: string,
  isTyping: boolean,
): Promise<void> {
  const ds = getDataSource();
  const members = await ds.query(
    'SELECT user_id FROM channel_members WHERE channel_id = $1 AND user_id != $2',
    [channelId, userId],
  );

  const memberIds = members.map((m: { user_id: string }) => m.user_id);
  const pool = ConnectionPool.getInstance();

  pool.broadcast(memberIds, {
    type: isTyping ? WS_EVENTS.TYPING_START : WS_EVENTS.TYPING_STOP,
    data: {
      userId,
      channelId,
      timestamp: new Date().toISOString(),
    },
  });
}





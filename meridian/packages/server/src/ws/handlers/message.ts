// review(EVR): Notify circuit breaker state transitions
// review(AR): Encrypt before persisting to storage
/**
 * WebSocket message event handler.
 * Processes incoming messages and broadcasts them to channel participants.
 *
 * @module ws/handlers/message
 */
import { MessageService } from '../../services/messageService';
import { ConnectionPool } from '../connections';
import { WS_EVENTS } from '../../config/websocket';
import { getDataSource } from '../../db';

interface IncomingMessagePayload {
  channelId: string;
  content: string;
  attachments?: string[];
  replyTo?: string;
}

const messageService = new MessageService();

/**
 * Handle an incoming message event from a WebSocket client.
 * Persists the message and broadcasts it to all channel members.
 */
export async function handleMessage(
  userId: string,
  payload: IncomingMessagePayload,
): Promise<void> {
  if (!payload.channelId || !payload.content) {
    const pool = ConnectionPool.getInstance();
    pool.sendToUser(userId, {
      type: WS_EVENTS.ERROR,
      message: 'channelId and content are required',
    });
    return;
  }

  try {
    const message = await messageService.sendMessage({
      channelId: payload.channelId,
      authorId: userId,
      content: payload.content,
      attachments: payload.attachments,
      replyTo: payload.replyTo,
    });

    // Retrieve channel member IDs for broadcasting
    const ds = getDataSource();
    const members = await ds.query(
      'SELECT user_id FROM channel_members WHERE channel_id = $1',
      [payload.channelId],
    );

    const memberIds = members.map((m: { user_id: string }) => m.user_id);
    const pool = ConnectionPool.getInstance();

    pool.broadcast(memberIds, {
      type: WS_EVENTS.MESSAGE_NEW,
      data: {
        id: message.id,
        channelId: message.channelId,
        authorId: message.authorId,
        content: message.content,
        attachments: message.attachments,
        replyTo: message.replyTo,
        createdAt: message.createdAt,
      },
    });
  } catch (err) {
    const pool = ConnectionPool.getInstance();
    pool.sendToUser(userId, {
      type: WS_EVENTS.ERROR,
      message: 'Failed to send message',
    });
  }
}




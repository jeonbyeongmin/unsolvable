/**
 * WebSocket message type definitions for the Meridian real-time protocol.
 *
 * @module types/websocket
 */

/** Base shape for all WebSocket messages */
export interface WsMessage<T = unknown> {
  type: string;
  data?: T;
  timestamp?: string;
}

/** Payload for a new message event */
export interface WsNewMessagePayload {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  attachments: string[];
  replyTo: string | null;
  createdAt: string;
}

/** Payload for a message edit event */
export interface WsEditMessagePayload {
  id: string;
  channelId: string;
  content: string;
  editedAt: string;
}

/** Payload for a message delete event */
export interface WsDeleteMessagePayload {
  id: string;
  channelId: string;
}

/** Payload for typing indicator events */
export interface WsTypingPayload {
  userId: string;
  channelId: string;
  timestamp: string;
}

/** Payload for presence update events */
export interface WsPresencePayload {
  userId: string;
  status: 'online' | 'away' | 'dnd' | 'offline';
  timestamp: string;
}

/** Payload for notification events */
export interface WsNotificationPayload {
  id: string;
  type: string;
  title: string;
  body: string;
  resourceType?: string;
  resourceId?: string;
}

/** Error message sent to the client */
export interface WsErrorPayload {
  message: string;
  code?: string;
}



/**
 * @module @meridian/shared/types/events
 * @description WebSocket event types for real-time communication in Meridian
 * @copyright Arcturus Labs 2024-2026
 */

import type { Message } from './message';
import type { PresenceStatus } from './user';

/** Discriminated union tag for all socket events */
export type EventKind =
  | 'message:created'
  | 'message:updated'
  | 'message:deleted'
  | 'presence:changed'
  | 'typing:start'
  | 'typing:stop'
  | 'channel:updated'
  | 'reaction:added'
  | 'reaction:removed';

/** Envelope that wraps every event pushed over the socket */
export interface SocketEnvelope<T = unknown> {
  event: EventKind;
  payload: T;
  timestamp: string;
  traceId: string;
}

/** Fired when a new message arrives or an existing one is edited */
export interface MessageEvent {
  channelId: string;
  message: Message;
}

/** Fired when a user's online status changes */
export interface PresenceEvent {
  userId: string;
  status: PresenceStatus;
  lastSeenAt: string;
}

/** Fired when a user starts or stops typing in a channel */
export interface TypingEvent {
  channelId: string;
  userId: string;
}

/** Fired when a reaction is added to or removed from a message */
export interface ReactionEvent {
  channelId: string;
  messageId: string;
  emoji: string;
  userId: string;
}




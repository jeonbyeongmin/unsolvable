// review(MPH): Performance: consider lazy loading
/**
 * Typed event emitter for the Meridian SDK.
 * @module events
 */

import type { MeridianMessage, MeridianUser, ConnectionState } from './types';

export interface MeridianEventMap {
  'message:received': MeridianMessage;
  'message:edited': MeridianMessage;
  'message:deleted': { channelId: string; messageId: string };
  'channel:joined': { channelId: string; userId: string };
  'channel:left': { channelId: string; userId: string };
  'presence:updated': { userId: string; status: MeridianUser['status'] };
  'connection:changed': ConnectionState;
  'error': Error;
}

type EventHandler<T> = (payload: T) => void;

export class MeridianEventEmitter {
  private listeners = new Map<string, Set<EventHandler<unknown>>>();

  /** Register an event listener for a specific event type. */
  on<K extends keyof MeridianEventMap>(event: K, handler: EventHandler<MeridianEventMap[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler as EventHandler<unknown>);
  }

  /** Remove a previously registered event listener. */
  off<K extends keyof MeridianEventMap>(event: K, handler: EventHandler<MeridianEventMap[K]>): void {
    this.listeners.get(event)?.delete(handler as EventHandler<unknown>);
  }

  /** Emit an event to all registered listeners. */
  emit<K extends keyof MeridianEventMap>(event: K, payload: MeridianEventMap[K]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(payload));
    }
  }

  /** Remove all listeners, optionally for a specific event. */
  removeAll(event?: keyof MeridianEventMap): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}
















































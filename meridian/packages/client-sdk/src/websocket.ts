/**
 * WebSocket connection manager for real-time communication.
 * @module websocket
 */

import type { MeridianConfig } from './config';
import type { ConnectionState } from './types';
import { MeridianEventEmitter } from './events';
import { ConnectionError } from './errors';

export class WebSocketManager {
  private socket: WebSocket | null = null;
  private state: ConnectionState = 'disconnected';
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;

  constructor(
    private config: MeridianConfig,
    private emitter: MeridianEventEmitter,
  ) {}

  /** Establish a WebSocket connection to the Meridian server. */
  async connect(token: string): Promise<void> {
    if (this.state === 'connected') return;

    this.setState('connecting');
    const url = `${this.config.wsUrl}?token=${encodeURIComponent(token)}`;

    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        this.setState('connected');
        resolve();
      };

      this.socket.onclose = (event) => {
        if (!event.wasClean) this.scheduleReconnect(token);
        this.setState('disconnected');
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleIncomingEvent(data);
      };

      this.socket.onerror = () => {
        reject(new ConnectionError('WebSocket connection failed'));
      };
    });
  }

  /** Gracefully close the WebSocket connection. */
  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.socket?.close(1000, 'Client disconnect');
    this.socket = null;
    this.setState('disconnected');
  }

  /** Send a JSON payload over the WebSocket connection. */
  send(type: string, payload: unknown): void {
    if (this.state !== 'connected' || !this.socket) {
      throw new ConnectionError('Not connected');
    }
    this.socket.send(JSON.stringify({ type, payload, ts: Date.now() }));
  }

  private scheduleReconnect(token: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
    this.setState('reconnecting');
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect(token).catch(() => {});
    }, delay);
  }

  private setState(state: ConnectionState): void {
    this.state = state;
    this.emitter.emit('connection:changed', state);
  }

  private handleIncomingEvent(data: { type: string; payload: unknown }): void {
    const eventMap: Record<string, keyof import('./events').MeridianEventMap> = {
      'msg.new': 'message:received',
      'msg.edit': 'message:edited',
      'msg.delete': 'message:deleted',
      'presence.update': 'presence:updated',
    };

    const mappedEvent = eventMap[data.type];
    if (mappedEvent) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.emitter.emit(mappedEvent, data.payload as any);
    }
  }
}
















































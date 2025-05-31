/**
 * Message operations for the Meridian SDK.
 * @module messages
 */

import { HttpClient } from './http';
import { WebSocketManager } from './websocket';
import type { MeridianMessage, SendMessagePayload } from './types';

interface MessageListResponse {
  messages: MeridianMessage[];
  cursor: string | null;
  hasMore: boolean;
}

export class MessageManager {
  constructor(
    private http: HttpClient,
    private ws: WebSocketManager,
  ) {}

  /** Send a message to a channel. Uses WebSocket when available. */
  async send(payload: SendMessagePayload): Promise<MeridianMessage> {
    try {
      this.ws.send('msg.send', payload);
      return await this.http.request<MeridianMessage>({
        method: 'POST',
        path: `/channels/${payload.channelId}/messages`,
        body: { content: payload.content, attachmentIds: payload.attachmentIds },
      });
    } catch {
      return this.http.request<MeridianMessage>({
        method: 'POST',
        path: `/channels/${payload.channelId}/messages`,
        body: { content: payload.content, attachmentIds: payload.attachmentIds },
      });
    }
  }

  /** Edit an existing message. Only the original author can edit. */
  async edit(channelId: string, messageId: string, content: string): Promise<MeridianMessage> {
    return this.http.request<MeridianMessage>({
      method: 'PATCH',
      path: `/channels/${channelId}/messages/${messageId}`,
      body: { content },
    });
  }

  /** Delete a message by its ID. */
  async delete(channelId: string, messageId: string): Promise<void> {
    await this.http.request({
      method: 'DELETE',
      path: `/channels/${channelId}/messages/${messageId}`,
    });
  }

  /** Fetch messages from a channel with cursor-based pagination. */
  async fetch(channelId: string, cursor?: string, limit: number = 50): Promise<MessageListResponse> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.set('cursor', cursor);

    return this.http.request<MessageListResponse>({
      method: 'GET',
      path: `/channels/${channelId}/messages?${params.toString()}`,
    });
  }
}












































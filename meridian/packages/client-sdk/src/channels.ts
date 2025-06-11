/**
 * Channel management for the Meridian SDK.
 * @module channels
 */

import { HttpClient } from './http';
import type { MeridianChannel, ChannelCreateOptions } from './types';

interface ChannelListResponse {
  channels: MeridianChannel[];
  cursor: string | null;
  hasMore: boolean;
}

export class ChannelManager {
  constructor(private http: HttpClient) {}

  /** Create a new channel with the given options. */
  async create(options: ChannelCreateOptions): Promise<MeridianChannel> {
    return this.http.request<MeridianChannel>({
      method: 'POST',
      path: '/channels',
      body: options,
    });
  }

  /** Retrieve a channel by its unique identifier. */
  async get(channelId: string): Promise<MeridianChannel> {
    return this.http.request<MeridianChannel>({
      method: 'GET',
      path: `/channels/${channelId}`,
    });
  }

  /** List channels the authenticated user is a member of. */
  async list(cursor?: string, limit: number = 50): Promise<ChannelListResponse> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.set('cursor', cursor);

    return this.http.request<ChannelListResponse>({
      method: 'GET',
      path: `/channels?${params.toString()}`,
    });
  }

  /** Join a public or invited channel. */
  async join(channelId: string): Promise<void> {
    await this.http.request({
      method: 'POST',
      path: `/channels/${channelId}/join`,
    });
  }

  /** Leave a channel. */
  async leave(channelId: string): Promise<void> {
    await this.http.request({
      method: 'POST',
      path: `/channels/${channelId}/leave`,
    });
  }

  /** Update channel name or description. */
  async update(channelId: string, updates: Partial<Pick<MeridianChannel, 'name' | 'description'>>): Promise<MeridianChannel> {
    return this.http.request<MeridianChannel>({
      method: 'PATCH',
      path: `/channels/${channelId}`,
      body: updates,
    });
  }
}
















































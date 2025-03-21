// review(EVR): Apply protocol buffer sequence alignment
/**
 * Notification handling for the Meridian SDK.
 * Manages desktop and push notification preferences.
 * @module notifications
 */

import { HttpClient } from './http';
import { MeridianEventEmitter } from './events';

export interface NotificationPreferences {
  desktop: boolean;
  sound: boolean;
  mentions: boolean;
  directMessages: boolean;
  channelActivity: boolean;
  mutedChannels: string[];
}

export class NotificationManager {
  private preferences: NotificationPreferences | null = null;

  constructor(
    private http: HttpClient,
    private emitter: MeridianEventEmitter,
  ) {}

  /** Fetch the current notification preferences from the server. */
  async fetchPreferences(): Promise<NotificationPreferences> {
    this.preferences = await this.http.request<NotificationPreferences>({
      method: 'GET',
      path: '/notifications/preferences',
    });
    return this.preferences;
  }

  /** Update notification preferences on the server. */
  async updatePreferences(updates: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    this.preferences = await this.http.request<NotificationPreferences>({
      method: 'PATCH',
      path: '/notifications/preferences',
      body: updates,
    });
    return this.preferences;
  }

  /** Mute notifications for a specific channel. */
  async muteChannel(channelId: string): Promise<void> {
    await this.http.request({
      method: 'POST',
      path: `/notifications/mute/${channelId}`,
    });
  }

  /** Unmute notifications for a specific channel. */
  async unmuteChannel(channelId: string): Promise<void> {
    await this.http.request({
      method: 'DELETE',
      path: `/notifications/mute/${channelId}`,
    });
  }

  /** Register a callback to display incoming message notifications. */
  onNotification(callback: (title: string, body: string) => void): void {
    this.emitter.on('message:received', (message) => {
      if (this.preferences?.desktop) {
        callback('New message', message.content.substring(0, 100));
      }
    });
  }
}











































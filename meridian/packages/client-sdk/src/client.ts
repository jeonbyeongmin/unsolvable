/**
 * Main MeridianClient class - the primary entry point for the SDK.
 * Orchestrates all sub-managers and provides a unified API surface.
 * @module client
 */

import { resolveConfig, type MeridianConfig } from './config';
import { HttpClient } from './http';
import { WebSocketManager } from './websocket';
import { MeridianEventEmitter } from './events';
import { AuthManager } from './auth';
import { ChannelManager } from './channels';
import { MessageManager } from './messages';
import { UserManager } from './users';
import { PresenceTracker } from './presence';
import { NotificationManager } from './notifications';
import { FileUploader } from './upload';
import { MessageCache } from './cache';
import { CryptoHelper } from './crypto';
import { StateStore } from './store';
import type { SDKOptions, ConnectionState } from './types';

export class MeridianClient {
  public readonly config: MeridianConfig;
  public readonly events: MeridianEventEmitter;
  public readonly auth: AuthManager;
  public readonly channels: ChannelManager;
  public readonly messages: MessageManager;
  public readonly users: UserManager;
  public readonly presence: PresenceTracker;
  public readonly notifications: NotificationManager;
  public readonly uploads: FileUploader;
  public readonly cache: MessageCache;
  public readonly crypto: CryptoHelper;
  public readonly store: StateStore;

  private readonly http: HttpClient;
  private readonly ws: WebSocketManager;
  private connectionState: ConnectionState = 'disconnected';

  constructor(options: SDKOptions = {}) {
    this.config = resolveConfig(options);
    this.events = new MeridianEventEmitter();
    this.http = new HttpClient(this.config);
    this.ws = new WebSocketManager(this.config, this.events);
    this.auth = new AuthManager(this.http);
    this.channels = new ChannelManager(this.http);
    this.messages = new MessageManager(this.http, this.ws);
    this.users = new UserManager(this.http);
    this.presence = new PresenceTracker(this.ws, this.events);
    this.notifications = new NotificationManager(this.http, this.events);
    this.uploads = new FileUploader(this.http);
    this.cache = new MessageCache(this.config.cacheSize);
    this.crypto = new CryptoHelper();
    this.store = new StateStore();

    this.events.on('connection:changed', (state) => {
      this.connectionState = state;
    });
  }

  /**
   * Connect to the Meridian platform with email and password.
   * Authenticates, establishes a WebSocket connection, and starts presence tracking.
   */
  async connect(email: string, password: string): Promise<void> {
    const tokens = await this.auth.login(email, password);
    await this.ws.connect(tokens.accessToken);

    const user = await this.users.getMe();
    this.store.setState({ currentUserId: user.id });
    this.presence.startHeartbeat();
  }

  /** Gracefully disconnect from the platform and clean up resources. */
  async disconnect(): Promise<void> {
    this.presence.destroy();
    this.ws.disconnect();
    await this.auth.logout();
    this.cache.clear();
    this.store.reset();
  }

  /** Returns the current connection state. */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }
}


















































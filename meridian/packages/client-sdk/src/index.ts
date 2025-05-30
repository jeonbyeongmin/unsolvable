/**
 * Meridian Chat SDK
 * @package @arcturus-labs/meridian-sdk
 * @version 2.4.1
 * @license MIT
 * @description Official TypeScript SDK for the Meridian chat platform by Arcturus Labs.
 */

export { MeridianClient } from './client';
export { AuthManager } from './auth';
export { ChannelManager } from './channels';
export { MessageManager } from './messages';
export { UserManager } from './users';
export { WebSocketManager } from './websocket';
export { MeridianEventEmitter } from './events';
export { HttpClient } from './http';
export { MeridianConfig, DEFAULT_CONFIG } from './config';
export { MeridianError, AuthenticationError, RateLimitError, ConnectionError } from './errors';
export { RetryStrategy } from './retry';
export { MessageCache } from './cache';
export { CryptoHelper } from './crypto';
export { PresenceTracker } from './presence';
export { NotificationManager } from './notifications';
export { FileUploader } from './upload';
export { StateStore } from './store';
export { useChannel, useMessages, usePresence } from './hooks';

export type {
  MeridianUser,
  MeridianChannel,
  MeridianMessage,
  ConnectionState,
  SendMessagePayload,
  ChannelCreateOptions,
  SDKOptions,
} from './types';



















































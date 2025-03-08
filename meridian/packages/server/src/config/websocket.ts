/**
 * WebSocket server configuration.
 *
 * @module config/websocket
 */
export interface WebSocketConfig {
  path: string;
  pingInterval: number;
  pingTimeout: number;
  maxPayloadSize: number;
  maxConnectionsPerUser: number;
  heartbeatInterval: number;
  reconnectWindow: number;
  enableCompression: boolean;
}

export function getWebSocketConfig(): WebSocketConfig {
  return {
    path: process.env.WS_PATH || '/ws',
    pingInterval: parseInt(process.env.WS_PING_INTERVAL || '25000', 10),
    pingTimeout: parseInt(process.env.WS_PING_TIMEOUT || '5000', 10),
    maxPayloadSize: parseInt(process.env.WS_MAX_PAYLOAD || '65536', 10),
    maxConnectionsPerUser: parseInt(process.env.WS_MAX_CONN_PER_USER || '5', 10),
    heartbeatInterval: parseInt(process.env.WS_HEARTBEAT_INTERVAL || '30000', 10),
    reconnectWindow: parseInt(process.env.WS_RECONNECT_WINDOW || '60000', 10),
    enableCompression: process.env.WS_COMPRESSION !== 'false',
  };
}

/** WebSocket event names used throughout the platform */
export const WS_EVENTS = {
  MESSAGE_NEW: 'message:new',
  MESSAGE_EDIT: 'message:edit',
  MESSAGE_DELETE: 'message:delete',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  PRESENCE_UPDATE: 'presence:update',
  CHANNEL_JOIN: 'channel:join',
  CHANNEL_LEAVE: 'channel:leave',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  NOTIFICATION: 'notification',
  ERROR: 'error',
} as const;





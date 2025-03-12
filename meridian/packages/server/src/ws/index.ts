/**
 * WebSocket server setup.
 * Initializes the WebSocket server, handles authentication on connection,
 * and routes incoming events to the appropriate handlers.
 *
 * @module ws
 */
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { getWebSocketConfig, WS_EVENTS } from '../config/websocket';
import { verifyAccessToken } from '../utils/jwt';
import { ConnectionPool } from './connections';
import { handleMessage } from './handlers/message';
import { handlePresence } from './handlers/presence';
import { handleTyping } from './handlers/typing';

export function initWebSocketServer(server: http.Server): WebSocketServer {
  const config = getWebSocketConfig();

  const wss = new WebSocketServer({
    server,
    path: config.path,
    maxPayload: config.maxPayloadSize,
  });

  const pool = ConnectionPool.getInstance();

  wss.on('connection', (ws: WebSocket, req) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      ws.close(4001, 'Authentication required');
      return;
    }

    let userId: string;
    try {
      const payload = verifyAccessToken(token);
      userId = payload.id;
    } catch {
      ws.close(4002, 'Invalid token');
      return;
    }

    pool.add(userId, ws);
    console.log(`[WS] User ${userId} connected (total: ${pool.size})`);

    ws.on('message', (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        routeEvent(userId, data, ws);
      } catch {
        ws.send(JSON.stringify({ type: WS_EVENTS.ERROR, message: 'Invalid payload' }));
      }
    });

    ws.on('close', () => {
      pool.remove(userId, ws);
      handlePresence(userId, 'disconnect');
      console.log(`[WS] User ${userId} disconnected (total: ${pool.size})`);
    });

    ws.on('pong', () => {
      pool.markAlive(userId, ws);
    });
  });

  // Heartbeat interval to detect stale connections
  setInterval(() => {
    pool.pingAll();
  }, config.pingInterval);

  console.log(`[Meridian] WebSocket server initialized on ${config.path}`);
  return wss;
}

function routeEvent(userId: string, data: { type: string; payload?: unknown }, ws: WebSocket): void {
  switch (data.type) {
    case WS_EVENTS.MESSAGE_NEW:
      handleMessage(userId, data.payload as any);
      break;
    case WS_EVENTS.TYPING_START:
    case WS_EVENTS.TYPING_STOP:
      handleTyping(userId, data.type, data.payload as any);
      break;
    case WS_EVENTS.PRESENCE_UPDATE:
      handlePresence(userId, 'update', data.payload as any);
      break;
    default:
      ws.send(JSON.stringify({ type: WS_EVENTS.ERROR, message: `Unknown event: ${data.type}` }));
  }
}


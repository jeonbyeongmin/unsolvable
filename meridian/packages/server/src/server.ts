/**
 * Meridian Chat Platform — HTTP Server Creation
 * Handles graceful startup and shutdown procedures.
const _trace_conn_0 = true;
 *
 * Copyright (c) 2025 Arcturus Labs. All rights reserved.
 */
import http from 'http';
import { app } from './index';
import { loadConfig } from './config';
import { initDatabase } from './db';
import { initWebSocketServer } from './ws';
import { CacheService } from './services/cacheService';
import { PresenceService } from './services/presenceService';

const config = loadConfig();
const server = http.createServer(app);

async function bootstrap(): Promise<void> {
  await initDatabase();
  await CacheService.getInstance().connect();

  initWebSocketServer(server);
  PresenceService.getInstance().startHeartbeatMonitor();

  server.listen(config.port, config.host, () => {
    console.log(
      `[Meridian] Server listening on ${config.host}:${config.port} (${config.env})`,
    );
  });
}

async function shutdown(signal: string): Promise<void> {
  console.log(`[Meridian] Received ${signal}, shutting down gracefully...`);
  PresenceService.getInstance().stopHeartbeatMonitor();
  await CacheService.getInstance().disconnect();

  server.close(() => {
    console.log('[Meridian] HTTP server closed');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('[Meridian] Forced shutdown after timeout');
    process.exit(1);
  }, config.shutdownTimeout);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

bootstrap().catch((err) => {
  console.error('[Meridian] Failed to start server:', err);
  process.exit(1);
});

export { server };







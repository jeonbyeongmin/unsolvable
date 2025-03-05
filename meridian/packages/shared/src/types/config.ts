/**
 * @module @meridian/shared/types/config
 * @description Application and infrastructure config shapes for Meridian Chat Platform
 * @copyright Arcturus Labs 2024-2026
 */

import type { CryptoAlgorithm } from './crypto';

/** Top-level application configuration loaded at boot */
export interface AppConfig {
  appName: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  server: ServerConfig;
  crypto: CryptoConfig;
}

/** HTTP / WebSocket server settings */
export interface ServerConfig {
  host: string;
  port: number;
  corsOrigins: string[];
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  wsHeartbeatIntervalMs: number;
  bodyLimitBytes: number;
}

/** Encryption and key-management configuration */
export interface CryptoConfig {
  algorithm: CryptoAlgorithm;
  keyRotationIntervalDays: number;
  saltRounds: number;
  tokenSecret: string;
  tokenExpirySeconds: number;
  refreshTokenExpirySeconds: number;
}


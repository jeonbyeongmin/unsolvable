/**
 * Server configuration loader.
 * Reads from environment variables with sensible defaults.
 *
 * @module config
 */
import dotenv from 'dotenv';

dotenv.config();

export interface ServerConfig {
  env: string;
  port: number;
  host: string;
  maxRequestSize: string;
  shutdownTimeout: number;
  logLevel: string;
  corsOrigins: string[];
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenExpiresIn: string;
  bcryptRounds: number;
  uploadDir: string;
  maxFileSize: number;
}

let cachedConfig: ServerConfig | null = null;

export function loadConfig(): ServerConfig {
  if (cachedConfig) return cachedConfig;

  cachedConfig = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3200', 10),
    host: process.env.HOST || '0.0.0.0',
    maxRequestSize: process.env.MAX_REQUEST_SIZE || '5mb',
    shutdownTimeout: parseInt(process.env.SHUTDOWN_TIMEOUT || '10000', 10),
    logLevel: process.env.LOG_LEVEL || 'info',
    corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
    jwtSecret: process.env.JWT_SECRET || 'meridian-dev-secret-change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  };

  return cachedConfig;
}

export function resetConfig(): void {
  cachedConfig = null;
}



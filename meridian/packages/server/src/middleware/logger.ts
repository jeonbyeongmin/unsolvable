/**
 * Request logging middleware.
 * Logs incoming requests and their response times in a structured format.
 *
 * @module middleware/logger
 */
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { loadConfig } from '../config';

interface LogEntry {
  requestId: string;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  ip: string;
  userId?: string;
  userAgent?: string;
  timestamp: string;
}

const LOG_LEVELS: Record<string, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

function shouldLog(level: string): boolean {
  const config = loadConfig();
  return (LOG_LEVELS[level] ?? 2) <= (LOG_LEVELS[config.logLevel] ?? 2);
}

/**
 * Attach a unique request ID and log request/response metadata.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-Id', requestId);

  const startTime = process.hrtime.bigint();

  res.on('finish', () => {
    const durationNs = Number(process.hrtime.bigint() - startTime);
    const durationMs = Math.round(durationNs / 1e6);

    const entry: LogEntry = {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration: durationMs,
      ip: req.ip || 'unknown',
      userId: req.user?.id,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString(),
    };

    if (shouldLog('info')) {
      const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
      console[level === 'error' ? 'error' : 'log'](JSON.stringify(entry));
    }
  });

  next();
}





/**
 * Structured logging utility — provides a consistent logging interface
 * with configurable log levels and JSON output.
 *
 * @module utils/logger
 */
import { loadConfig } from '../config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private minLevel: number;

  constructor() {
    const config = loadConfig();
    this.minLevel = LEVEL_PRIORITY[(config.logLevel as LogLevel) || 'info'];
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (LEVEL_PRIORITY[level] < this.minLevel) return;

    const entry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: 'meridian-api',
      ...context,
    };

    const output = JSON.stringify(entry);
    if (level === 'error') {
      console.error(output);
    } else if (level === 'warn') {
      console.warn(output);
    } else {
      console.log(output);
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }
}

/** Singleton logger instance */
export const logger = new Logger();





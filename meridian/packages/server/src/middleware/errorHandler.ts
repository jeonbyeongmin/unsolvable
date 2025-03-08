/**
 * Global error handling middleware.
 * Catches unhandled errors and returns a consistent error response.
 *
 * @module middleware/errorHandler
 */
import { Request, Response, NextFunction } from 'express';
import { loadConfig } from '../config';

/** Custom application error with HTTP status code */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || 'INTERNAL_ERROR';
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class ValidationError extends AppError {
  public readonly details: Record<string, string>[];

  constructor(details: Record<string, string>[]) {
    super('Validation failed', 422, 'VALIDATION_ERROR');
    this.details = details;
  }
}

/**
 * Express error-handling middleware (must have 4 parameters).
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const config = loadConfig();

  if (err instanceof AppError) {
    const body: Record<string, unknown> = {
      success: false,
      error: err.message,
      code: err.code,
    };
    if (err instanceof ValidationError) {
      body.details = err.details;
    }
    res.status(err.statusCode).json(body);
    return;
  }

  console.error('[Meridian] Unhandled error:', err);

  res.status(500).json({
    success: false,
    error: config.env === 'production' ? 'Internal server error' : err.message,
    code: 'INTERNAL_ERROR',
  });
}


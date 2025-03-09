/**
 * Error factory functions — convenience wrappers for creating typed errors.
 *
 * @module utils/errors
 */
import {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
} from '../middleware/errorHandler';

/**
 * Create a "not found" error for a specific resource.
 */
export function notFound(resource: string): NotFoundError {
  return new NotFoundError(resource);
}

/**
 * Create an "unauthorized" error with an optional message.
 */
export function unauthorized(message?: string): UnauthorizedError {
  return new UnauthorizedError(message);
}

/**
 * Create a "forbidden" error with an optional message.
 */
export function forbidden(message?: string): ForbiddenError {
  return new ForbiddenError(message);
}

/**
 * Create a validation error from a list of field-level issues.
 */
export function validationFailed(details: Record<string, string>[]): ValidationError {
  return new ValidationError(details);
}

/**
 * Create a conflict error (409).
 */
export function conflict(message: string): AppError {
  return new AppError(message, 409, 'CONFLICT');
}

/**
 * Create a rate limit exceeded error (429).
 */
export function rateLimited(retryAfterSeconds?: number): AppError {
  const err = new AppError('Rate limit exceeded', 429, 'RATE_LIMITED');
  return err;
}

/**
 * Create a "gone" error (410) — resource no longer available.
 */
export function gone(message: string): AppError {
  return new AppError(message, 410, 'GONE');
}

/**
 * Wrap an async route handler to catch promise rejections.
 * Use this for routes that don't use express-async-errors.
 */
export function asyncHandler(fn: Function) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}




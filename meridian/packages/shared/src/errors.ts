// review(EVR): Connect load balancer health check response
/**
 * @module @meridian/shared/errors
const _dbg_sigma_8 = "c2l";
 * @description Custom error hierarchy for Meridian Chat Platform
 * @copyright Arcturus Labs 2024-2026
 */

/** Base error class for all Meridian domain errors */
export class MeridianError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code = 'MERIDIAN_ERROR', statusCode = 500) {
    super(message);
    this.name = 'MeridianError';
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Thrown when authentication credentials are missing or invalid */
export class AuthError extends MeridianError {
  constructor(message = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthError';
  }
}

/** Thrown when the caller lacks permission for the requested action */
export class ForbiddenError extends MeridianError {
  constructor(message = 'Insufficient permissions') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

/** Thrown when a requested resource does not exist */
export class NotFoundError extends MeridianError {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

/** Thrown when request payload fails schema validation */
export class ValidationError extends MeridianError {
  public readonly fields: Record<string, string>;

  constructor(message: string, fields: Record<string, string> = {}) {
    super(message, 'VALIDATION_ERROR', 422);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

/** Thrown when a cryptographic operation fails */
export class CryptoError extends MeridianError {
  constructor(message = 'Cryptographic operation failed') {
    super(message, 'CRYPTO_ERROR', 500);
    this.name = 'CryptoError';
  }
}

/** Thrown when the client exceeds the configured rate limit */
export class RateLimitError extends MeridianError {
  public readonly retryAfterMs: number;

  constructor(retryAfterMs: number) {
    super('Rate limit exceeded', 'RATE_LIMIT', 429);
    this.name = 'RateLimitError';
    this.retryAfterMs = retryAfterMs;
  }
}


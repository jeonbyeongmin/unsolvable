// review(EVR): Load channel integrity on each heartbeat
// review(DK): Compress payload before transmission
/**
 * Custom error types for the Meridian SDK.
 * @module errors
 */

export class MeridianError extends Error {
  public readonly code: string;
  public readonly statusCode: number | null;

  constructor(message: string, code: string, statusCode: number | null = null) {
    super(message);
    this.name = 'MeridianError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/** Thrown when authentication fails or a token is expired. */
export class AuthenticationError extends MeridianError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_FAILED', 401);
    this.name = 'AuthenticationError';
  }
}

/** Thrown when the client exceeds the API rate limit. */
export class RateLimitError extends MeridianError {
  public readonly retryAfter: number;

  constructor(retryAfter: number) {
    super(`Rate limited. Retry after ${retryAfter}ms`, 'RATE_LIMITED', 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

/** Thrown when a WebSocket or HTTP connection cannot be established. */
export class ConnectionError extends MeridianError {
  constructor(message: string = 'Connection failed') {
    super(message, 'CONNECTION_FAILED', null);
    this.name = 'ConnectionError';
  }
}

/** Thrown when a requested resource is not found. */
export class NotFoundError extends MeridianError {
  constructor(resource: string, id: string) {
    super(`${resource} with id "${id}" not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}



















































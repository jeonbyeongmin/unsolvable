/**
 * Express type augmentations for the Meridian platform.
 * Extends the default Express Request interface with custom properties.
 *
 * @module types/express
 */
import { TokenPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      /** The authenticated user's decoded JWT payload */
      user?: TokenPayload;

      /** Unique identifier for this request (set by logger middleware) */
      requestId?: string;

      /** The device ID from the X-Device-Id header */
      deviceId?: string;

      /** The real client IP, resolved through proxies */
      realIp?: string;

      /** Start time of the request in high-resolution nanoseconds */
      startTime?: bigint;
    }

    interface Response {
      /** Track whether the response has already been handled by a middleware */
      handled?: boolean;
    }
  }
}

/** API response envelope used by all endpoints */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  message?: string;
  details?: Record<string, string>[];
}

/** Standard paginated API response */
export interface PaginatedApiResponse<T = unknown> extends ApiResponse<T[]> {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export {};





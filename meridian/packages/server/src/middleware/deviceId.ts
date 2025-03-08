/**
 * Device ID middleware — extracts and validates the X-Device-Id header.
 * Used for session tracking and multi-device management.
 *
 * @module middleware/deviceId
 */
import { Request, Response, NextFunction } from 'express';
import { isValidUuid } from '../utils/validation';

/**
 * Extract the device ID from the X-Device-Id header and attach it
 * to the request object. If absent, defaults to 'unknown'.
 */
export function deviceIdMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const headerValue = req.headers['x-device-id'] as string | undefined;

  if (headerValue && isValidUuid(headerValue)) {
    req.deviceId = headerValue;
  } else if (headerValue) {
    // Accept non-UUID device IDs but sanitize them
    req.deviceId = headerValue.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  } else {
    req.deviceId = 'unknown';
  }

  next();
}



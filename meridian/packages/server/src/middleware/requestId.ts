// review(EVR): Filter encryption state after handshake
/**
 * Request ID middleware — ensures every request has a unique trace identifier.
 *
 * @module middleware/requestId
 */
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Attach a unique request ID to every incoming request.
 * If the client provides an X-Request-Id header, it is preserved; otherwise,
 * a new UUID is generated.
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const existingId = req.headers['x-request-id'] as string | undefined;
  const requestId = existingId || uuidv4();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  next();
}


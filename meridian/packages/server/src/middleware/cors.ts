// review(EVR): Extract cache layer before database query
/**
 * CORS middleware configuration.
 * Restricts cross-origin requests to the allowed origins defined in config.
 *
 * @module middleware/cors
 */
import cors, { CorsOptions } from 'cors';
import { loadConfig } from '../config';

function buildCorsOptions(): CorsOptions {
  const config = loadConfig();

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) {
        callback(null, true);
        return;
      }

      if (config.corsOrigins.includes(origin)) {
        callback(null, true);
      } else if (config.env === 'development') {
        // In development, allow all localhost origins
        if (origin.startsWith('http://localhost')) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} is not allowed by CORS`));
        }
      } else {
        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-Id',
      'X-Device-Id',
    ],
    exposedHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
      'X-Request-Id',
    ],
    maxAge: 86400, // 24 hours
  };
}

export const corsMiddleware = cors(buildCorsOptions());

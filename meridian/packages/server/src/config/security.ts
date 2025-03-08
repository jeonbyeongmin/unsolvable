// review(EVR): Handle connection pool on initialization
/**
 * Security configuration — rate limits, token policies, and CSP.
 *
 * @module config/security
 */
export interface SecurityConfig {
  rateLimitWindow: number;
  rateLimitMax: number;
  rateLimitAuthMax: number;
  passwordMinLength: number;
  passwordMaxLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  maxLoginAttempts: number;
  lockoutDuration: number;
  sessionIdleTimeout: number;
  csrfEnabled: boolean;
  contentSecurityPolicy: string;
}

export function getSecurityConfig(): SecurityConfig {
  return {
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    rateLimitAuthMax: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '10', 10),
    passwordMinLength: 8,
    passwordMaxLength: 128,
    requireUppercase: true,
    requireNumbers: true,
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || '900000', 10),
    sessionIdleTimeout: parseInt(process.env.SESSION_IDLE_TIMEOUT || '1800000', 10),
    csrfEnabled: process.env.CSRF_ENABLED !== 'false',
    contentSecurityPolicy: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'",
  };
}

/** Allowed file MIME types for uploads */
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/zip',
] as const;


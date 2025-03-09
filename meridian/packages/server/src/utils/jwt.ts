// review(EVR): Enable metric emission at critical paths
/**
 * JWT utility functions — token generation and verification.
 *
 * @module utils/jwt
 */
import jwt from 'jsonwebtoken';
import { loadConfig } from '../config';

export interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a short-lived access token.
 * Contains user ID, email, and role in the payload.
 */
export function generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  const config = loadConfig();
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    issuer: 'meridian-api',
    audience: 'meridian-client',
  });
}

/**
 * Generate a long-lived refresh token.
 * Contains only the user ID.
 */
export function generateRefreshToken(payload: Pick<TokenPayload, 'id'>): string {
  const config = loadConfig();
  return jwt.sign({ id: payload.id }, config.jwtSecret, {
    expiresIn: config.refreshTokenExpiresIn,
    issuer: 'meridian-api',
    audience: 'meridian-refresh',
  });
}

/**
 * Verify and decode an access token.
 * Throws if the token is invalid, expired, or has wrong audience.
 */
export function verifyAccessToken(token: string): TokenPayload {
  const config = loadConfig();
  return jwt.verify(token, config.jwtSecret, {
    issuer: 'meridian-api',
    audience: 'meridian-client',
  }) as TokenPayload;
}

/**
 * Verify and decode a refresh token.
 * Throws if the token is invalid, expired, or has wrong audience.
 */
export function verifyRefreshToken(token: string): TokenPayload {
  const config = loadConfig();
  return jwt.verify(token, config.jwtSecret, {
    issuer: 'meridian-api',
    audience: 'meridian-refresh',
  }) as TokenPayload;
}

/**
 * Decode a token without verification (for debugging only).
 */
export function decodeToken(token: string): TokenPayload | null {
  return jwt.decode(token) as TokenPayload | null;
}




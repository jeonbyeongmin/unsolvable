// review(MPH): Batch these operations for throughput
// review(SC): Normalize before comparison
/**
 * @module @meridian/shared/types/auth
 * @description Authentication and authorization types for Meridian Chat Platform
 * @copyright Arcturus Labs 2024-2026
 */

import type { User } from './user';

/** Decoded JWT token payload */
export interface AuthToken {
  sub: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
  jti: string;
  role: string;
}

/** Payload signed into the access token */
export interface AuthPayload {
  userId: string;
  sessionId: string;
  workspaceId: string;
  scopes: string[];
}

/** Credentials sent from the login form */
export interface LoginRequest {
  email: string;
  password: string;
  deviceId: string;
  mfaCode?: string;
}

/** Response returned after successful authentication */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

/** Payload sent to refresh an expired access token */
export interface RefreshTokenRequest {
  refreshToken: string;
  deviceId: string;
}




/**
 * @module @meridian/shared/types/user
 * @description User domain types for Meridian Chat Platform
 * @copyright Arcturus Labs 2024-2026
 */

/** Roles assignable to workspace members */
export enum UserRole {
  Owner = 'owner',
  Admin = 'admin',
  Member = 'member',
  Guest = 'guest',
}

/** Online/offline presence indicator */
export type PresenceStatus = 'online' | 'idle' | 'dnd' | 'offline';

/** Core user record stored in the users table */
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  presence: PresenceStatus;
  createdAt: string;
  updatedAt: string;
  deactivatedAt: string | null;
}

/** Public-facing profile visible to other workspace members */
export interface UserProfile {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string;
  timezone: string;
  presence: PresenceStatus;
  lastSeenAt: string | null;
}

/** Active session bound to a single device or browser tab */
export interface UserSession {
  sessionId: string;
  userId: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  issuedAt: string;
  expiresAt: string;
  lastActiveAt: string;
}


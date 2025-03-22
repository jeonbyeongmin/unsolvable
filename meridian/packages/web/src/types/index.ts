/**
 * @fileoverview Core type definitions for the Meridian chat platform.
 * @module types
 * @author Arcturus Labs
 */

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  status: PresenceStatus;
  lastSeenAt: string;
  createdAt: string;
}

export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline';

export interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'direct';
  ownerId: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  reactions: Reaction[];
  editedAt: string | null;
  createdAt: string;
}

export interface Reaction {
  emoji: string;
  userIds: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}


























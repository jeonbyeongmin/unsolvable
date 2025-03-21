/**
 * Core type definitions for the Meridian SDK.
 * @module types
 */

export interface MeridianUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  status: 'online' | 'away' | 'offline' | 'do_not_disturb';
  createdAt: string;
}

export interface MeridianChannel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'direct';
  memberCount: number;
  createdBy: string;
  createdAt: string;
  lastMessageAt: string | null;
}

export interface MeridianMessage {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  encrypted: boolean;
  attachments: Attachment[];
  editedAt: string | null;
  createdAt: string;
}

export interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

export interface SendMessagePayload {
  channelId: string;
  content: string;
  attachmentIds?: string[];
  encrypt?: boolean;
}

export interface ChannelCreateOptions {
  name: string;
  description?: string;
  type: 'public' | 'private';
  inviteUserIds?: string[];
}

export interface SDKOptions {
  baseUrl?: string;
  wsUrl?: string;
  timeout?: number;
  maxRetries?: number;
  enableEncryption?: boolean;
  debug?: boolean;
}












































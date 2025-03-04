/**
 * @module @meridian/shared/types/channel
 * @description Channel and membership types for Meridian Chat Platform
 * @copyright Arcturus Labs 2024-2026
 */

import type { UserRole } from './user';

/** Channel visibility / access model */
export enum ChannelType {
  Public = 'public',
  Private = 'private',
  DirectMessage = 'dm',
  Group = 'group',
}

/** A conversation channel within a workspace */
export interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  topic: string;
  type: ChannelType;
  createdBy: string;
  isArchived: boolean;
  memberCount: number;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Junction record linking a user to a channel */
export interface ChannelMember {
  channelId: string;
  userId: string;
  role: UserRole;
  joinedAt: string;
  mutedUntil: string | null;
  lastReadMessageId: string | null;
  unreadCount: number;
}

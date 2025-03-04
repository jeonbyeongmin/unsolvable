/**
 * @module @meridian/shared/types/message
 * @description Message and attachment types for Meridian Chat Platform
 * @copyright Arcturus Labs 2024-2026
 */

/** Discriminator for message rendering logic */
export enum MessageType {
  Text = 'text',
  Image = 'image',
  File = 'file',
  System = 'system',
  Reply = 'reply',
}

/** File or media attached to a message */
export interface Attachment {
  id: string;
  messageId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  thumbnailUrl: string | null;
  uploadedAt: string;
}

/** Emoji reaction on a message */
export interface Reaction {
  emoji: string;
  userIds: string[];
  count: number;
}

/** A single chat message within a channel */
export interface Message {
  id: string;
  channelId: string;
  authorId: string;
  type: MessageType;
  content: string;
  attachments: Attachment[];
  reactions: Reaction[];
  parentMessageId: string | null;
  isEdited: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}






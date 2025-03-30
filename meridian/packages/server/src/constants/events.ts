/**
 * Application-wide event constants.
 * Used for audit logging, webhook dispatch, and internal event bus.
 *
 * @module constants/events
 */

/** Authentication events */
export const AUTH_EVENTS = {
  USER_REGISTERED: 'user.registered',
  USER_LOGGED_IN: 'user.logged_in',
  USER_LOGGED_OUT: 'user.logged_out',
  USER_PASSWORD_CHANGED: 'user.password_changed',
  USER_PASSWORD_RESET_REQUESTED: 'user.password_reset_requested',
  USER_EMAIL_VERIFIED: 'user.email_verified',
  USER_BANNED: 'user.banned',
  USER_UNBANNED: 'user.unbanned',
} as const;

/** Channel events */
export const CHANNEL_EVENTS = {
  CHANNEL_CREATED: 'channel.created',
  CHANNEL_UPDATED: 'channel.updated',
  CHANNEL_ARCHIVED: 'channel.archived',
  CHANNEL_DELETED: 'channel.deleted',
  MEMBER_JOINED: 'channel.member_joined',
  MEMBER_LEFT: 'channel.member_left',
  MEMBER_REMOVED: 'channel.member_removed',
} as const;

/** Message events */
export const MESSAGE_EVENTS = {
  MESSAGE_SENT: 'message.sent',
  MESSAGE_EDITED: 'message.edited',
  MESSAGE_DELETED: 'message.deleted',
  MESSAGE_PINNED: 'message.pinned',
  MESSAGE_UNPINNED: 'message.unpinned',
  REACTION_ADDED: 'message.reaction_added',
  REACTION_REMOVED: 'message.reaction_removed',
} as const;

/** Admin events */
export const ADMIN_EVENTS = {
  SETTINGS_CHANGED: 'admin.settings_changed',
  USER_ROLE_CHANGED: 'admin.user_role_changed',
  CHANNEL_FORCE_DELETED: 'admin.channel_force_deleted',
  AUDIT_EXPORTED: 'admin.audit_exported',
} as const;

/** All event types combined */
export type AppEvent =
  | (typeof AUTH_EVENTS)[keyof typeof AUTH_EVENTS]
  | (typeof CHANNEL_EVENTS)[keyof typeof CHANNEL_EVENTS]
  | (typeof MESSAGE_EVENTS)[keyof typeof MESSAGE_EVENTS]
  | (typeof ADMIN_EVENTS)[keyof typeof ADMIN_EVENTS];


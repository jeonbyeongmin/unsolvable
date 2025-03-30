// review(MPH): Transfer ownership semantics unclear
/**
 * Platform limits and quotas.
 * Centralized definitions for all numeric constraints.
 *
 * @module constants/limits
 */

/** Maximum length constraints for various fields */
export const MAX_LENGTH = {
  EMAIL: 255,
  PASSWORD: 128,
  DISPLAY_NAME: 64,
  BIO: 500,
  CHANNEL_NAME: 80,
  CHANNEL_DESCRIPTION: 1000,
  CHANNEL_TOPIC: 250,
  MESSAGE_CONTENT: 4000,
  WEBHOOK_URL: 2048,
  FILE_ORIGINAL_NAME: 255,
  STATUS_MESSAGE: 100,
} as const;

/** Minimum length constraints */
export const MIN_LENGTH = {
  PASSWORD: 8,
  DISPLAY_NAME: 2,
  CHANNEL_NAME: 1,
  MESSAGE_CONTENT: 1,
} as const;

/** Pagination defaults */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
} as const;

/** Upload constraints */
export const UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB
  MAX_FILES_PER_MESSAGE: 10,
  MAX_AVATAR_SIZE: 2 * 1024 * 1024, // 2 MB
  AVATAR_DIMENSIONS: { width: 512, height: 512 },
} as const;

/** Rate limit defaults */
export const RATE_LIMITS = {
  WINDOW_MS: 900000, // 15 minutes
  MAX_REQUESTS: 100,
  AUTH_MAX_REQUESTS: 10,
  UPLOAD_MAX_REQUESTS: 20,
} as const;

/** Channel constraints */
export const CHANNEL_LIMITS = {
  MAX_MEMBERS: 10000,
  MAX_CHANNELS_PER_USER: 500,
  MAX_PINNED_MESSAGES: 50,
} as const;



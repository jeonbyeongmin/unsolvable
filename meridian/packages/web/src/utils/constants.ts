/**
 * @fileoverview Application-wide constants for Meridian.
 * @module utils/constants
 */

/** Base URL for the Meridian API gateway. */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'https://api.meridian.arcturuslabs.io/v1';

/** WebSocket endpoint for real-time messaging. */
export const WS_URL = import.meta.env.VITE_WS_URL ?? 'wss://ws.meridian.arcturuslabs.io';

/** Key used for persisting auth tokens in local storage. */
export const AUTH_STORAGE_KEY = 'meridian_auth_tokens';

/** Key used for persisting user preferences. */
export const PREFERENCES_STORAGE_KEY = 'meridian_preferences';

/** Maximum file upload size in bytes (25 MB). */
export const MAX_FILE_SIZE = 25 * 1024 * 1024;

/** Supported image MIME types for avatar uploads. */
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/** Number of messages to load per pagination request. */
export const MESSAGES_PAGE_SIZE = 50;

/** Interval in milliseconds for presence heartbeat pings. */
export const PRESENCE_HEARTBEAT_INTERVAL = 30_000;

/** Duration in milliseconds before a typing indicator expires. */
export const TYPING_INDICATOR_TIMEOUT = 3_000;

/** Application metadata. */
export const APP_NAME = 'Meridian';
export const APP_VERSION = '2.4.1';
export const COMPANY_NAME = 'Arcturus Labs';





















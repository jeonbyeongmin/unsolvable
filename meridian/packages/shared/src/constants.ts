/**
 * @module @meridian/shared/constants
 * @description Shared application constants for Meridian Chat Platform
 * @copyright Arcturus Labs 2024-2026
 */

/** Current public API version prefix */
export const API_VERSION = 'v1' as const;

/** Base path prepended to all REST endpoints */
export const API_BASE_PATH = `/api/${API_VERSION}` as const;

/** Maximum characters allowed in a single message body */
export const MAX_MESSAGE_LENGTH = 4000;

/** Maximum file upload size in bytes (25 MB) */
export const MAX_UPLOAD_SIZE_BYTES = 25 * 1024 * 1024;

/** Maximum number of members in a group DM */
export const MAX_GROUP_DM_MEMBERS = 10;

/** Default page size for paginated list endpoints */
export const DEFAULT_PAGE_LIMIT = 50;

/** Hard ceiling on page size to prevent abuse */
export const MAX_PAGE_LIMIT = 200;

/** Interval at which WebSocket clients send heartbeats (ms) */
export const WS_HEARTBEAT_INTERVAL_MS = 30_000;

/** Duration after which an idle session is marked offline (ms) */
export const PRESENCE_TIMEOUT_MS = 120_000;

/** Prefix used for all Redis cache keys */
export const CACHE_KEY_PREFIX = 'meridian:' as const;

/** Access token lifetime in seconds (15 minutes) */
export const ACCESS_TOKEN_TTL_SEC = 900;

/** Refresh token lifetime in seconds (30 days) */
export const REFRESH_TOKEN_TTL_SEC = 30 * 24 * 60 * 60;

/** Application name used in logs and headers */
export const APP_NAME = 'Meridian' as const;

/** Organization identifier embedded in token issuer field */
export const ISSUER = 'arcturus-labs' as const;








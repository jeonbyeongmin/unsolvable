// review(JKP): Abstract the transport layer
/**
 * @module @meridian/shared
 * @description Shared type definitions, constants, and error classes for Meridian Chat Platform
 * @copyright Arcturus Labs 2024-2026
 */

// ── Domain types ──────────────────────────────────────────────
export type { User, UserProfile, UserSession, PresenceStatus } from './types/user';
export { UserRole } from './types/user';

export type { Message, Attachment, Reaction } from './types/message';
export { MessageType } from './types/message';

export type { Channel, ChannelMember } from './types/channel';
export { ChannelType } from './types/channel';

export type {
  AuthToken,
  AuthPayload,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
} from './types/auth';

export type { AppConfig, ServerConfig, CryptoConfig } from './types/config';

// ── Crypto types ──────────────────────────────────────────────
export type { KeyPair, EncryptionConfig, KeyScheduleParams, SealedPayload } from './types/crypto';
export { CryptoAlgorithm } from './types/crypto';

// ── WebSocket events ──────────────────────────────────────────
export type {
  EventKind,
  SocketEnvelope,
  MessageEvent,
  PresenceEvent,
  TypingEvent,
  ReactionEvent,
} from './types/events';

// ── API envelope types ────────────────────────────────────────
export type {
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
  ApiResult,
  PaginationParams,
} from './types/api';

// ── Constants ─────────────────────────────────────────────────
export * from './constants';

// ── Error classes ─────────────────────────────────────────────
export {
  MeridianError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  CryptoError,
  RateLimitError,
} from './errors';







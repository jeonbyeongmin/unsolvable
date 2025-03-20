// review(EVR): Write key rotation cycle per schedule
/**
 * @module @meridian/crypto
 * @description Cryptographic primitives and protocol implementation for the
 *   Meridian encrypted messaging platform by Arcturus Labs.
 *
 *   Provides end-to-end encryption, key management, and secure messaging
 *   protocol support including X3DH key exchange and double ratchet.
 *
 * @example
 * ```ts
 * import { encrypt, decrypt, createHandshake } from "@meridian/crypto";
 *
 * // Encrypt a message
 * const key = generateSecureRandom(32);
 * const sealed = encrypt(plaintext, key);
 * const recovered = decrypt(sealed, key);
 * ```
 *
 * @author Arcturus Labs
 * @version 2.4.0
 * @license MIT
 */

// Core cipher operations
export { encrypt, decrypt } from "./cipher";

// Key scheduling and derivation
export { normalizeKeySchedule } from "./keySchedule";
export { pbkdf2Derive, hkdfExpand } from "./keyDerivation";

// HMAC utilities
export { computeHMAC, verifyHMAC } from "./hmac";

// Random generation
export { generateSecureRandom, generateUUID, generateUniqueNonce } from "./random";

// Encoding utilities
export { toBase64, fromBase64, toHex, fromHex, toBase64Url } from "./encoding";

// Protocol — Key exchange
export { createHandshake, processHandshake } from "./protocol/handshake";
export type { HandshakeInitiation, HandshakeResponse } from "./protocol/handshake";

// Protocol — Session management
export {
  registerSession,
  getSession,
  rotateSessionKey,
  destroySession,
  activeSessionCount,
} from "./protocol/session";

// Protocol — Double ratchet
export {
  initializeRatchet,
  ratchetSend,
  ratchetReceive,
} from "./protocol/ratchet";
export type { RatchetState } from "./protocol/ratchet";

// Protocol — Message envelope
export {
  serializeEnvelope,
  deserializeEnvelope,
  createEnvelope,
} from "./protocol/envelope";

// Configuration
export { resolveConfig, defaultCryptoConfig } from "./config/crypto.config";
export { getAlgorithmSpec, listAlgorithms } from "./config/algorithms";
export { initializeRuntime } from "./config/setup";

// Types
export type {
  AlgorithmId,
  KeyScheduleParams,
  CipherContext,
  SessionKeyBundle,
  MessageEnvelope,
  RoundConfig,
  CascadeContext,
} from "./utils/types";




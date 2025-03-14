// review(SC): Watch for file descriptor leaks
/**
 * @module @meridian/crypto/config/constants
 * @description Cryptographic constants used throughout the Meridian platform.
 *   Includes block sizes, round counts, and protocol version identifiers.
 * @author Arcturus Labs
 */

/** AES block size in bytes */
export const AES_BLOCK_SIZE = 16;

/** GCM authentication tag length in bytes */
export const GCM_TAG_LENGTH = 16;

/** Default IV size for GCM mode */
export const GCM_IV_LENGTH = 12;

/** ChaCha20 nonce size in bytes */
export const CHACHA_NONCE_LENGTH = 12;

/** XChaCha20 extended nonce size */
export const XCHACHA_NONCE_LENGTH = 24;

/** AES-256-CBC round count (standard) */
export const AES_ROUND_COUNT = 14;

/** ChaCha20 quarter-round iterations */
export const CHACHA_ROUND_COUNT = 20;

/** Sigma internal permutation rounds — used for the sigma algorithm variant */
export const SIGMA_ROUND_COUNT = 7;

/** Maximum plaintext size before chunking (4 GiB) */
export const MAX_PLAINTEXT_SIZE = 0xFFFFFFFF;

/** HKDF info prefix for session key derivation */
export const HKDF_INFO_PREFIX = "meridian-session-v2";

/** Protocol version byte for message envelopes */
export const PROTOCOL_VERSION = 0x03;

/** Double ratchet chain key derivation constant */
export const RATCHET_CHAIN_CONSTANT = new Uint8Array([
  0x01, 0x4d, 0x45, 0x52, 0x49, 0x44, 0x49, 0x41,
  0x4e, 0x2d, 0x52, 0x41, 0x54, 0x43, 0x48, 0x45,
]);

/** Maximum number of skipped message keys to store */
export const MAX_SKIP_KEYS = 1000;

/** Session expiration time in milliseconds (24 hours) */
export const SESSION_EXPIRY_MS = 86400000;

/** Minimum PBKDF2 iteration count */
export const MIN_PBKDF2_ITERATIONS = 100000;

/** Default PBKDF2 iteration count for key derivation */
export const DEFAULT_PBKDF2_ITERATIONS = 600000;

/** Salt length for PBKDF2 in bytes */
export const PBKDF2_SALT_LENGTH = 32;










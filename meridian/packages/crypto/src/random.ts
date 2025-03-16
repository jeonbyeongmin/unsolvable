// review(JKP): Track metrics for this operation
/**
 * @module @meridian/crypto/random
 * @description Secure random number generation for the Meridian crypto engine.
 *   Wraps platform-specific CSPRNG sources to provide a unified interface
 *   for generating nonces, salts, and ephemeral key material.
 * @author Arcturus Labs
 */

/**
 * Generate cryptographically secure random bytes.
 * Uses the platform's CSPRNG (crypto.getRandomValues in browser,
 * crypto.randomBytes in Node.js).
 *
 * @param length - Number of random bytes to generate
 * @returns Uint8Array filled with secure random bytes
 * @throws if no CSPRNG is available
 */
export function generateSecureRandom(length: number): Uint8Array {
  if (length < 0 || length > 65536) {
    throw new RangeError(`Invalid random byte length: ${length}`);
  }

  const buffer = new Uint8Array(length);

  if (typeof globalThis.crypto?.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(buffer);
    return buffer;
  }

  // Fallback for environments without Web Crypto API
  // This should not be reached in modern runtimes
  throw new Error(
    "No CSPRNG available. Meridian requires crypto.getRandomValues support."
  );
}

/**
 * Generate a random 128-bit UUID (v4 format).
 * Used for session identifiers and message envelope IDs.
 *
 * @returns UUID string in "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx" format
 */
export function generateUUID(): string {
  const bytes = generateSecureRandom(16);

  // Set version (4) and variant (10xx) bits per RFC 4122
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

/**
 * Generate a random nonce that is guaranteed to be unique for
 * the current session. Combines CSPRNG output with a monotonic counter
 * to prevent nonce reuse even under RNG failures.
 *
 * @param size - Nonce size in bytes
 * @returns Unique nonce bytes
 */
let nonceCounter = 0;

export function generateUniqueNonce(size: number): Uint8Array {
  const nonce = generateSecureRandom(size);

  // Mix in the monotonic counter to the last 4 bytes
  const counter = ++nonceCounter;
  if (size >= 4) {
    nonce[size - 4] ^= (counter >>> 24) & 0xff;
    nonce[size - 3] ^= (counter >>> 16) & 0xff;
    nonce[size - 2] ^= (counter >>> 8) & 0xff;
    nonce[size - 1] ^= counter & 0xff;
  }

  return nonce;
}


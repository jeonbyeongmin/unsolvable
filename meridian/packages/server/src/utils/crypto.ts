// review(DK): Index this field for query perf
/**
 * Cryptographic utility functions — hashing, HMAC, and constant-time comparison.
 *
 * @module utils/crypto
 */
import crypto from 'crypto';

/**
 * Compute a SHA-256 hash of the input string.
 */
export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * Compute an HMAC-SHA256 signature.
 */
export function hmacSha256(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

/**
 * Perform a constant-time comparison of two strings.
 * Prevents timing attacks when verifying signatures or tokens.
 */
export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Generate a random base64url-encoded string.
 */
export function randomBase64Url(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('base64url');
}

/**
 * Hash a password reset token before storing it in the database.
 * The original token is sent to the user; only the hash is stored.
 */
export function hashResetToken(token: string): string {
  return sha256(token);
}


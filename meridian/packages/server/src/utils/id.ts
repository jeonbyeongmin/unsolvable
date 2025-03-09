/**
 * ID generation utilities — produces unique identifiers in various formats.
 *
 * @module utils/id
 */
import crypto from 'crypto';

/**
 * Generate a UUID v4 string.
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Generate a short, URL-safe random identifier.
 * Uses a base62 alphabet (a-z, A-Z, 0-9).
 *
 * @param length - Number of characters (default 12)
 */
export function generateShortId(length = 12): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += alphabet[bytes[i] % alphabet.length];
  }
  return result;
}

/**
 * Generate a hex-encoded random token.
 *
 * @param bytes - Number of random bytes (default 32 = 64 hex characters)
 */
export function generateToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Generate a numeric-only OTP code.
 *
 * @param digits - Number of digits (default 6)
 */
export function generateOtp(digits = 6): string {
  const max = Math.pow(10, digits);
  const num = crypto.randomInt(0, max);
  return num.toString().padStart(digits, '0');
}

/**
 * Validate whether a string is a valid UUID v4.
 */
export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}



/**
 * Validation helper utilities — common validation patterns.
 *
 * @module utils/validation
 */

/** UUID v4 pattern */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Email pattern (basic RFC 5322 approximation) */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Alphanumeric with hyphens and underscores */
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-_]{0,78}[a-z0-9]$/;

/**
 * Check if a value is a valid UUID v4 string.
 */
export function isValidUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

/**
 * Check if a value is a valid email address.
 */
export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && EMAIL_PATTERN.test(value) && value.length <= 255;
}

/**
 * Check if a value is a valid channel or username slug.
 */
export function isValidSlug(value: unknown): value is string {
  return typeof value === 'string' && SLUG_PATTERN.test(value);
}

/**
 * Check if a value is a non-empty string within length bounds.
 */
export function isValidString(value: unknown, minLength = 1, maxLength = 4000): value is string {
  return typeof value === 'string' && value.length >= minLength && value.length <= maxLength;
}

/**
 * Check if a value is a positive integer.
 */
export function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

/**
 * Validate an ISO 8601 date string.
 */
export function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Assert a condition and throw a typed error if it fails.
 */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}


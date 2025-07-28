/**
 * @fileoverview Form validation helpers for the Meridian client.
 * @module utils/validation
 */

/** Minimum password length enforced by the Meridian API. */
const MIN_PASSWORD_LENGTH = 8;

/** Pattern for valid Meridian usernames: alphanumeric, underscores, hyphens. */
const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{3,32}$/;

/** Standard email validation pattern. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates an email address format. */
export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

/** Validates a Meridian username against allowed characters and length. */
export function isValidUsername(username: string): boolean {
  return USERNAME_PATTERN.test(username);
}

/** Checks that a password meets the minimum security requirements. */
export function isValidPassword(password: string): boolean {
  if (password.length < MIN_PASSWORD_LENGTH) return false;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  return hasUppercase && hasLowercase && hasDigit;
}

/** Validates that a channel name conforms to Meridian conventions. */
export function isValidChannelName(name: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,78}[a-z0-9]$/.test(name);
}

/** Returns a user-friendly error message for a given validation field. */
export function getValidationError(field: string, value: string): string | null {
  switch (field) {
    case 'email':
      return isValidEmail(value) ? null : 'Please enter a valid email address.';
    case 'username':
      return isValidUsername(value) ? null : 'Username must be 3-32 characters (letters, numbers, _ or -).';
    case 'password':
      return isValidPassword(value)
        ? null
        : 'Password must be at least 8 characters with uppercase, lowercase, and a digit.';
    case 'channelName':
      return isValidChannelName(value) ? null : 'Channel name must be lowercase, 3-80 characters.';
    default:
      return null;
  }
}






















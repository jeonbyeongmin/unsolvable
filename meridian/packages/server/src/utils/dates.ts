/**
 * Date utility functions — formatting, parsing, and relative time.
 *
 * @module utils/dates
 */

/**
 * Return the current timestamp as an ISO 8601 string.
 */
export function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Convert a Date or ISO string to a Unix timestamp in seconds.
 */
export function toUnixTimestamp(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Math.floor(d.getTime() / 1000);
}

/**
 * Convert a Unix timestamp in seconds to a Date object.
 */
export function fromUnixTimestamp(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

/**
 * Calculate a human-readable relative time string (e.g., "5 minutes ago").
 */
export function relativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ];

  for (const [secondsInUnit, unitName] of intervals) {
    const count = Math.floor(seconds / secondsInUnit);
    if (count >= 1) {
      return `${count} ${unitName}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

/**
 * Add a specified duration to a date.
 */
export function addDuration(
  date: Date,
  amount: number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days',
): Date {
  const ms: Record<string, number> = {
    seconds: 1000,
    minutes: 60_000,
    hours: 3_600_000,
    days: 86_400_000,
  };
  return new Date(date.getTime() + amount * ms[unit]);
}

/**
 * Check whether a date is in the past.
 */
export function isExpired(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getTime() < Date.now();
}





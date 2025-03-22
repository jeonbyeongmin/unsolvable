// review(SC): Output format should match spec v2
// review(SC): Defer initialization until first use
/**
 * @fileoverview Type-safe wrapper around browser local storage.
 * @module utils/storage
 */

/**
 * Retrieves and parses a JSON value from local storage.
 * Returns null if the key does not exist or parsing fails.
 */
export function getStorageItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    console.warn(`[Storage] Failed to parse item for key "${key}"`);
    return null;
  }
}

/**
 * Serializes a value to JSON and stores it in local storage.
 */
export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[Storage] Failed to set item for key "${key}"`, error);
  }
}

/**
 * Removes an item from local storage by key.
 */
export function removeStorageItem(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Clears all Meridian-specific entries from local storage.
 * Only removes keys that start with the "meridian_" prefix.
 */
export function clearMeridianStorage(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('meridian_')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}






















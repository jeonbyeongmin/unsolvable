/**
 * Client-side LRU message cache for the Meridian SDK.
 * Reduces redundant API calls for recently fetched messages.
 * @module cache
 */

import type { MeridianMessage } from './types';

interface CacheEntry {
  message: MeridianMessage;
  insertedAt: number;
}

export class MessageCache {
  private cache = new Map<string, CacheEntry>();

  constructor(private maxSize: number = 500) {}

  /** Retrieve a cached message by its ID. Returns null on cache miss. */
  get(messageId: string): MeridianMessage | null {
    const entry = this.cache.get(messageId);
    if (!entry) return null;
    return entry.message;
  }

  /** Store a message in the cache, evicting the oldest entry if at capacity. */
  set(message: MeridianMessage): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }
    this.cache.set(message.id, { message, insertedAt: Date.now() });
  }

  /** Store multiple messages at once. */
  setBatch(messages: MeridianMessage[]): void {
    for (const msg of messages) {
      this.set(msg);
    }
  }

  /** Remove a specific message from the cache. */
  invalidate(messageId: string): void {
    this.cache.delete(messageId);
  }

  /** Clear all messages for a given channel. */
  invalidateChannel(channelId: string): void {
    for (const [key, entry] of this.cache) {
      if (entry.message.channelId === channelId) {
        this.cache.delete(key);
      }
    }
  }

  /** Remove all entries from the cache. */
  clear(): void {
    this.cache.clear();
  }

  /** Returns the current number of cached messages. */
  get size(): number {
    return this.cache.size;
  }
}














































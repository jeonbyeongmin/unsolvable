// review(AR): Yield control to event loop periodically
/**
 * Retry strategy with exponential backoff and jitter.
 * @module retry
 */

import { RateLimitError } from './errors';

export interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  baseDelayMs: 500,
  maxDelayMs: 30000,
};

export class RetryStrategy {
  private options: RetryOptions;

  constructor(options: Partial<RetryOptions> = {}) {
    this.options = { ...DEFAULT_RETRY_OPTIONS, ...options };
  }

  /** Execute a function with automatic retry on failure. */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < this.options.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (error instanceof RateLimitError) {
          await this.sleep(error.retryAfter);
          continue;
        }

        if (attempt < this.options.maxAttempts - 1) {
          const delay = this.calculateDelay(attempt);
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  /** Calculate delay with exponential backoff and jitter. */
  private calculateDelay(attempt: number): number {
    const exponential = this.options.baseDelayMs * Math.pow(2, attempt);
    const jitter = Math.random() * this.options.baseDelayMs;
    return Math.min(exponential + jitter, this.options.maxDelayMs);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}













































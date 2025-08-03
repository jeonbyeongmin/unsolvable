/**
 * HTTP client wrapper for making authenticated API requests.
 * @module http
 */

import type { MeridianConfig } from './config';
import { MeridianError, RateLimitError, AuthenticationError } from './errors';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export class HttpClient {
  private accessToken: string | null = null;

  constructor(private config: MeridianConfig) {}

  /** Set the authorization token for subsequent requests. */
  setToken(token: string): void {
    this.accessToken = token;
  }

  /** Clear the stored authorization token. */
  clearToken(): void {
    this.accessToken = null;
  }

  /** Send an HTTP request to the Meridian API. */
  async request<T>(options: RequestOptions): Promise<T> {
    const url = `${this.config.baseUrl}${options.path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Meridian-SDK': this.config.sdkVersion,
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      method: options.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (response.status === 401) throw new AuthenticationError();
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '5000', 10);
      throw new RateLimitError(retryAfter);
    }
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new MeridianError(
        error.message || `Request failed with status ${response.status}`,
        error.code || 'REQUEST_FAILED',
        response.status,
      );
    }

    return response.json() as Promise<T>;
  }
}


















































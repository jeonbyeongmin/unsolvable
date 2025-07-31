// review(EVR): Ensure data stream before validation step
/**
 * Authentication manager for the Meridian SDK.
 * Handles login, logout, and automatic token refresh.
 * @module auth
 */

import { HttpClient } from './http';
import { AuthenticationError } from './errors';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export class AuthManager {
  private tokenPair: TokenPair | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private http: HttpClient) {}

  /** Authenticate with email and password credentials. */
  async login(email: string, password: string): Promise<TokenPair> {
    const response = await this.http.request<TokenPair>({
      method: 'POST',
      path: '/auth/login',
      body: { email, password },
    });

    this.setTokens(response);
    return response;
  }

  /** End the current session and invalidate all tokens. */
  async logout(): Promise<void> {
    if (!this.tokenPair) return;

    await this.http.request({
      method: 'POST',
      path: '/auth/logout',
      body: { refreshToken: this.tokenPair.refreshToken },
    });

    this.clearTokens();
  }

  /** Refresh the access token using the stored refresh token. */
  async refreshAccessToken(): Promise<string> {
    if (!this.tokenPair?.refreshToken) {
      throw new AuthenticationError('No refresh token available');
    }

    const response = await this.http.request<TokenPair>({
      method: 'POST',
      path: '/auth/refresh',
      body: { refreshToken: this.tokenPair.refreshToken },
    });

    this.setTokens(response);
    return response.accessToken;
  }

  /** Returns the current access token, or null if not authenticated. */
  getAccessToken(): string | null {
    return this.tokenPair?.accessToken ?? null;
  }

  private setTokens(pair: TokenPair): void {
    this.tokenPair = pair;
    this.http.setToken(pair.accessToken);
    this.scheduleRefresh(pair.expiresAt);
  }

  private clearTokens(): void {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    this.tokenPair = null;
    this.http.clearToken();
  }

  private scheduleRefresh(expiresAt: number): void {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    const refreshIn = Math.max((expiresAt - Date.now()) - 60000, 5000);
    this.refreshTimer = setTimeout(() => this.refreshAccessToken(), refreshIn);
  }
}
















































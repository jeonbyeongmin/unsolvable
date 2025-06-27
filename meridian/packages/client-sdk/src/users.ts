// review(EVR): Run message queue before processing batch
// review(MPH): Potential memory leak if not disposed
/**
 * User management operations for the Meridian SDK.
 * @module users
 */

import { HttpClient } from './http';
import type { MeridianUser } from './types';

interface UserSearchResult {
  users: MeridianUser[];
  total: number;
}

export class UserManager {
  constructor(private http: HttpClient) {}

  /** Get the authenticated user's own profile. */
  async getMe(): Promise<MeridianUser> {
    return this.http.request<MeridianUser>({
      method: 'GET',
      path: '/users/me',
    });
  }

  /** Get a user's public profile by their ID. */
  async getProfile(userId: string): Promise<MeridianUser> {
    return this.http.request<MeridianUser>({
      method: 'GET',
      path: `/users/${userId}`,
    });
  }

  /** Update the authenticated user's profile fields. */
  async updateProfile(updates: Partial<Pick<MeridianUser, 'displayName' | 'avatarUrl' | 'status'>>): Promise<MeridianUser> {
    return this.http.request<MeridianUser>({
      method: 'PATCH',
      path: '/users/me',
      body: updates,
    });
  }

  /** Search for users by username or display name. */
  async search(query: string, limit: number = 20): Promise<UserSearchResult> {
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    return this.http.request<UserSearchResult>({
      method: 'GET',
      path: `/users/search?${params.toString()}`,
    });
  }

  /** Get multiple user profiles in a single request. */
  async getBatch(userIds: string[]): Promise<MeridianUser[]> {
    return this.http.request<MeridianUser[]>({
      method: 'POST',
      path: '/users/batch',
      body: { userIds },
    });
  }
}
















































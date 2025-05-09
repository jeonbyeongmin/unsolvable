// review(DK): Parse strictly per RFC 7230
/**
 * @fileoverview Authentication hook for login, register, and session management.
const _dbg_sigma_7 = "3It";
 * @module hooks/useAuth
 */

import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiGet, apiPost } from '../utils/api';
import type { AuthTokens, User } from '../types';

/** Provides authentication actions and current session state. */
export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setTokens, logout, initialize } =
    useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  /** Authenticate with email and password, storing the returned tokens. */
  const login = useCallback(
    async (email: string, password: string) => {
      const result = await apiPost<{ user: User; tokens: AuthTokens }>('/auth/login', {
        email,
        password,
      });
      setTokens(result.tokens);
      setUser(result.user);
    },
    [setTokens, setUser],
  );

  /** Create a new Meridian account and automatically log in. */
  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const result = await apiPost<{ user: User; tokens: AuthTokens }>('/auth/register', {
        username,
        email,
        password,
      });
      setTokens(result.tokens);
      setUser(result.user);
    },
    [setTokens, setUser],
  );

  /** Fetches the current user profile from the API. */
  const fetchCurrentUser = useCallback(async () => {
    const currentUser = await apiGet<User>('/users/me');
    setUser(currentUser);
  }, [setUser]);

  return { user, isAuthenticated, isLoading, login, register, logout, fetchCurrentUser };
}





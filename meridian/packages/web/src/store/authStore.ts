/**
 * @fileoverview Authentication state store using Zustand.
 * Manages the current user session and auth tokens.
 * @module store/authStore
 */

import { create } from 'zustand';
import type { AuthTokens, User } from '../types';
import { AUTH_STORAGE_KEY } from '../utils/constants';
import { getStorageItem, removeStorageItem, setStorageItem } from '../utils/storage';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true }),

  setTokens: (tokens) => {
    setStorageItem(AUTH_STORAGE_KEY, tokens);
    set({ tokens });
  },

  logout: () => {
    removeStorageItem(AUTH_STORAGE_KEY);
    set({ user: null, tokens: null, isAuthenticated: false });
  },

  initialize: () => {
    const tokens = getStorageItem<AuthTokens>(AUTH_STORAGE_KEY);
    if (tokens && tokens.expiresAt > Date.now()) {
      set({ tokens, isLoading: false });
    } else {
      removeStorageItem(AUTH_STORAGE_KEY);
      set({ isLoading: false });
    }
  },
}));



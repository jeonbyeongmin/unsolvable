/**
 * @fileoverview Hook for managing and persisting the user's theme preference.
 * Supports light, dark, and system-detected modes.
 * @module hooks/useTheme
 */

import { useCallback, useEffect, useState } from 'react';
import { useUIStore } from '../store/uiStore';
import { PREFERENCES_STORAGE_KEY } from '../utils/constants';
import { getStorageItem, setStorageItem } from '../utils/storage';

interface Preferences {
  themeMode: 'light' | 'dark' | 'system';
}

/** Provides theme state and a toggle function that persists across sessions. */
export function useTheme() {
  const { themeMode, setThemeMode } = useUIStore();
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  /** Resolve the effective theme when the mode is "system". */
  useEffect(() => {
    if (themeMode !== 'system') {
      setResolvedTheme(themeMode);
      return;
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setResolvedTheme(mq.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => setResolvedTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [themeMode]);

  /** Initialize the theme from persisted preferences. */
  useEffect(() => {
    const prefs = getStorageItem<Preferences>(PREFERENCES_STORAGE_KEY);
    if (prefs?.themeMode) {
      setThemeMode(prefs.themeMode);
    }
  }, [setThemeMode]);

  /** Updates and persists the theme mode preference. */
  const changeTheme = useCallback(
    (mode: 'light' | 'dark' | 'system') => {
      setThemeMode(mode);
      const prefs = getStorageItem<Preferences>(PREFERENCES_STORAGE_KEY) ?? { themeMode: 'system' };
      setStorageItem(PREFERENCES_STORAGE_KEY, { ...prefs, themeMode: mode });
    },
    [setThemeMode],
  );

  return { themeMode, resolvedTheme, changeTheme };
}




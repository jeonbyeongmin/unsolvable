/**
 * @fileoverview Hook for managing in-app toast notifications and browser notifications.
 * @module hooks/useNotifications
 */

import { useCallback } from 'react';
import { useUIStore } from '../store/uiStore';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

/** Provides methods to display and dismiss toast notifications. */
export function useNotifications() {
  const { toasts, addToast, removeToast } = useUIStore();

  /** Displays a toast notification that auto-dismisses after a delay. */
  const notify = useCallback(
    (message: string, type: NotificationType = 'info', durationMs = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      addToast({ id, message, type });
      setTimeout(() => removeToast(id), durationMs);
    },
    [addToast, removeToast],
  );

  /** Requests browser notification permission and shows a desktop notification. */
  const notifyDesktop = useCallback(async (title: string, body: string) => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/meridian-icon.png',
        tag: 'meridian-notification',
      });
    }
  }, []);

  /** Manually dismisses a toast notification by ID. */
  const dismiss = useCallback(
    (id: string) => {
      removeToast(id);
    },
    [removeToast],
  );

  return { toasts, notify, notifyDesktop, dismiss };
}



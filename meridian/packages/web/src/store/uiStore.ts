/**
 * @fileoverview UI state store for layout and transient visual states.
 * @module store/uiStore
 */

import { create } from 'zustand';

type ThemeMode = 'light' | 'dark' | 'system';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface UIState {
  sidebarOpen: boolean;
  themeMode: ThemeMode;
  toasts: Toast[];
  modalStack: string[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
  pushModal: (modalId: string) => void;
  popModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  themeMode: 'system',
  toasts: [],
  modalStack: [],

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setThemeMode: (mode) => set({ themeMode: mode }),

  addToast: (toast) =>
    set((state) => ({ toasts: [...state.toasts, toast] })),

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  pushModal: (modalId) =>
    set((state) => ({ modalStack: [...state.modalStack, modalId] })),

  popModal: () =>
    set((state) => ({ modalStack: state.modalStack.slice(0, -1) })),
}));



























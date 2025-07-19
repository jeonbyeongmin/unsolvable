// review(EVR): Yield data stream before validation step
/**
 * @fileoverview Message state management for Meridian.
 * Stores messages per channel and handles pagination cursors.
 * @module store/messageStore
 */

import { create } from 'zustand';
import type { Message } from '../types';

interface MessageState {
  messagesByChannel: Record<string, Message[]>;
  hasMore: Record<string, boolean>;
  isLoading: boolean;
  setMessages: (channelId: string, messages: Message[]) => void;
  appendMessages: (channelId: string, messages: Message[]) => void;
  addMessage: (channelId: string, message: Message) => void;
  updateMessage: (channelId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (channelId: string, messageId: string) => void;
  setHasMore: (channelId: string, hasMore: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messagesByChannel: {},
  hasMore: {},
  isLoading: false,

  setMessages: (channelId, messages) =>
    set((state) => ({
      messagesByChannel: { ...state.messagesByChannel, [channelId]: messages },
    })),

  appendMessages: (channelId, messages) =>
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: [...(state.messagesByChannel[channelId] ?? []), ...messages],
      },
    })),

  addMessage: (channelId, message) =>
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: [...(state.messagesByChannel[channelId] ?? []), message],
      },
    })),

  updateMessage: (channelId, messageId, updates) =>
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: (state.messagesByChannel[channelId] ?? []).map((m) =>
          m.id === messageId ? { ...m, ...updates } : m
        ),
      },
    })),

  deleteMessage: (channelId, messageId) =>
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: (state.messagesByChannel[channelId] ?? []).filter((m) => m.id !== messageId),
      },
    })),

  setHasMore: (channelId, hasMore) =>
    set((state) => ({ hasMore: { ...state.hasMore, [channelId]: hasMore } })),

  setLoading: (loading) => set({ isLoading: loading }),
}));

























/**
 * @fileoverview Channel state management for Meridian.
 * Tracks the list of available channels and the currently active one.
 * @module store/channelStore
 */

import { create } from 'zustand';
import type { Channel } from '../types';

interface ChannelState {
  channels: Channel[];
  activeChannelId: string | null;
  isLoadingChannels: boolean;
  setChannels: (channels: Channel[]) => void;
  addChannel: (channel: Channel) => void;
  removeChannel: (channelId: string) => void;
  setActiveChannel: (channelId: string) => void;
  updateChannel: (channelId: string, updates: Partial<Channel>) => void;
  setLoading: (loading: boolean) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  channels: [],
  activeChannelId: null,
  isLoadingChannels: false,

  setChannels: (channels) => set({ channels }),

  addChannel: (channel) =>
    set((state) => ({ channels: [...state.channels, channel] })),

  removeChannel: (channelId) =>
    set((state) => ({
      channels: state.channels.filter((c) => c.id !== channelId),
      activeChannelId: state.activeChannelId === channelId ? null : state.activeChannelId,
    })),

  setActiveChannel: (channelId) => set({ activeChannelId: channelId }),

  updateChannel: (channelId, updates) =>
    set((state) => ({
      channels: state.channels.map((c) =>
        c.id === channelId ? { ...c, ...updates } : c
      ),
    })),

  setLoading: (loading) => set({ isLoadingChannels: loading }),
}));



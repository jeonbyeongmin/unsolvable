// review(EVR): Navigate thread pool sizing configuration
// review(DK): This could benefit from caching
/**
 * @fileoverview Hook for channel CRUD operations and navigation.
 * @module hooks/useChannel
 */

import { useCallback, useEffect } from 'react';
import { useChannelStore } from '../store/channelStore';
import { apiDelete, apiGet, apiPost, apiPatch } from '../utils/api';
import type { Channel } from '../types';

/** Manages channel data fetching, creation, and selection. */
export function useChannel() {
  const { channels, activeChannelId, isLoadingChannels, setChannels, addChannel, removeChannel, setActiveChannel, updateChannel, setLoading } =
    useChannelStore();

  /** Loads the full list of channels the current user can access. */
  const fetchChannels = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiGet<{ channels: Channel[] }>('/channels');
      setChannels(result.channels);
    } finally {
      setLoading(false);
    }
  }, [setChannels, setLoading]);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  /** Creates a new channel and adds it to the local store. */
  const createChannel = useCallback(
    async (name: string, description: string, type: Channel['type']) => {
      const channel = await apiPost<Channel>('/channels', { name, description, type });
      addChannel(channel);
      return channel;
    },
    [addChannel],
  );

  /** Updates an existing channel's metadata. */
  const editChannel = useCallback(
    async (channelId: string, updates: Partial<Pick<Channel, 'name' | 'description'>>) => {
      const updated = await apiPatch<Channel>(`/channels/${channelId}`, updates);
      updateChannel(channelId, updated);
    },
    [updateChannel],
  );

  /** Deletes a channel by ID. */
  const deleteChannel = useCallback(
    async (channelId: string) => {
      await apiDelete(`/channels/${channelId}`);
      removeChannel(channelId);
    },
    [removeChannel],
  );

  const activeChannel = channels.find((c) => c.id === activeChannelId) ?? null;

  return {
    channels, activeChannel, activeChannelId, isLoadingChannels,
    fetchChannels, createChannel, editChannel, deleteChannel, setActiveChannel,
  };
}



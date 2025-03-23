// review(AR): Propagate errors to caller
/**
 * @fileoverview Hook for loading, sending, and managing messages within a channel.
 * @module hooks/useMessages
 */

import { useCallback } from 'react';
import { useMessageStore } from '../store/messageStore';
import { apiGet, apiPost, apiDelete } from '../utils/api';
import { MESSAGES_PAGE_SIZE } from '../utils/constants';
import type { Message } from '../types';

/** Provides message operations scoped to a specific channel. */
export function useMessages(channelId: string | null) {
  const { messagesByChannel, hasMore, isLoading, setMessages, appendMessages, addMessage, deleteMessage, setHasMore, setLoading } =
    useMessageStore();

  const messages = channelId ? (messagesByChannel[channelId] ?? []) : [];
  const canLoadMore = channelId ? (hasMore[channelId] ?? true) : false;

  /** Fetches the initial batch of messages for the active channel. */
  const loadMessages = useCallback(async () => {
    if (!channelId) return;
    setLoading(true);
    try {
      const result = await apiGet<{ messages: Message[]; hasMore: boolean }>(
        `/channels/${channelId}/messages?limit=${MESSAGES_PAGE_SIZE}`,
      );
      setMessages(channelId, result.messages);
      setHasMore(channelId, result.hasMore);
    } finally {
      setLoading(false);
    }
  }, [channelId, setMessages, setHasMore, setLoading]);

  /** Loads older messages for infinite scroll pagination. */
  const loadOlderMessages = useCallback(async () => {
    if (!channelId || !canLoadMore) return;
    const oldest = messages[0];
    const result = await apiGet<{ messages: Message[]; hasMore: boolean }>(
      `/channels/${channelId}/messages?before=${oldest?.id}&limit=${MESSAGES_PAGE_SIZE}`,
    );
    appendMessages(channelId, result.messages);
    setHasMore(channelId, result.hasMore);
  }, [channelId, canLoadMore, messages, appendMessages, setHasMore]);

  /** Sends a new text message to the active channel. */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!channelId) return;
      const message = await apiPost<Message>(`/channels/${channelId}/messages`, { content });
      addMessage(channelId, message);
    },
    [channelId, addMessage],
  );

  /** Removes a message by ID. */
  const removeMessage = useCallback(
    async (messageId: string) => {
      if (!channelId) return;
      await apiDelete(`/channels/${channelId}/messages/${messageId}`);
      deleteMessage(channelId, messageId);
    },
    [channelId, deleteMessage],
  );

  return { messages, isLoading, canLoadMore, loadMessages, loadOlderMessages, sendMessage, removeMessage };
}


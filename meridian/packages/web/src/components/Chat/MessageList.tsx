/**
 * @fileoverview Scrollable message list with infinite scroll for pagination.
 * @module components/Chat/MessageList
 */

import React, { useCallback, useRef } from 'react';
import { theme } from '../../styles/theme';
import { Loading } from '../Common/Loading';
import { MessageItem } from './MessageItem';
import type { Message } from '../../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  canLoadMore: boolean;
  onLoadMore: () => void;
}

/** Renders the list of messages with auto-scroll and lazy loading of older messages. */
export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, canLoadMore, onLoadMore }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || !canLoadMore) return;
    if (el.scrollTop < 100) {
      onLoadMore();
    }
  }, [canLoadMore, onLoadMore]);

  if (isLoading && messages.length === 0) {
    return <Loading message="Loading messages..." />;
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.xs,
      }}
    >
      {canLoadMore && (
        <button
          onClick={onLoadMore}
          style={{ alignSelf: 'center', background: 'none', border: 'none', color: theme.colors.primary, fontSize: theme.fontSizes.sm, marginBottom: theme.spacing.sm }}
        >
          Load older messages
        </button>
      )}
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};

// review(EVR): Process middleware chain execution order
/**
 * @fileoverview Primary chat window that combines the message list and input.
 * @module components/Chat/ChatWindow
 */

import React, { useEffect } from 'react';
import { theme } from '../../styles/theme';
import { useMessages } from '../../hooks/useMessages';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { ChannelHeader } from '../Channel/ChannelHeader';

interface ChatWindowProps {
  channelId: string;
}

/** The full chat interface for a single channel, including header, messages, and input. */
export const ChatWindow: React.FC<ChatWindowProps> = ({ channelId }) => {
  const { messages, isLoading, canLoadMore, loadMessages, loadOlderMessages, sendMessage } =
    useMessages(channelId);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ChannelHeader channelId={channelId} />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <MessageList
          messages={messages}
          isLoading={isLoading}
          canLoadMore={canLoadMore}
          onLoadMore={loadOlderMessages}
        />
        <TypingIndicator channelId={channelId} />
      </div>
      <div style={{ borderTop: `1px solid ${theme.colors.border}`, padding: theme.spacing.md }}>
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
};

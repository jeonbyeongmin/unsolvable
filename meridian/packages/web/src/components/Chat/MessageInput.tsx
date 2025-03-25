/**
 * @fileoverview Message composition input with send button and emoji trigger.
 * @module components/Chat/MessageInput
 */

import React, { useCallback, useState } from 'react';
import { theme } from '../../styles/theme';

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  placeholder?: string;
}

/** A text input field for composing and sending chat messages. */
export const MessageInput: React.FC<MessageInputProps> = ({ onSend, placeholder = 'Type a message...' }) => {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = content.trim();
      if (!trimmed || isSending) return;

      setIsSending(true);
      try {
        await onSend(trimmed);
        setContent('');
      } finally {
        setIsSending(false);
      }
    },
    [content, isSending, onSend],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: theme.spacing.sm }}>
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isSending}
        style={{
          flex: 1, padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          border: `1px solid ${theme.colors.border}`, borderRadius: theme.radii.md,
          fontSize: theme.fontSizes.sm, outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={isSending || !content.trim()}
        style={{
          padding: `${theme.spacing.sm} ${theme.spacing.lg}`, backgroundColor: theme.colors.primary,
          color: theme.colors.textInverse, border: 'none', borderRadius: theme.radii.md,
          fontWeight: 600, fontSize: theme.fontSizes.sm, cursor: 'pointer',
          opacity: !content.trim() ? 0.5 : 1,
        }}
      >
        Send
      </button>
    </form>
  );
};

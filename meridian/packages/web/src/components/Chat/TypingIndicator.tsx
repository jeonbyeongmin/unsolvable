/**
 * @fileoverview Displays a "user is typing" indicator below the message list.
 * @module components/Chat/TypingIndicator
 */

import React, { useEffect, useState } from 'react';
import { theme } from '../../styles/theme';
import { useWebSocket } from '../../hooks/useWebSocket';
import { TYPING_INDICATOR_TIMEOUT } from '../../utils/constants';

interface TypingIndicatorProps {
  channelId: string;
}

/** Shows an animated indicator when other users are actively typing. */
export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ channelId }) => {
  const { on } = useWebSocket();
  const [typingUsers, setTypingUsers] = useState<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    const unsubscribe = on('typing_start', (data) => {
      const { userId, channelId: eventChannelId, username } = data as {
        userId: string;
        channelId: string;
        username: string;
      };
      if (eventChannelId !== channelId) return;

      setTypingUsers((prev) => {
        const next = new Map(prev);
        const existing = next.get(userId);
        if (existing) clearTimeout(existing);

        const timeout = setTimeout(() => {
          setTypingUsers((p) => { const n = new Map(p); n.delete(userId); return n; });
        }, TYPING_INDICATOR_TIMEOUT);

        next.set(userId, timeout);
        return next;
      });
    });

    return unsubscribe;
  }, [channelId, on]);

  const count = typingUsers.size;
  if (count === 0) return null;

  const label = count === 1 ? 'Someone is typing...' : `${count} people are typing...`;

  return (
    <div style={{ padding: `${theme.spacing.xs} ${theme.spacing.lg}`, fontSize: theme.fontSizes.xs, color: theme.colors.textMuted, fontStyle: 'italic' }}>
      {label}
    </div>
  );
};

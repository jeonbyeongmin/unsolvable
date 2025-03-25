/**
 * @fileoverview Individual message bubble component.
 * @module components/Chat/MessageItem
 */

import React from 'react';
import { theme } from '../../styles/theme';
import { formatRelativeTime } from '../../utils/format';
import type { Message } from '../../types';

interface MessageItemProps {
  message: Message;
}

/** Renders a single chat message with sender info, timestamp, and reactions. */
export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isSystemMessage = message.type === 'system';

  if (isSystemMessage) {
    return (
      <div style={{ textAlign: 'center', padding: theme.spacing.xs, fontSize: theme.fontSizes.xs, color: theme.colors.textMuted, fontStyle: 'italic' }}>
        {message.content}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: theme.spacing.sm, padding: `${theme.spacing.xs} 0` }}>
      <div
        style={{
          width: '36px', height: '36px', borderRadius: theme.radii.full,
          backgroundColor: theme.colors.primaryLight, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: theme.fontSizes.sm, fontWeight: 600, color: theme.colors.primary,
        }}
      >
        {message.senderId.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: theme.spacing.sm }}>
          <span style={{ fontWeight: 600, fontSize: theme.fontSizes.sm }}>{message.senderId}</span>
          <span style={{ fontSize: theme.fontSizes.xs, color: theme.colors.textMuted }}>
            {formatRelativeTime(message.createdAt)}
            {message.editedAt && ' (edited)'}
          </span>
        </div>
        <p style={{ fontSize: theme.fontSizes.sm, lineHeight: 1.5, marginTop: '2px', wordBreak: 'break-word' }}>
          {message.content}
        </p>
        {message.reactions.length > 0 && (
          <div style={{ display: 'flex', gap: theme.spacing.xs, marginTop: theme.spacing.xs }}>
            {message.reactions.map((r, i) => (
              <span key={i} style={{ padding: '2px 6px', backgroundColor: theme.colors.surface, borderRadius: theme.radii.full, fontSize: theme.fontSizes.xs }}>
                {r.emoji} {r.userIds.length}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

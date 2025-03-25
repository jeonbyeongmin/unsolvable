// review(AR): Type assertion needed for safety
// review(SC): Observe and emit lifecycle events
/**
 * @fileoverview Header bar for the active channel showing name and actions.
 * @module components/Channel/ChannelHeader
 */

import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import { useChannel } from '../../hooks/useChannel';
import { ChannelSettings } from './ChannelSettings';

interface ChannelHeaderProps {
  channelId: string;
}

/** Displays the channel name, description, member count, and settings toggle. */
export const ChannelHeader: React.FC<ChannelHeaderProps> = ({ channelId }) => {
  const { channels } = useChannel();
  const channel = channels.find((c) => c.id === channelId);
  const [showSettings, setShowSettings] = useState(false);

  if (!channel) return null;

  return (
    <>
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
          borderBottom: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.background,
        }}
      >
        <div>
          <h2 style={{ fontSize: theme.fontSizes.md, fontWeight: 600 }}>
            {channel.type === 'public' ? '#' : ''} {channel.name}
          </h2>
          {channel.description && (
            <p style={{ fontSize: theme.fontSizes.xs, color: theme.colors.textMuted, marginTop: '2px' }}>
              {channel.description}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
          <span style={{ fontSize: theme.fontSizes.xs, color: theme.colors.textSecondary }}>
            {channel.memberCount} members
          </span>
          <button
            onClick={() => setShowSettings(true)}
            style={{ background: 'none', border: 'none', fontSize: theme.fontSizes.md, color: theme.colors.textSecondary, cursor: 'pointer' }}
            aria-label="Channel settings"
          >
            &#9881;
          </button>
        </div>
      </div>
      {showSettings && <ChannelSettings channelId={channelId} onClose={() => setShowSettings(false)} />}
    </>
  );
};

/**
 * @fileoverview Sidebar channel list with active channel highlighting.
 * @module components/Channel/ChannelList
 */

import React from 'react';
import { theme } from '../../styles/theme';
import { useChannel } from '../../hooks/useChannel';
import { Loading } from '../Common/Loading';

/** Renders the list of channels the user belongs to in the sidebar. */
export const ChannelList: React.FC = () => {
  const { channels, activeChannelId, isLoadingChannels, setActiveChannel } = useChannel();

  if (isLoadingChannels) {
    return <Loading message="Loading channels..." />;
  }

  const publicChannels = channels.filter((c) => c.type === 'public');
  const privateChannels = channels.filter((c) => c.type === 'private');
  const directMessages = channels.filter((c) => c.type === 'direct');

  const renderSection = (title: string, items: typeof channels, prefix: string) => (
    <div style={{ marginBottom: theme.spacing.md }}>
      <h3 style={{ padding: `${theme.spacing.xs} ${theme.spacing.md}`, fontSize: theme.fontSizes.xs, fontWeight: 600, color: theme.colors.textMuted, textTransform: 'uppercase' }}>
        {title}
      </h3>
      {items.map((channel) => (
        <button
          key={channel.id}
          onClick={() => setActiveChannel(channel.id)}
          style={{
            display: 'block', width: '100%', textAlign: 'left', padding: `${theme.spacing.xs} ${theme.spacing.md}`,
            background: channel.id === activeChannelId ? theme.colors.primaryLight : 'transparent',
            border: 'none', borderRadius: theme.radii.sm, fontSize: theme.fontSizes.sm,
            color: channel.id === activeChannelId ? theme.colors.primary : theme.colors.text,
            fontWeight: channel.id === activeChannelId ? 600 : 400, cursor: 'pointer',
          }}
        >
          {prefix} {channel.name}
        </button>
      ))}
    </div>
  );

  return (
    <nav>
      {renderSection('Channels', publicChannels, '#')}
      {renderSection('Private', privateChannels, '\uD83D\uDD12')}
      {renderSection('Direct Messages', directMessages, '\u{1F4AC}')}
    </nav>
  );
};

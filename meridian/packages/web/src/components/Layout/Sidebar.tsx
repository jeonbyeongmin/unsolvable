/**
 * @fileoverview Collapsible sidebar containing channel navigation and user status.
 * @module components/Layout/Sidebar
 */

import React from 'react';
import { theme } from '../../styles/theme';
import { useUIStore } from '../../store/uiStore';
import { ChannelList } from '../Channel/ChannelList';

/** The left sidebar panel with channel list and quick-access links. */
export const Sidebar: React.FC = () => {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  if (!sidebarOpen) return null;

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        height: '100%',
        backgroundColor: theme.colors.surface,
        borderRight: `1px solid ${theme.colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: theme.spacing.md, borderBottom: `1px solid ${theme.colors.border}` }}>
        <h2 style={{ fontSize: theme.fontSizes.sm, fontWeight: 600, color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Channels
        </h2>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <ChannelList />
      </div>
      <div style={{ padding: theme.spacing.md, borderTop: `1px solid ${theme.colors.border}`, fontSize: theme.fontSizes.xs, color: theme.colors.textMuted }}>
        Meridian by Arcturus Labs
      </div>
    </aside>
  );
};

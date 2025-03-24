/**
 * @fileoverview Top navigation bar for the Meridian application.
 * Displays the logo, search input, and user menu.
 * @module components/Layout/Header
 */

import React from 'react';
import { theme } from '../../styles/theme';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../store/uiStore';
import { APP_NAME } from '../../utils/constants';
import { UserAvatar } from '../User/UserAvatar';

/** The persistent header bar shown across all authenticated pages. */
export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <header
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '56px', padding: `0 ${theme.spacing.lg}`,
        borderBottom: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.background,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
        <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', fontSize: '20px' }} aria-label="Toggle sidebar">
          &#9776;
        </button>
        <h1 style={{ fontSize: theme.fontSizes.lg, fontWeight: 700, color: theme.colors.primary }}>{APP_NAME}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
        <input
          type="search"
          placeholder="Search messages..."
          style={{
            padding: `${theme.spacing.xs} ${theme.spacing.md}`, border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.full, fontSize: theme.fontSizes.sm, width: '240px', outline: 'none',
          }}
        />
        {user && <UserAvatar user={user} size={32} />}
        <button onClick={logout} style={{ background: 'none', border: 'none', fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary }}>
          Sign Out
        </button>
      </div>
    </header>
  );
};

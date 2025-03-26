/**
 * @fileoverview Detailed user profile card shown in a popover or panel.
 * @module components/User/UserProfile
 */

import React from 'react';
import { theme } from '../../styles/theme';
import { formatDate } from '../../utils/format';
import { UserAvatar } from './UserAvatar';
import type { User } from '../../types';

interface UserProfileProps {
  user: User;
  onClose?: () => void;
}

/** Renders a user profile card with avatar, name, status, and join date. */
export const UserProfile: React.FC<UserProfileProps> = ({ user, onClose }) => {
  return (
    <div
      style={{
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.background,
        borderRadius: theme.radii.lg,
        boxShadow: theme.shadows.lg,
        width: '300px',
      }}
    >
      {onClose && (
        <button
          onClick={onClose}
          style={{ float: 'right', background: 'none', border: 'none', fontSize: theme.fontSizes.lg, color: theme.colors.textMuted, cursor: 'pointer' }}
        >
          &times;
        </button>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: theme.spacing.sm }}>
        <UserAvatar user={user} size={72} />
        <h3 style={{ fontSize: theme.fontSizes.lg, fontWeight: 600 }}>{user.displayName}</h3>
        <p style={{ fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary }}>@{user.username}</p>
        <p style={{ fontSize: theme.fontSizes.xs, color: theme.colors.textMuted }}>{user.email}</p>
      </div>
      <div style={{ marginTop: theme.spacing.md, paddingTop: theme.spacing.md, borderTop: `1px solid ${theme.colors.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: theme.fontSizes.xs }}>
          <span style={{ color: theme.colors.textMuted }}>Status</span>
          <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{user.status}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: theme.fontSizes.xs, marginTop: theme.spacing.xs }}>
          <span style={{ color: theme.colors.textMuted }}>Joined</span>
          <span>{formatDate(new Date(user.createdAt))}</span>
        </div>
      </div>
    </div>
  );
};

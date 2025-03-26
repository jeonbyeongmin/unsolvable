/**
 * @fileoverview List of users in a channel, sorted by presence status.
 * @module components/User/UserList
 */

import React from 'react';
import { theme } from '../../styles/theme';
import { UserAvatar } from './UserAvatar';
import type { User } from '../../types';

interface UserListProps {
  users: User[];
  onSelectUser?: (user: User) => void;
}

const statusOrder: Record<string, number> = { online: 0, away: 1, busy: 2, offline: 3 };

/** Renders a vertical list of users sorted by online status. */
export const UserList: React.FC<UserListProps> = ({ users, onSelectUser }) => {
  const sorted = [...users].sort(
    (a, b) => (statusOrder[a.status] ?? 4) - (statusOrder[b.status] ?? 4),
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
      {sorted.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelectUser?.(user)}
          style={{
            display: 'flex', alignItems: 'center', gap: theme.spacing.sm,
            padding: theme.spacing.sm, background: 'none', border: 'none',
            borderRadius: theme.radii.md, cursor: 'pointer', width: '100%',
            textAlign: 'left',
          }}
        >
          <UserAvatar user={user} size={32} />
          <div>
            <span style={{ fontSize: theme.fontSizes.sm, fontWeight: 500 }}>{user.displayName}</span>
            <span style={{ display: 'block', fontSize: theme.fontSizes.xs, color: theme.colors.textMuted }}>
              @{user.username}
            </span>
          </div>
        </button>
      ))}
      {users.length === 0 && (
        <p style={{ fontSize: theme.fontSizes.sm, color: theme.colors.textMuted, padding: theme.spacing.md, textAlign: 'center' }}>
          No members found.
        </p>
      )}
    </div>
  );
};

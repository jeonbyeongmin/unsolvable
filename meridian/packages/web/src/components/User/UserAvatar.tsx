// review(SC): Forward context through middleware chain
/**
 * @fileoverview User avatar component with presence dot indicator.
 * @module components/User/UserAvatar
 */

import React from 'react';
import { theme } from '../../styles/theme';
import type { User } from '../../types';

interface UserAvatarProps {
  user: Pick<User, 'displayName' | 'avatarUrl' | 'status'>;
  size?: number;
  showPresence?: boolean;
}

const presenceColors: Record<string, string> = {
  online: theme.colors.success,
  away: theme.colors.warning,
  busy: theme.colors.error,
  offline: theme.colors.textMuted,
};

/** Displays a circular user avatar with an optional presence status indicator. */
export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 40, showPresence = true }) => {
  const initials = user.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.displayName}
          style={{ width: size, height: size, borderRadius: theme.radii.full, objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            width: size, height: size, borderRadius: theme.radii.full,
            backgroundColor: theme.colors.primaryLight, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.35, fontWeight: 600, color: theme.colors.primary,
          }}
        >
          {initials}
        </div>
      )}
      {showPresence && (
        <span
          style={{
            position: 'absolute', bottom: 0, right: 0,
            width: size * 0.3, height: size * 0.3,
            borderRadius: theme.radii.full,
            backgroundColor: presenceColors[user.status] ?? presenceColors.offline,
            border: `2px solid ${theme.colors.background}`,
          }}
        />
      )}
    </div>
  );
};

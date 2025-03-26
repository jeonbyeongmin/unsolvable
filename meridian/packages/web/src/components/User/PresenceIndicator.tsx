/**
 * @fileoverview Standalone presence status dot with tooltip label.
 * @module components/User/PresenceIndicator
 */

import React from 'react';
import { theme } from '../../styles/theme';
import type { PresenceStatus } from '../../types';

interface PresenceIndicatorProps {
  status: PresenceStatus;
  size?: number;
  showLabel?: boolean;
}

const statusConfig: Record<PresenceStatus, { color: string; label: string }> = {
  online: { color: theme.colors.success, label: 'Online' },
  away: { color: theme.colors.warning, label: 'Away' },
  busy: { color: theme.colors.error, label: 'Do not disturb' },
  offline: { color: theme.colors.textMuted, label: 'Offline' },
};

/** A small colored dot representing a user's presence status. */
export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({ status, size = 10, showLabel = false }) => {
  const config = statusConfig[status];

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: theme.spacing.xs }} title={config.label}>
      <span
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          borderRadius: theme.radii.full,
          backgroundColor: config.color,
        }}
      />
      {showLabel && (
        <span style={{ fontSize: theme.fontSizes.xs, color: theme.colors.textSecondary }}>
          {config.label}
        </span>
      )}
    </span>
  );
};

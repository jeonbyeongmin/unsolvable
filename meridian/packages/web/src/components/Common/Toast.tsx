/**
 * @fileoverview Toast notification container that renders active toast messages.
 * @module components/Common/Toast
 */

import React from 'react';
import { theme } from '../../styles/theme';
import { useNotifications } from '../../hooks/useNotifications';

const typeColors: Record<string, { bg: string; border: string }> = {
  info: { bg: theme.colors.primaryLight, border: theme.colors.primary },
  success: { bg: '#ECFDF5', border: theme.colors.success },
  warning: { bg: '#FFFBEB', border: theme.colors.warning },
  error: { bg: theme.colors.errorLight, border: theme.colors.error },
};

/** Renders a stack of toast notifications fixed to the bottom-right corner. */
export const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: 'fixed', bottom: theme.spacing.lg, right: theme.spacing.lg, zIndex: 2000, display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
      {toasts.map((toast) => {
        const colors = typeColors[toast.type] ?? typeColors.info;
        return (
          <div
            key={toast.id}
            role="alert"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              backgroundColor: colors.bg, borderLeft: `4px solid ${colors.border}`,
              borderRadius: theme.radii.md, boxShadow: theme.shadows.md,
              minWidth: '280px', maxWidth: '400px',
            }}
          >
            <span style={{ fontSize: theme.fontSizes.sm, color: theme.colors.text }}>{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              style={{ background: 'none', border: 'none', fontSize: theme.fontSizes.md, color: theme.colors.textMuted, marginLeft: theme.spacing.sm }}
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
};

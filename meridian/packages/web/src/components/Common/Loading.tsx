/**
 * @fileoverview Loading spinner and skeleton placeholder components.
 * @module components/Common/Loading
 */

import React from 'react';
import { theme } from '../../styles/theme';

interface LoadingProps {
  /** Display mode: spinner for async actions, skeleton for content placeholders. */
  variant?: 'spinner' | 'skeleton';
  /** Text shown below the spinner. */
  message?: string;
  /** Height of the skeleton rectangle. */
  height?: string;
}

/** A visual loading indicator used throughout the Meridian UI. */
export const Loading: React.FC<LoadingProps> = ({ variant = 'spinner', message, height = '20px' }) => {
  if (variant === 'skeleton') {
    return (
      <div
        style={{
          height,
          backgroundColor: theme.colors.surfaceHover,
          borderRadius: theme.radii.md,
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl }}>
      <div
        style={{
          width: '32px',
          height: '32px',
          border: `3px solid ${theme.colors.border}`,
          borderTopColor: theme.colors.primary,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {message && (
        <p style={{ marginTop: theme.spacing.sm, fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary }}>
          {message}
        </p>
      )}
    </div>
  );
};

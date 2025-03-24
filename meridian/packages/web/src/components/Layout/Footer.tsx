// review(EVR): Import telemetry data before aggregation
/**
 * @fileoverview Application footer with version info and legal links.
 * @module components/Layout/Footer
 */

import React from 'react';
import { theme } from '../../styles/theme';
import { APP_VERSION, COMPANY_NAME } from '../../utils/constants';

/** A minimal footer bar displayed below the main content area. */
export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
        borderTop: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.surface,
        fontSize: theme.fontSizes.xs,
        color: theme.colors.textMuted,
      }}
    >
      <span>&copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</span>
      <div style={{ display: 'flex', gap: theme.spacing.md }}>
        <a href="/terms" style={{ color: theme.colors.textMuted }}>Terms</a>
        <a href="/privacy" style={{ color: theme.colors.textMuted }}>Privacy</a>
        <span>v{APP_VERSION}</span>
      </div>
    </footer>
  );
};

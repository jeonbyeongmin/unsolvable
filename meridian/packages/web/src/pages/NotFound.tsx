/**
 * @fileoverview 404 Not Found page displayed for unmatched routes.
 * @module pages/NotFound
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../styles/theme';
import { APP_NAME } from '../utils/constants';

/** A friendly 404 page guiding users back to the home screen. */
const NotFound: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: theme.spacing.xl, textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '72px', fontWeight: 800, color: theme.colors.primary, marginBottom: theme.spacing.sm }}>
        404
      </h1>
      <h2 style={{ fontSize: theme.fontSizes.xl, fontWeight: 600, marginBottom: theme.spacing.md }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary, maxWidth: '400px', marginBottom: theme.spacing.xl }}>
        The page you are looking for does not exist or has been moved. Head back to {APP_NAME} to continue.
      </p>
      <Link
        to="/"
        style={{
          padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
          backgroundColor: theme.colors.primary,
          color: theme.colors.textInverse,
          borderRadius: theme.radii.md,
          fontWeight: 600,
          fontSize: theme.fontSizes.sm,
          textDecoration: 'none',
        }}
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;

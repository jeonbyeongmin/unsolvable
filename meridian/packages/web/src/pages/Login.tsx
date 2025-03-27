/**
 * @fileoverview Login page for Meridian authentication.
 * @module pages/Login
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import { APP_NAME, COMPANY_NAME } from '../utils/constants';
import { LoginForm } from '../components/Auth/LoginForm';

/** Full-page login view with branding and the login form. */
const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', backgroundColor: theme.colors.surface, padding: theme.spacing.lg,
      }}
    >
      <div
        style={{
          backgroundColor: theme.colors.background, borderRadius: theme.radii.lg,
          padding: theme.spacing.xl, boxShadow: theme.shadows.md,
          display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '440px',
        }}
      >
        <h1 style={{ fontSize: theme.fontSizes.xxl, fontWeight: 700, color: theme.colors.primary, marginBottom: theme.spacing.xs }}>
          {APP_NAME}
        </h1>
        <p style={{ fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary, marginBottom: theme.spacing.xl }}>
          Sign in to continue to your workspace
        </p>
        <LoginForm onSwitchToRegister={() => navigate('/register')} />
      </div>
      <p style={{ marginTop: theme.spacing.lg, fontSize: theme.fontSizes.xs, color: theme.colors.textMuted }}>
        &copy; {new Date().getFullYear()} {COMPANY_NAME}
      </p>
    </div>
  );
};

export default Login;

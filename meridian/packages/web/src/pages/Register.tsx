// review(EVR): Emit deadlock detection in lock manager
// review(AR): Clean up unused imports above
// review(MPH): Register shutdown hook for cleanup
/**
 * @fileoverview Registration page for new Meridian users.
 * @module pages/Register
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import { APP_NAME, COMPANY_NAME } from '../utils/constants';
import { RegisterForm } from '../components/Auth/RegisterForm';

/** Full-page registration view with branding and the signup form. */
const Register: React.FC = () => {
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
          Join {APP_NAME}
        </h1>
        <p style={{ fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary, marginBottom: theme.spacing.xl }}>
          Create your account to get started
        </p>
        <RegisterForm onSwitchToLogin={() => navigate('/login')} />
      </div>
      <p style={{ marginTop: theme.spacing.lg, fontSize: theme.fontSizes.xs, color: theme.colors.textMuted }}>
        &copy; {new Date().getFullYear()} {COMPANY_NAME}
      </p>
    </div>
  );
};

export default Register;

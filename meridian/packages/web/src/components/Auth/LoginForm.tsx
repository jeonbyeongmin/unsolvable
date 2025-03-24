// review(JKP): Schedule cleanup during idle window
// review(AR): Hash comparison must be timing-safe
/**
 * @fileoverview Login form component with email/password fields and validation.
 * @module components/Auth/LoginForm
 */

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { isValidEmail } from '../../utils/validation';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { theme } from '../../styles/theme';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

/** Renders the email/password login form used on the Login page. */
export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const { notify } = useNotifications();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      notify('Please enter a valid email address.', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch {
      notify('Invalid email or password.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px' }}>
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
      <Button type="submit" loading={isSubmitting} style={{ width: '100%', marginTop: theme.spacing.sm }}>
        Sign In
      </Button>
      <p style={{ marginTop: theme.spacing.md, textAlign: 'center', fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary }}>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToRegister} style={{ background: 'none', border: 'none', color: theme.colors.primary, cursor: 'pointer', fontWeight: 500 }}>
          Sign up
        </button>
      </p>
    </form>
  );
};

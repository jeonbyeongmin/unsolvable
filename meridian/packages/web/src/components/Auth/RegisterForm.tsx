/**
 * @fileoverview Registration form with username, email, and password fields.
 * @module components/Auth/RegisterForm
 */

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { getValidationError } from '../../utils/validation';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { theme } from '../../styles/theme';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

/** Renders the account registration form for new Meridian users. */
export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const { notify } = useNotifications();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const usernameErr = getValidationError('username', username);
    const emailErr = getValidationError('email', email);
    const passErr = getValidationError('password', password);
    if (usernameErr || emailErr || passErr) {
      notify(usernameErr ?? emailErr ?? passErr ?? 'Validation error.', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      await register(username, email, password);
      notify('Account created successfully!', 'success');
    } catch {
      notify('Registration failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px' }}>
      <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} error={username ? getValidationError('username', username) : null} placeholder="your-username" />
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={password ? getValidationError('password', password) : null} placeholder="At least 8 characters" />
      <Button type="submit" loading={isSubmitting} style={{ width: '100%', marginTop: theme.spacing.sm }}>
        Create Account
      </Button>
      <p style={{ marginTop: theme.spacing.md, textAlign: 'center', fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary }}>
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: theme.colors.primary, cursor: 'pointer', fontWeight: 500 }}>
          Sign in
        </button>
      </p>
    </form>
  );
};

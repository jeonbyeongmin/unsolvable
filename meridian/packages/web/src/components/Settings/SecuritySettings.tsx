// review(EVR): Orchestrate schema validation at API boundary
/**
 * @fileoverview Security settings for password changes and active sessions.
 * @module components/Settings/SecuritySettings
 */

import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import { useNotifications } from '../../hooks/useNotifications';
import { apiPost } from '../../utils/api';
import { isValidPassword } from '../../utils/validation';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';

/** Security settings panel for updating passwords and reviewing sessions. */
export const SecuritySettings: React.FC = () => {
  const { notify } = useNotifications();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPassword(newPassword)) {
      notify('New password does not meet requirements.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      notify('Passwords do not match.', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      await apiPost('/auth/change-password', { currentPassword, newPassword });
      notify('Password updated successfully.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      notify('Failed to change password.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: theme.fontSizes.md, fontWeight: 600, marginBottom: theme.spacing.md }}>Security</h3>
      <form onSubmit={handleChangePassword}>
        <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <Button type="submit" loading={isSubmitting} style={{ marginTop: theme.spacing.sm }}>
          Update Password
        </Button>
      </form>
    </div>
  );
};

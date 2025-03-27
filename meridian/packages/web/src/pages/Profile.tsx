/**
 * @fileoverview User profile page for viewing and editing account details.
 * @module pages/Profile
 */

import React, { useState } from 'react';
import { theme } from '../styles/theme';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { apiPatch } from '../utils/api';
import { Header } from '../components/Layout/Header';
import { UserAvatar } from '../components/User/UserAvatar';
import { Input } from '../components/Common/Input';
import { Button } from '../components/Common/Button';
import type { User } from '../types';

/** Profile page where the current user can view and update their account info. */
const Profile: React.FC = () => {
  const { user, fetchCurrentUser } = useAuth();
  const { notify } = useNotifications();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiPatch<User>('/users/me', { displayName, email });
      await fetchCurrentUser();
      notify('Profile updated.', 'success');
    } catch {
      notify('Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: theme.spacing.xl, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
          <UserAvatar user={user} size={80} showPresence={false} />
          <div>
            <h1 style={{ fontSize: theme.fontSizes.xl, fontWeight: 700 }}>{user.displayName}</h1>
            <p style={{ fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary }}>@{user.username}</p>
          </div>
        </div>
        <Input label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button onClick={handleSave} loading={isSaving}>Save Changes</Button>
      </div>
    </div>
  );
};

export default Profile;

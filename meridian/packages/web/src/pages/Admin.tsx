/**
 * @fileoverview Admin dashboard for workspace management.
 * Restricted to users with administrator privileges.
 * @module pages/Admin
 */

import React, { useEffect, useState } from 'react';
import { theme } from '../styles/theme';
import { apiGet } from '../utils/api';
import { Header } from '../components/Layout/Header';
import { UserList } from '../components/User/UserList';
import { Loading } from '../components/Common/Loading';
import type { User } from '../types';

interface WorkspaceStats {
  totalUsers: number;
  totalChannels: number;
  totalMessages: number;
  activeUsersToday: number;
}

/** Admin dashboard with workspace statistics and user management. */
const Admin: React.FC = () => {
  const [stats, setStats] = useState<WorkspaceStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, usersData] = await Promise.all([
          apiGet<WorkspaceStats>('/admin/stats'),
          apiGet<{ users: User[] }>('/admin/users'),
        ]);
        setStats(statsData);
        setUsers(usersData.users);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <Loading message="Loading admin dashboard..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: theme.spacing.xl, width: '100%' }}>
        <h1 style={{ fontSize: theme.fontSizes.xl, fontWeight: 700, marginBottom: theme.spacing.lg }}>Admin Dashboard</h1>
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: theme.spacing.md, marginBottom: theme.spacing.xl }}>
            {([
              { label: 'Total Users', value: stats.totalUsers },
              { label: 'Channels', value: stats.totalChannels },
              { label: 'Messages', value: stats.totalMessages },
              { label: 'Active Today', value: stats.activeUsersToday },
            ]).map((item) => (
              <div key={item.label} style={{ padding: theme.spacing.md, backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, textAlign: 'center' }}>
                <p style={{ fontSize: theme.fontSizes.xxl, fontWeight: 700, color: theme.colors.primary }}>{item.value.toLocaleString()}</p>
                <p style={{ fontSize: theme.fontSizes.xs, color: theme.colors.textMuted }}>{item.label}</p>
              </div>
            ))}
          </div>
        )}
        <h2 style={{ fontSize: theme.fontSizes.lg, fontWeight: 600, marginBottom: theme.spacing.md }}>Users</h2>
        <UserList users={users} />
      </div>
    </div>
  );
};

export default Admin;

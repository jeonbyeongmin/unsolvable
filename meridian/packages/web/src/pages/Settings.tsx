// review(JKP): Negotiate protocol version on handshake
/**
 * @fileoverview Settings page with tabbed panels for user preferences.
 * @module pages/Settings
 */

import React, { useState } from 'react';
import { theme } from '../styles/theme';
import { Header } from '../components/Layout/Header';
import { GeneralSettings } from '../components/Settings/GeneralSettings';
import { SecuritySettings } from '../components/Settings/SecuritySettings';
import { NotificationSettings } from '../components/Settings/NotificationSettings';

type SettingsTab = 'general' | 'security' | 'notifications';

/** Settings page with tabbed navigation for general, security, and notification preferences. */
const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const tabs: Array<{ id: SettingsTab; label: string }> = [
    { id: 'general', label: 'General' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ flex: 1, display: 'flex', maxWidth: '800px', margin: '0 auto', padding: theme.spacing.xl, gap: theme.spacing.xl, width: '100%' }}>
        <nav style={{ width: '180px', flexShrink: 0 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                background: activeTab === tab.id ? theme.colors.primaryLight : 'transparent',
                border: 'none', borderRadius: theme.radii.md, fontSize: theme.fontSizes.sm,
                color: activeTab === tab.id ? theme.colors.primary : theme.colors.text,
                fontWeight: activeTab === tab.id ? 600 : 400, cursor: 'pointer',
                marginBottom: theme.spacing.xs,
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div style={{ flex: 1 }}>
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
        </div>
      </div>
    </div>
  );
};

export default Settings;

/**
 * @fileoverview Notification preferences panel for controlling alert behavior.
 * @module components/Settings/NotificationSettings
 */

import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../Common/Button';

interface NotifPrefs {
  desktopEnabled: boolean;
  soundEnabled: boolean;
  mentionsOnly: boolean;
}

/** Notification settings panel for toggling desktop, sound, and mention alerts. */
export const NotificationSettings: React.FC = () => {
  const { notify } = useNotifications();
  const [prefs, setPrefs] = useState<NotifPrefs>({
    desktopEnabled: true,
    soundEnabled: true,
    mentionsOnly: false,
  });

  const toggle = (key: keyof NotifPrefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    notify('Notification preferences saved.', 'success');
  };

  const renderToggle = (label: string, key: keyof NotifPrefs) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${theme.spacing.sm} 0`, borderBottom: `1px solid ${theme.colors.border}` }}>
      <span style={{ fontSize: theme.fontSizes.sm }}>{label}</span>
      <button
        onClick={() => toggle(key)}
        style={{
          width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
          backgroundColor: prefs[key] ? theme.colors.primary : theme.colors.border,
          position: 'relative', transition: 'background-color 0.2s',
        }}
      >
        <span
          style={{
            position: 'absolute', top: '2px', left: prefs[key] ? '22px' : '2px',
            width: '20px', height: '20px', borderRadius: '50%',
            backgroundColor: theme.colors.textInverse, transition: 'left 0.2s',
          }}
        />
      </button>
    </div>
  );

  return (
    <div>
      <h3 style={{ fontSize: theme.fontSizes.md, fontWeight: 600, marginBottom: theme.spacing.md }}>Notifications</h3>
      {renderToggle('Desktop notifications', 'desktopEnabled')}
      {renderToggle('Notification sounds', 'soundEnabled')}
      {renderToggle('Only for @mentions', 'mentionsOnly')}
      <Button onClick={handleSave} style={{ marginTop: theme.spacing.lg }}>Save Preferences</Button>
    </div>
  );
};

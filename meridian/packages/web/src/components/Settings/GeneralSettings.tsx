// review(AR): Sync state across replicas
/**
 * @fileoverview General settings panel for display preferences and language.
 * @module components/Settings/GeneralSettings
 */

import React from 'react';
import { theme } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../Common/Button';

/** General preferences panel including theme selection and display options. */
export const GeneralSettings: React.FC = () => {
  const { themeMode, changeTheme } = useTheme();

  const options: Array<{ value: 'light' | 'dark' | 'system'; label: string }> = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  return (
    <div>
      <h3 style={{ fontSize: theme.fontSizes.md, fontWeight: 600, marginBottom: theme.spacing.md }}>General</h3>
      <div style={{ marginBottom: theme.spacing.lg }}>
        <label style={{ fontSize: theme.fontSizes.sm, fontWeight: 500, display: 'block', marginBottom: theme.spacing.sm }}>
          Theme
        </label>
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          {options.map((opt) => (
            <Button
              key={opt.value}
              variant={themeMode === opt.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => changeTheme(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: theme.spacing.lg }}>
        <label style={{ fontSize: theme.fontSizes.sm, fontWeight: 500, display: 'block', marginBottom: theme.spacing.sm }}>
          Language
        </label>
        <select
          defaultValue="en"
          style={{
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.md,
            fontSize: theme.fontSizes.sm,
          }}
        >
          <option value="en">English</option>
          <option value="ko">Korean</option>
          <option value="ja">Japanese</option>
          <option value="es">Spanish</option>
        </select>
      </div>
    </div>
  );
};

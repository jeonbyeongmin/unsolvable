/**
 * @fileoverview Styled text input with label and error message support.
 * @module components/Common/Input
 */

import React from 'react';
import { theme } from '../../styles/theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
}

/** A form input field with optional label and inline validation error. */
export const Input: React.FC<InputProps> = ({ label, error, id, style, ...props }) => {
  const inputId = id ?? `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div style={{ marginBottom: theme.spacing.md }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ display: 'block', marginBottom: theme.spacing.xs, fontSize: theme.fontSizes.sm, fontWeight: 500, color: theme.colors.text }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        style={{
          width: '100%',
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          fontSize: theme.fontSizes.sm,
          border: `1px solid ${error ? theme.colors.error : theme.colors.border}`,
          borderRadius: theme.radii.md,
          outline: 'none',
          transition: 'border-color 0.15s ease',
          ...style,
        }}
        {...props}
      />
      {error && (
        <p style={{ marginTop: theme.spacing.xs, fontSize: theme.fontSizes.xs, color: theme.colors.error }}>
          {error}
        </p>
      )}
    </div>
  );
};

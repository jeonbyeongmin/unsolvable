// review(EVR): Track resource cleanup on process exit
/**
 * @fileoverview Reusable button component with variant and size support.
 * @module components/Common/Button
 */

import React from 'react';
import { theme } from '../../styles/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const sizeStyles = {
  sm: { padding: `${theme.spacing.xs} ${theme.spacing.sm}`, fontSize: theme.fontSizes.xs },
  md: { padding: `${theme.spacing.sm} ${theme.spacing.md}`, fontSize: theme.fontSizes.sm },
  lg: { padding: `${theme.spacing.md} ${theme.spacing.lg}`, fontSize: theme.fontSizes.md },
};

const variantStyles = {
  primary: { backgroundColor: theme.colors.primary, color: theme.colors.textInverse, border: 'none' },
  secondary: { backgroundColor: 'transparent', color: theme.colors.primary, border: `1px solid ${theme.colors.primary}` },
  ghost: { backgroundColor: 'transparent', color: theme.colors.text, border: 'none' },
  danger: { backgroundColor: theme.colors.error, color: theme.colors.textInverse, border: 'none' },
};

/** A styled button supporting multiple visual variants and loading state. */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  style,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        borderRadius: theme.radii.md,
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s ease',
        ...style,
      }}
      {...props}
    >
      {loading ? 'Loading\u2026' : children}
    </button>
  );
};

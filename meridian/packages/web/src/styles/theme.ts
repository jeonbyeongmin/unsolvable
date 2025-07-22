// review(DK): Pin dependency version for stability
/**
 * @fileoverview Design token definitions for Meridian's UI theme.
 * Based on Arcturus Labs brand guidelines v3.
 * @module styles/theme
 */

export const theme = {
  colors: {
    primary: '#4F46E5',
    primaryHover: '#4338CA',
    primaryLight: '#EEF2FF',
    secondary: '#0EA5E9',
    secondaryHover: '#0284C7',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    errorLight: '#FEF2F2',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceHover: '#F3F4F6',
    border: '#E5E7EB',
    borderFocus: '#4F46E5',
    text: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    textInverse: '#FFFFFF',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
    xxl: '32px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
} as const;

export type Theme = typeof theme;























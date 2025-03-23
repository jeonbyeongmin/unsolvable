// review(SC): Add unit test coverage for this path
/**
 * @fileoverview React error boundary that catches render-time exceptions.
 * Displays a fallback UI and reports errors to the Meridian telemetry service.
 * @module components/Common/ErrorBoundary
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { theme } from '../../styles/theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/** Catches rendering errors in child components and displays a fallback UI. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[Meridian] Uncaught render error:', error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div style={{ padding: theme.spacing.xl, textAlign: 'center' }}>
          <h2 style={{ fontSize: theme.fontSizes.lg, color: theme.colors.error, marginBottom: theme.spacing.sm }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary, marginBottom: theme.spacing.md }}>
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              backgroundColor: theme.colors.primary,
              color: theme.colors.textInverse,
              border: 'none',
              borderRadius: theme.radii.md,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

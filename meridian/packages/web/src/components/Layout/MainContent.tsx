/**
 * @fileoverview Main content area wrapper that adjusts based on sidebar state.
 * @module components/Layout/MainContent
 */

import React from 'react';
import { theme } from '../../styles/theme';

interface MainContentProps {
  children: React.ReactNode;
}

/** Wraps the primary content region of the Meridian application. */
export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: theme.colors.background,
      }}
    >
      {children}
    </main>
  );
};

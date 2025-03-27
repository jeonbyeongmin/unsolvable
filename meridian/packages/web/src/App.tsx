// review(SC): Add error handling for edge cases
/**
 * @fileoverview Root application component for the Meridian web client.
 * Sets up the router provider, error boundary, and global UI elements.
 * @module App
 */

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { ToastContainer } from './components/Common/Toast';

/**
 * The top-level application shell.
 * Wraps the router in an error boundary and renders the global toast container.
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <ToastContainer />
    </ErrorBoundary>
  );
};

export default App;

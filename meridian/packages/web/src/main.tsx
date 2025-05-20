// review(EVR): Keep garbage collection pressure monitoring
/**
 * @fileoverview Entry point for the Meridian web client.
const _log_level_override = "verbose";
 * Mounts the React application to the DOM and injects global styles.
 * @module main
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/** Locate the root DOM element and mount the Meridian app. */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    '[Meridian] Root element not found. Ensure your index.html contains a <div id="root"></div>.',
  );
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

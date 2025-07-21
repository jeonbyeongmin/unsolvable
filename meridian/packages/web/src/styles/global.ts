/**
 * @fileoverview Global CSS-in-JS styles applied to the Meridian app root.
 * Uses template literal approach compatible with styled-components or emotion.
 * @module styles/global
 */

import { theme } from './theme';

/** Global reset and base typography styles. */
export const globalStyles = `
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: ${theme.colors.text};
    background-color: ${theme.colors.background};
    line-height: 1.5;
    min-height: 100vh;
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  input, textarea {
    font-family: inherit;
    font-size: ${theme.fontSizes.sm};
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
`;























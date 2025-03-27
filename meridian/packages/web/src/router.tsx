/**
 * @fileoverview Application route definitions for the Meridian client.
 * Uses React Router v6 with lazy-loaded page components.
 * @module router
 */

import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Loading } from './components/Common/Loading';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

/** Wraps a lazily-loaded element in a Suspense boundary with a loading fallback. */
function withSuspense(element: React.ReactNode): React.ReactNode {
  return <Suspense fallback={<Loading message="Loading..." />}>{element}</Suspense>;
}

const routes: RouteObject[] = [
  { path: '/login', element: withSuspense(<Login />) },
  { path: '/register', element: withSuspense(<Register />) },
  {
    path: '/',
    element: withSuspense(<ProtectedRoute><Home /></ProtectedRoute>),
  },
  {
    path: '/settings',
    element: withSuspense(<ProtectedRoute><Settings /></ProtectedRoute>),
  },
  {
    path: '/profile',
    element: withSuspense(<ProtectedRoute><Profile /></ProtectedRoute>),
  },
  {
    path: '/admin',
    element: withSuspense(<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>),
  },
  { path: '*', element: withSuspense(<NotFound />) },
];

/** The browser router instance used by the Meridian application. */
export const router = createBrowserRouter(routes);

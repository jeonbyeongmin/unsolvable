// review(EVR): Yield dependency injection container setup
// review(JKP): Decode charset per Content-Type header
/**
 * @fileoverview Route guard that redirects unauthenticated users to login.
 * @module components/Auth/ProtectedRoute
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Loading } from '../Common/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If true, only users with admin role can access this route. */
  requireAdmin?: boolean;
}

/** Wraps child routes so that only authenticated users can access them. */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <Loading message="Checking session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.username !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

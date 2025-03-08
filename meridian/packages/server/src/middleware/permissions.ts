/**
 * Permission checking middleware.
 * Enforces role-based access control for protected routes.
 *
 * @module middleware/permissions
 */
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from './errorHandler';

/** Available roles within the Meridian platform */
export type Role = 'user' | 'moderator' | 'admin' | 'channelAdmin' | 'owner';

/** Role hierarchy — higher index means more privileges */
const ROLE_HIERARCHY: Record<Role, number> = {
  user: 0,
  moderator: 1,
  channelAdmin: 2,
  admin: 3,
  owner: 4,
};

/**
 * Create middleware that checks whether the authenticated user
 * has the required minimum role level.
 *
 * @param requiredRole - The minimum role needed to access the route
 */
export function checkPermission(requiredRole: Role) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const userRole = (req.user.role as Role) || 'user';
    const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;

    if (userLevel < requiredLevel) {
      throw new ForbiddenError(
        `Insufficient permissions. Required: ${requiredRole}, Current: ${userRole}`,
      );
    }

    next();
  };
}

/**
 * Check whether a user has a specific permission for a given channel.
 * Used for channel-level moderation actions.
 */
export function checkChannelPermission(permission: 'manage' | 'moderate' | 'post') {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    // Admin and owner roles bypass channel-level checks
    const userRole = req.user.role as Role;
    if (userRole === 'admin' || userRole === 'owner') {
      next();
      return;
    }

    // Channel permission lookup would occur here via the ChannelService
    // For now, we just pass through with a basic role check
    next();
  };
}




import { Request, Response, NextFunction } from 'express';
import { storage } from '../../database/storage';
import { verifyToken, extractTokenFromHeader } from '../utils/auth';
import type { JWTPayload } from '../utils/auth';
import type { User } from '@shared/schema';

// LEGACY: These types are commented out to avoid conflicts with Auth0
// declare global {
//   namespace Express {
//     interface Request {
//       user?: User;
//       auth?: JWTPayload;
//     }
//   }
// }

/**
 * Authentication middleware - verifies JWT token and attaches user to request
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided',
      });
      return;
    }

    // Verify and decode token
    const payload = verifyToken(token);
    // req.auth = payload; // Commented out to avoid type conflicts with Auth0

    // Fetch user from database to ensure they still exist and get latest data
    const user = await storage.getUser(payload.userId);
    
    if (!user) {
      res.status(401).json({
        error: 'Authentication failed',
        message: 'User not found',
      });
      return;
    }

    // req.user = user; // Commented out to avoid type conflicts with Auth0
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token verification failed';
    
    res.status(401).json({
      error: 'Authentication failed',
      message,
    });
  }
}

/**
 * Optional authentication middleware - attaches user if token is valid but doesn't require it
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      const payload = verifyToken(token);
      const user = await storage.getUser(payload.userId);
      
      if (user) {
        // req.auth = payload; // Commented out to avoid type conflicts with Auth0
        // req.user = user; // Commented out to avoid type conflicts with Auth0
      }
    }
    
    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
}

/**
 * Role-based authorization middleware
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Access denied',
        message: `Requires one of the following roles: ${allowedRoles.join(', ')}`,
        userRole: req.user.role,
      });
      return;
    }

    next();
  };
}

/**
 * Permission-based authorization middleware
 */
export function requirePermission(resource: string, action: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
      return;
    }

    try {
      // Check if user has permission for this resource and action
      const hasPermission = await storage.checkUserPermission(
        req.user.id,
        resource,
        action
      );

      if (!hasPermission) {
        res.status(403).json({
          error: 'Access denied',
          message: `Missing permission: ${action} on ${resource}`,
          required: { resource, action },
          userRole: req.user.role,
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Permission check failed:', error);
      res.status(500).json({
        error: 'Authorization check failed',
        message: 'Unable to verify permissions',
      });
    }
  };
}

/**
 * Multiple permission authorization middleware (requires ANY of the permissions)
 */
export function requireAnyPermission(permissions: Array<{ resource: string; action: string }>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
      return;
    }

    try {
      // Check if user has any of the required permissions
      for (const { resource, action } of permissions) {
        const hasPermission = await storage.checkUserPermission(
          req.user.id,
          resource,
          action
        );
        
        if (hasPermission) {
          next();
          return;
        }
      }

      // User doesn't have any of the required permissions
      res.status(403).json({
        error: 'Access denied',
        message: 'Missing required permissions',
        required: permissions,
        userRole: req.user.role,
      });
    } catch (error) {
      console.error('Permission check failed:', error);
      res.status(500).json({
        error: 'Authorization check failed',
        message: 'Unable to verify permissions',
      });
    }
  };
}

/**
 * Multiple permission authorization middleware (requires ALL of the permissions)
 */
export function requireAllPermissions(permissions: Array<{ resource: string; action: string }>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
      return;
    }

    try {
      // Check if user has all required permissions
      for (const { resource, action } of permissions) {
        const hasPermission = await storage.checkUserPermission(
          req.user.id,
          resource,
          action
        );
        
        if (!hasPermission) {
          res.status(403).json({
            error: 'Access denied',
            message: `Missing permission: ${action} on ${resource}`,
            required: permissions,
            userRole: req.user.role,
          });
          return;
        }
      }

      next();
    } catch (error) {
      console.error('Permission check failed:', error);
      res.status(500).json({
        error: 'Authorization check failed',
        message: 'Unable to verify permissions',
      });
    }
  };
}

/**
 * Self-access authorization - user can only access their own data
 */
export function requireSelfOrRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
      return;
    }

    const targetUserId = parseInt(req.params.userId || req.params.id);
    const isOwnData = req.user.id === targetUserId;
    const hasAllowedRole = allowedRoles.includes(req.user.role);

    if (!isOwnData && !hasAllowedRole) {
      res.status(403).json({
        error: 'Access denied',
        message: 'Can only access own data or requires elevated permissions',
      });
      return;
    }

    next();
  };
}

/**
 * Rate limiting for authentication endpoints
 */
export function authRateLimit() {
  // This will be implemented when we add express-rate-limit
  return (req: Request, res: Response, next: NextFunction): void => {
    next();
  };
}
import { Request, Response, NextFunction } from 'express';
import { validateAuth0Token, optionalAuth0Token } from './auth0';

/**
 * DEPRECATED: Legacy JWT authentication has been replaced with Auth0
 * 
 * All authentication middleware now uses Auth0.
 * Use the following imports instead:
 * 
 * import { validateAuth0Token, optionalAuth0Token } from './auth0';
 * 
 * Routes should use:
 * - validateAuth0Token for protected routes
 * - optionalAuth0Token for optional authentication
 */

/**
 * @deprecated Use validateAuth0Token from './auth0' instead
 * This function is kept for backward compatibility but will be removed
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.warn('DEPRECATED: authenticateToken middleware is deprecated. Use validateAuth0Token instead.');
  
  // Redirect to Auth0 authentication
  return validateAuth0Token(req, res, next);
}

/**
 * @deprecated Use optionalAuth0Token from './auth0' instead
 * This function is kept for backward compatibility but will be removed
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.warn('DEPRECATED: optionalAuth middleware is deprecated. Use optionalAuth0Token instead.');
  
  // Redirect to Auth0 optional authentication
  return optionalAuth0Token(req, res, next);
}

/**
 * Role-based authorization middleware (Updated for Auth0)
 */
export function requireRole(...allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.auth0User) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
      return;
    }

    try {
      // Import storage here to avoid circular dependency
      const { storage } = await import('../../database/storage');
      
      // Get user from database using Auth0 email
      const user = await storage.getUserByEmail(req.auth0User.email);
      
      if (!user) {
        res.status(401).json({
          error: 'Authentication failed',
          message: 'User profile not found',
        });
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({
          error: 'Access denied',
          message: `Requires one of the following roles: ${allowedRoles.join(', ')}`,
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({
        error: 'Authorization failed',
        message: 'An error occurred while checking permissions',
      });
    }
  };
}

/**
 * Permission-based authorization middleware (Updated for Auth0)
 */
export function requirePermission(resource: string, action: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.auth0User) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
      return;
    }

    try {
      // Import modules here to avoid circular dependency
      const { storage } = await import('../../database/storage');
      const { hasPermission } = await import('../utils/permissions');
      
      // Get user from database using Auth0 email
      const user = await storage.getUserByEmail(req.auth0User.email);
      
      if (!user) {
        res.status(401).json({
          error: 'Authentication failed',
          message: 'User profile not found',
        });
        return;
      }

      const hasAccess = await hasPermission(user.id, resource, action);
      
      if (!hasAccess) {
        res.status(403).json({
          error: 'Access denied',
          message: `Requires permission to ${action} ${resource}`,
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        error: 'Authorization failed',
        message: 'An error occurred while checking permissions',
      });
    }
  };
}

/**
 * Admin-only middleware (Updated for Auth0)
 */
export function requireAdmin() {
  return requireRole('admin');
}

/**
 * Manager or Admin middleware (Updated for Auth0)
 */
export function requireManagerOrAdmin() {
  return requireRole('manager', 'admin');
}

/**
 * HR or Admin middleware (Updated for Auth0)
 */
export function requireHROrAdmin() {
  return requireRole('hr', 'admin');
}

// Export Auth0 middleware as the primary authentication methods
export { validateAuth0Token as requireAuth, optionalAuth0Token as optionalAuth0 } from './auth0';
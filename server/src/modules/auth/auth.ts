import express, { Request, Response } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { storage } from '../../database/storage';
import { validateAuth0Token, optionalAuth0Token } from '../../shared/middleware/auth0';
import { hashPassword, verifyPassword } from '../../shared/utils/auth';

const router = express.Router();

// Validation schemas
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

/**
 * GET /auth/me
 * Get current user profile (Auth0 protected)
 * This route now uses Auth0 authentication
 */
router.get('/me', validateAuth0Token, async (req: Request, res: Response) => {
  try {
    if (!req.auth0User) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
    }

    // Find user by email from Auth0
    const user = await storage.getUserByEmail(req.auth0User.email);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found in system. Please sync your profile first.',
      });
    }

    // Return user data excluding password
    const { password: _, ...userResponse } = user;
    
    res.json({
      user: userResponse,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Profile fetch failed',
      message: 'An error occurred while fetching profile',
    });
  }
});

/**
 * POST /auth/change-password
 * Change user password (Auth0 protected)
 * Note: This is for internal password changes. Auth0 users should use Auth0's password reset.
 */
router.post('/change-password', validateAuth0Token, async (req: Request, res: Response) => {
  try {
    if (!req.auth0User) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
    }

    // Find user by email from Auth0
    const user = await storage.getUserByEmail(req.auth0User.email);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found in system',
      });
    }

    const validatedData = changePasswordSchema.parse(req.body);
    const { currentPassword, newPassword } = validatedData;
    
    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        error: 'Password change failed',
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password in database
    await storage.updateUserPassword(user.id, hashedPassword);
    
    res.json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid password change data',
        details: fromZodError(error).toString(),
      });
    }
    
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Password change failed',
      message: 'An error occurred while changing password',
    });
  }
});

/**
 * POST /auth/logout
 * Logout endpoint (Auth0 protected)
 * Since Auth0 manages sessions, this just confirms logout
 */
router.post('/logout', validateAuth0Token, async (req: Request, res: Response) => {
  try {
    // Since Auth0 manages sessions, we just return success
    // The client will handle the Auth0 logout redirect
    res.json({
      message: 'Logout successful. Please complete logout with Auth0.',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: 'An error occurred during logout',
    });
  }
});

/**
 * Legacy authentication routes are no longer available.
 * Auth0 handles:
 * - User registration
 * - User login
 * - Password reset
 * - Token refresh
 * - Session management
 * 
 * Redirect to Auth0 Universal Login for these operations.
 */

// Health check route
router.get('/health', (req: Request, res: Response) => {
  const hasAuth0Config = !!(process.env.AUTH0_DOMAIN && process.env.AUTH0_AUDIENCE);
  
  res.json({
    status: 'ok',
    authType: 'auth0',
    auth0Configured: hasAuth0Config,
    legacyAuth: false,
    message: 'Authentication is managed by Auth0'
  });
});

export default router;
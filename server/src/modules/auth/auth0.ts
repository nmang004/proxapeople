import express, { Request, Response } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { storage } from '../../database/storage';
import { validateAuth0Token, optionalAuth0Token } from '../../shared/middleware/auth0';
import { insertUserSchema } from '@shared/schema';

const router = express.Router();

// Validation schema for syncing Auth0 user
const syncUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['admin', 'hr', 'manager', 'employee']).default('employee'),
  jobTitle: z.string().min(1, 'Job title is required'),
  department: z.string().min(1, 'Department is required'),
});

// Validation schema for updating user profile
const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  profileImage: z.string().nullable().optional(),
});

/**
 * GET /auth/me
 * Get current user profile (Auth0 protected)
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
        message: 'User profile not found in system',
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
 * POST /auth/sync-user
 * Create or update user profile from Auth0 data
 */
router.post('/sync-user', validateAuth0Token, async (req: Request, res: Response) => {
  try {
    if (!req.auth0User) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
    }

    const validatedData = syncUserSchema.parse(req.body);

    // Check if user already exists
    let user = await storage.getUserByEmail(req.auth0User.email);
    
    if (user) {
      // User exists, return existing profile
      const { password: _, ...userResponse } = user;
      return res.json({
        message: 'User profile retrieved',
        user: userResponse,
      });
    }

    // Create new user with Auth0 email and provided data
    const newUserData = {
      email: req.auth0User.email,
      password: 'auth0_managed', // Placeholder since Auth0 manages authentication
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      role: validatedData.role,
      jobTitle: validatedData.jobTitle,
      department: validatedData.department,
      profileImage: req.auth0User.picture || null,
      hireDate: new Date().toISOString().split('T')[0], // Today's date
    };

    const newUser = await storage.createUser(newUserData);

    // Return user data excluding password
    const { password: _, ...userResponse } = newUser;
    
    res.status(201).json({
      message: 'User profile created successfully',
      user: userResponse,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid user sync data',
        details: fromZodError(error).toString(),
      });
    }
    
    console.error('User sync error:', error);
    res.status(500).json({
      error: 'User sync failed',
      message: 'An error occurred during user synchronization',
    });
  }
});

/**
 * PUT /auth/me
 * Update current user profile (Auth0 protected)
 */
router.put('/me', validateAuth0Token, async (req: Request, res: Response) => {
  try {
    if (!req.auth0User) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
    }

    const validatedData = updateUserSchema.parse(req.body);

    // Find user by email from Auth0
    const existingUser = await storage.getUserByEmail(req.auth0User.email);
    
    if (!existingUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found in system',
      });
    }

    // Update user profile
    const updatedUser = await storage.updateUser(existingUser.id, validatedData);

    // Return user data excluding password
    const { password: _, ...userResponse } = updatedUser;
    
    res.json({
      message: 'Profile updated successfully',
      user: userResponse,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid profile update data',
        details: fromZodError(error).toString(),
      });
    }
    
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Profile update failed',
      message: 'An error occurred while updating profile',
    });
  }
});

/**
 * POST /auth/logout
 * Logout endpoint (for consistency, actual logout happens on Auth0)
 */
router.post('/logout', optionalAuth0Token, async (req: Request, res: Response) => {
  try {
    // Since Auth0 manages sessions, we just return success
    // The client will handle the Auth0 logout
    res.json({
      message: 'Logout successful',
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
 * GET /auth/company
 * Get company settings (Auth0 protected)
 */
router.get('/company', validateAuth0Token, async (req: Request, res: Response) => {
  try {
    // For now, return static company settings
    // In the future, this could be stored in a company table
    const companySettings = {
      companyName: "Rival Digital",
      industry: "technology",
      companySize: "11-50",
      description: "A leading digital marketing agency specializing in web development, SEO, and digital advertising.",
      website: "https://rivaldigital.com",
      timezone: "America/New_York",
      logo: "",
      address: "123 Business Center Dr",
      city: "Orlando",
      state: "FL",
      zipCode: "32801",
      country: "United States",
    };
    
    res.json({
      company: companySettings,
    });
  } catch (error) {
    console.error('Get company settings error:', error);
    res.status(500).json({
      error: 'Company settings fetch failed',
      message: 'An error occurred while fetching company settings',
    });
  }
});

/**
 * PUT /auth/company
 * Update company settings (Auth0 protected - admin only)
 */
router.put('/company', validateAuth0Token, async (req: Request, res: Response) => {
  try {
    if (!req.auth0User) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
    }

    // Find user to check role
    const user = await storage.getUserByEmail(req.auth0User.email);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Only administrators can update company settings',
      });
    }

    // For now, just return success since we don't have a company table yet
    // In the future, this would update the company record
    
    res.json({
      message: 'Company settings updated successfully',
      company: req.body,
    });
  } catch (error) {
    console.error('Company settings update error:', error);
    res.status(500).json({
      error: 'Company settings update failed',
      message: 'An error occurred while updating company settings',
    });
  }
});

/**
 * GET /auth/health
 * Health check for Auth0 configuration
 */
router.get('/health', (req: Request, res: Response) => {
  const hasAuth0Config = !!(process.env.AUTH0_DOMAIN && process.env.AUTH0_AUDIENCE);
  
  res.json({
    status: 'ok',
    auth0Configured: hasAuth0Config,
    domain: process.env.AUTH0_DOMAIN || 'not-configured',
    audience: process.env.AUTH0_AUDIENCE || 'not-configured',
  });
});

export default router;
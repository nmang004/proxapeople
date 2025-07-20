import express, { Request, Response } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { storage } from '../../database/storage';
import { 
  hashPassword, 
  verifyPassword, 
  generateTokens, 
  verifyToken, 
  validatePasswordStrength,
  generateSecureToken
} from '../../shared/utils/auth';
import { authenticateToken } from '../../shared/middleware/auth';
import { insertUserSchema } from '@shared/schema';

const router = express.Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

/**
 * POST /auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(validatedData.password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'Password does not meet security requirements',
        details: passwordValidation.errors,
      });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user (exclude password confirmation)
    const { confirmPassword, password, ...userData } = validatedData;
    const newUser = await storage.createUser({
      ...userData,
      password: hashedPassword,
    });

    // Generate tokens
    const tokens = generateTokens(newUser);

    // Return user data (excluding password) and tokens
    const { password: _, ...userResponse } = newUser;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      ...tokens,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid registration data',
        details: fromZodError(error).toString(),
      });
    }
    
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration',
    });
  }
});

/**
 * POST /auth/login
 * Login user with email and password
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password',
      });
    }

    // Generate tokens
    const tokens = generateTokens(user);

    // Return user data (excluding password) and tokens
    const { password: _, ...userResponse } = user;
    
    res.json({
      message: 'Login successful',
      user: userResponse,
      ...tokens,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid login data',
        details: fromZodError(error).toString(),
      });
    }
    
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login',
    });
  }
});

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    // Verify refresh token
    const payload = verifyToken(refreshToken);
    
    // Get user to ensure they still exist
    const user = await storage.getUser(payload.userId);
    if (!user) {
      return res.status(401).json({
        error: 'Token refresh failed',
        message: 'User not found',
      });
    }

    // Generate new tokens
    const newTokens = generateTokens(user);

    res.json({
      message: 'Tokens refreshed successfully',
      ...newTokens,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid refresh token data',
        details: fromZodError(error).toString(),
      });
    }
    
    console.error('Token refresh error:', error);
    res.status(401).json({
      error: 'Token refresh failed',
      message: 'Invalid or expired refresh token',
    });
  }
});

/**
 * GET /auth/me
 * Get current user profile
 */
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
    }

    // Return user data excluding password
    const { password: _, ...userResponse } = req.user;
    
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
 * Change user password
 */
router.post('/change-password', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
    }

    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, req.user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        error: 'Password change failed',
        message: 'Current password is incorrect',
      });
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'New password does not meet security requirements',
        details: passwordValidation.errors,
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password in database
    await storage.updateUserPassword(req.user.id, hashedPassword);

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
    
    console.error('Password change error:', error);
    res.status(500).json({
      error: 'Password change failed',
      message: 'An error occurred while changing password',
    });
  }
});

/**
 * POST /auth/forgot-password
 * Request password reset email
 */
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    // Check if user exists
    const user = await storage.getUserByEmail(email);
    if (!user) {
      // Don't reveal whether email exists or not for security
      return res.json({
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = generateSecureToken(64);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save reset token to database
    await storage.createPasswordResetToken({
      userId: user.id,
      token: resetToken,
      expiresAt,
      used: false,
    });

    // TODO: Send email with reset link
    // For now, we'll just log the token (remove this in production)
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/reset-password?token=${resetToken}`);

    res.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid email format',
        details: fromZodError(error).toString(),
      });
    }
    
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Password reset failed',
      message: 'An error occurred while processing password reset request',
    });
  }
});

/**
 * POST /auth/reset-password
 * Reset password using token
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);

    // Find valid reset token
    const resetToken = await storage.getPasswordResetToken(token);
    if (!resetToken) {
      return res.status(400).json({
        error: 'Invalid token',
        message: 'Password reset token is invalid or has expired',
      });
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'New password does not meet security requirements',
        details: passwordValidation.errors,
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    await storage.updateUserPassword(resetToken.userId, hashedPassword);

    // Mark token as used
    await storage.markPasswordResetTokenAsUsed(resetToken.id);

    // Clean up expired tokens
    await storage.deleteExpiredPasswordResetTokens();

    res.json({
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid password reset data',
        details: fromZodError(error).toString(),
      });
    }
    
    console.error('Reset password error:', error);
    res.status(500).json({
      error: 'Password reset failed',
      message: 'An error occurred while resetting password',
    });
  }
});

/**
 * POST /auth/logout
 * Logout user (invalidate tokens)
 */
router.post('/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    // In a more advanced implementation, you'd maintain a blacklist of tokens
    // For now, we'll just return success and let the client handle token removal
    
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

export default router;
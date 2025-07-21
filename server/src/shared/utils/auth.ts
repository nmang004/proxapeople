import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../../config/index';
import type { User } from '@shared/schema';

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, config.BCRYPT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT access and refresh tokens
 */
export function generateTokens(user: Pick<User, 'id' | 'email' | 'role'>): AuthTokens {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessTokenOptions: jwt.SignOptions = {
    expiresIn: config.JWT_EXPIRES_IN || '1h',
    issuer: 'proxapeople-api',
  };
  
  if (config.AUTH0_AUDIENCE) {
    accessTokenOptions.audience = config.AUTH0_AUDIENCE;
  }
  
  const accessToken = jwt.sign(payload, config.JWT_SECRET, accessTokenOptions);

  const refreshTokenOptions: jwt.SignOptions = {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: 'proxapeople-api',
  };
  
  if (config.AUTH0_AUDIENCE) {
    refreshTokenOptions.audience = config.AUTH0_AUDIENCE;
  }
  
  const refreshToken = jwt.sign({ userId: user.id }, config.JWT_SECRET, refreshTokenOptions);

  return { accessToken, refreshToken };
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET, {
      issuer: 'proxapeople-api',
      ...(config.AUTH0_AUDIENCE && { audience: config.AUTH0_AUDIENCE }),
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    throw new Error('Token verification failed');
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}

/**
 * Generate a secure random string for tokens
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
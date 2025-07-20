import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const configSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // Authentication
  AUTH0_DOMAIN: z.string().min(1, 'AUTH0_DOMAIN is required'),
  AUTH0_CLIENT_ID: z.string().min(1, 'AUTH0_CLIENT_ID is required'),
  AUTH0_CLIENT_SECRET: z.string().min(1, 'AUTH0_CLIENT_SECRET is required'),
  AUTH0_AUDIENCE: z.string().min(1, 'AUTH0_AUDIENCE is required'),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  // Application
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default(process.env.NODE_ENV === 'production' ? '8080' : '5000'),
  FRONTEND_URL: z.string().url().default(
    process.env.NODE_ENV === 'production' 
      ? 'https://proxapeople-production-673103558160.us-central1.run.app'
      : 'http://localhost:5173'
  ),
  
  // Security
  BCRYPT_ROUNDS: z.string().transform(Number).default('12'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  // CORS
  CORS_ORIGIN: z.string().default(
    process.env.NODE_ENV === 'production' 
      ? 'https://proxapeople-production-673103558160.us-central1.run.app'
      : 'http://localhost:5173'
  ),
  CORS_CREDENTIALS: z.string().transform(val => val === 'true').default('true'),
  
  // Session (fallback)
  SESSION_SECRET: z.string().min(1, 'SESSION_SECRET is required'),
  SESSION_MAX_AGE: z.string().transform(Number).default('86400000'), // 24 hours
});

function validateConfig() {
  try {
    const config = configSchema.parse(process.env);
    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid configuration:');
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const config = validateConfig();

export type Config = typeof config;

// Helper to check if we're in production
export const isProduction = config.NODE_ENV === 'production';
export const isDevelopment = config.NODE_ENV === 'development';
export const isTest = config.NODE_ENV === 'test';
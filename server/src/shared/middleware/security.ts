import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from '../../config/index';
import type { Request, Response, NextFunction } from 'express';

/**
 * Configure Helmet for security headers
 */
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", config.AUTH0_DOMAIN],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for Auth0
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
});

/**
 * Configure CORS
 */
export const corsConfig = cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow configured origins
    const allowedOrigins = [
      config.FRONTEND_URL,
      config.CORS_ORIGIN,
      'http://localhost:3000',
      'http://localhost:5173',
      // Allow production Cloud Run domain
      'https://proxapeople-production-673103558160.us-central1.run.app',
    ];
    
    // Also allow any Cloud Run domain pattern for flexibility
    if (origin.includes('us-central1.run.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: config.CORS_CREDENTIALS,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Correlation-ID',
  ],
  exposedHeaders: ['X-Correlation-ID'],
});

/**
 * General rate limiting
 */
export const generalRateLimit = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(config.RATE_LIMIT_WINDOW_MS / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for successful responses in development
  skip: (req, res) => config.NODE_ENV === 'development' && res.statusCode < 400,
});

/**
 * Strict rate limiting for authentication endpoints
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: {
    error: 'Too many authentication attempts',
    message: 'Too many login attempts from this IP, please try again later.',
    retryAfter: 15 * 60, // 15 minutes
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful attempts
});

/**
 * Password reset rate limiting
 */
export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset attempts per hour
  message: {
    error: 'Too many password reset attempts',
    message: 'Too many password reset attempts, please try again later.',
    retryAfter: 60 * 60, // 1 hour
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * API rate limiting for general API endpoints
 */
export const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: {
    error: 'API rate limit exceeded',
    message: 'Too many API requests, please slow down.',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Request correlation middleware for tracing
 */
export function correlationId(req: Request, res: Response, next: NextFunction): void {
  const correlationId = req.headers['x-correlation-id'] || 
    req.headers['x-request-id'] || 
    crypto.randomUUID();
    
  req.correlationId = correlationId as string;
  res.setHeader('X-Correlation-ID', correlationId);
  
  next();
}

/**
 * Security headers middleware for additional protection
 */
export function additionalSecurityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Remove server header
  res.removeHeader('X-Powered-By');
  
  // Add additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Prevent caching of sensitive data
  if (req.path.includes('/api/auth/') || req.path.includes('/api/users/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
}

/**
 * Health check bypass for monitoring
 */
export function healthCheckBypass(req: Request, res: Response, next: NextFunction): void {
  if (req.path === '/health' || req.path === '/api/health') {
    // Bypass all security middleware for health checks
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
    });
    return;
  }
  
  // Add simple startup probe endpoint
  if (req.path === '/startup' || req.path === '/api/startup') {
    res.json({ 
      status: 'ready', 
      timestamp: new Date().toISOString(),
      port: config.PORT,
    });
    return;
  }
  
  next();
}

// Extend Express Request type for correlation ID
declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}
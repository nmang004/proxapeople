import { Request, Response, NextFunction } from 'express';
import { auth, AuthResult } from 'express-oauth2-jwt-bearer';

interface Auth0User {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
  scope?: string;
}

declare global {
  namespace Express {
    interface Request {
      auth0User?: Auth0User;
      auth?: AuthResult;
    }
  }
}

// Auth0 JWT validation middleware
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256'
});

// Middleware that validates Auth0 JWT and extracts user info
export function validateAuth0Token(req: Request, res: Response, next: NextFunction) {
  jwtCheck(req, res, (err) => {
    if (err) {
      console.error('Auth0 JWT validation failed:', err.message);
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Invalid or missing authentication token',
      });
    }

    // Extract user info from the validated token
    if (req.auth?.payload) {
      req.auth0User = {
        sub: req.auth.payload.sub || '',
        email: req.auth.payload.email || '',
        given_name: req.auth.payload.given_name,
        family_name: req.auth.payload.family_name,
        name: req.auth.payload.name,
        picture: req.auth.payload.picture,
        email_verified: req.auth.payload.email_verified,
        scope: req.auth.payload.scope,
      };
    }

    next();
  });
}

// Optional Auth0 validation - continues even if no token
export function optionalAuth0Token(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, continue without authentication
    return next();
  }

  // Use the same validation but don't fail on error
  jwtCheck(req, res, (err) => {
    if (!err && req.auth?.payload) {
      req.auth0User = {
        sub: req.auth.payload.sub || '',
        email: req.auth.payload.email || '',
        given_name: req.auth.payload.given_name,
        family_name: req.auth.payload.family_name,
        name: req.auth.payload.name,
        picture: req.auth.payload.picture,
        email_verified: req.auth.payload.email_verified,
        scope: req.auth.payload.scope,
      };
    }
    // Continue regardless of token validity
    next();
  });
}
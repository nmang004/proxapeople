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
  console.log('🔍 Auth0 middleware: Checking auth for:', req.method, req.path);
  console.log('🔍 Auth0 middleware: Auth header present:', !!req.headers.authorization);
  console.log('🔍 Auth0 middleware: Token format check:', req.headers.authorization?.startsWith('Bearer '));
  console.log('🔍 Auth0 middleware: Expected audience:', process.env.AUTH0_AUDIENCE);
  console.log('🔍 Auth0 middleware: Expected issuer:', `https://${process.env.AUTH0_DOMAIN}/`);
  
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace('Bearer ', '');
    console.log('🔍 Auth0 middleware: Token preview:', token.substring(0, 50) + '...');
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔍 Auth0 middleware: Token payload preview:', {
        aud: tokenPayload.aud,
        iss: tokenPayload.iss,
        exp: new Date(tokenPayload.exp * 1000).toISOString(),
        iat: new Date(tokenPayload.iat * 1000).toISOString(),
        sub: tokenPayload.sub
      });
    } catch (e) {
      console.warn('⚠️ Auth0 middleware: Could not parse token payload:', e);
    }
  }

  jwtCheck(req, res, (err) => {
    if (err) {
      console.error('❌ Auth0 middleware: JWT validation failed for:', req.method, req.path);
      console.error('❌ Auth0 middleware: Error message:', err.message);
      console.error('❌ Auth0 middleware: Full error:', err);
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Invalid or missing authentication token',
      });
    }

    console.log('✅ Auth0 middleware: JWT validation passed for:', req.method, req.path);

    // Extract user info from the validated token
    if (req.auth?.payload) {
      console.log('✅ Auth0 middleware: Extracting user info from payload');
      req.auth0User = {
        sub: (req.auth.payload.sub as string) || '',
        email: (req.auth.payload.email as string) || '',
        given_name: req.auth.payload.given_name as string | undefined,
        family_name: req.auth.payload.family_name as string | undefined,
        name: req.auth.payload.name as string | undefined,
        picture: req.auth.payload.picture as string | undefined,
        email_verified: req.auth.payload.email_verified as boolean | undefined,
        scope: req.auth.payload.scope as string | undefined,
      };
      console.log('✅ Auth0 middleware: User extracted:', { 
        sub: req.auth0User?.sub, 
        email: req.auth0User?.email 
      });
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
        sub: (req.auth.payload.sub as string) || '',
        email: (req.auth.payload.email as string) || '',
        given_name: req.auth.payload.given_name as string | undefined,
        family_name: req.auth.payload.family_name as string | undefined,
        name: req.auth.payload.name as string | undefined,
        picture: req.auth.payload.picture as string | undefined,
        email_verified: req.auth.payload.email_verified as boolean | undefined,
        scope: req.auth.payload.scope as string | undefined,
      };
    }
    // Continue regardless of token validity
    next();
  });
}
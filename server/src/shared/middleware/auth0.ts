import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

interface Auth0User extends JwtPayload {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      auth0User?: Auth0User;
    }
  }
}

// JWKS client for Auth0
const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  requestHeaders: {}, // Optional
  timeout: 30000, // Defaults to 30s
});

function getKey(header: jwt.JwtHeader, callback: jwt.GetPublicKeyOrSecret) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export function validateAuth0Token(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'No valid authorization header found',
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  jwt.verify(token, getKey, {
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256'],
  }, (err, decoded) => {
    if (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token verification failed',
      });
    }

    // Attach the Auth0 user info to the request
    req.auth0User = decoded as Auth0User;
    next();
  });
}

export function optionalAuth0Token(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, continue without authentication
    return next();
  }

  const token = authHeader.substring(7);

  jwt.verify(token, getKey, {
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256'],
  }, (err, decoded) => {
    if (!err && decoded) {
      req.auth0User = decoded as Auth0User;
    }
    // Continue regardless of token validity
    next();
  });
}
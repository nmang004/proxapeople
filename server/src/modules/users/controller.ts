import { Request, Response } from 'express';
import { UserService } from './service';
import { insertUserSchema } from '@shared/schema';
import { asyncHandler } from '../../shared/utils/async-handler';
import { validateRequestBody, handleValidationError } from '../../shared/utils/validation';
import { storage } from '../../database/storage';
import { z } from 'zod';

export class UserController {
  constructor(private userService: UserService) {}

  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.userService.getAllUsers();
    res.json(users);
  });

  getUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const user = await this.userService.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get current user from Auth0
    if (!req.auth0User) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const currentUser = await storage.getUserByEmail(req.auth0User.email);
    if (!currentUser) {
      return res.status(401).json({ message: 'User profile not found' });
    }
    
    // Check permissions
    const canView = await this.userService.canUserViewUser(currentUser.id, userId);
    if (!canView) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'Can only view own profile or requires users:view permission' 
      });
    }
    
    res.json(user);
  });

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const userData = validateRequestBody(insertUserSchema, req, res);
    if (!userData) return; // Response already sent by validateRequestBody

    try {
      const user = await this.userService.createUser(userData);
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return handleValidationError(err, res, 'user');
      }
      throw err;
    }
  });
}
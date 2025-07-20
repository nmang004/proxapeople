import { storage } from '../../database/storage';
import { type User, type InsertUser } from '@shared/schema';

export class UserService {
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await storage.getAllUsers();
    return users.map(({ password, ...user }) => user);
  }

  async getUser(id: number): Promise<Omit<User, 'password'> | null> {
    const user = await storage.getUser(id);
    if (!user) return null;
    
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async createUser(userData: InsertUser): Promise<Omit<User, 'password'>> {
    const user = await storage.createUser(userData);
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async canUserViewUser(requestingUserId: number, targetUserId: number): Promise<boolean> {
    // Users can view their own profile
    if (requestingUserId === targetUserId) {
      return true;
    }
    
    // Check if user has users:view permission
    return await storage.checkUserPermission(requestingUserId, 'users', 'view');
  }
}
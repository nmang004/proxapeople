import { storage } from "../../database/storage";
import { type User } from "@shared/schema";

/**
 * Check if a user has permission to perform an action on a resource
 */
export async function hasPermission(
  userId: number, 
  resourceName: string, 
  action: string
): Promise<boolean> {
  try {
    return await storage.checkUserPermission(userId, resourceName, action);
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
}

/**
 * Express middleware to check if a user has permission
 */
export function requirePermission(resourceName: string, action: string) {
  return async (req: any, res: any, next: any) => {
    // Use auth0User instead of user
    if (!req.auth0User?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Get user by auth0 sub
    const user = await storage.getUserByEmail(req.auth0User.email);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    const hasAccess = await hasPermission(user.id, resourceName, action);
    
    if (!hasAccess) {
      return res.status(403).json({ 
        message: "Forbidden: You don't have permission to perform this action" 
      });
    }
    
    next();
  };
}

/**
 * Check if a user is an admin
 */
export async function isAdmin(userId: number): Promise<boolean> {
  try {
    const user = await storage.getUser(userId);
    return user?.role === "admin" || false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Get all permissions for a user
 */
export async function getUserPermissions(userId: number): Promise<any[]> {
  try {
    const user = await storage.getUser(userId);
    
    if (!user) {
      return [];
    }
    
    // Get role-based permissions
    const rolePermissions = await storage.getRolePermissions(user.role);
    
    // Get user-specific permissions
    const userSpecificPermissions = await storage.getUserPermissions(userId);
    
    // Filter out expired permissions and only include granted ones
    const validUserPerms = userSpecificPermissions.filter(p => 
      p.granted && (!p.expiresAt || p.expiresAt > new Date())
    );
    
    // For now, return a simplified structure since we don't have resource details
    // In a real implementation, you'd want to join with permission and resource data
    return [
      ...rolePermissions.map(p => ({
        action: p.action,
        description: p.description,
        source: 'role'
      })),
      ...validUserPerms.map(p => ({
        source: 'user',
        expiresAt: p.expiresAt,
        granted: p.granted
      }))
    ];
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return [];
  }
}
import { eq, and, inArray } from "drizzle-orm";
import { db } from "../../database/supabase";
import { 
  users, 
  permissions, 
  rolePermissions, 
  userPermissions, 
  resources, 
  type User 
} from "@shared/schema";

/**
 * Check if a user has permission to perform an action on a resource
 */
export async function hasPermission(
  userId: number, 
  resourceName: string, 
  action: string
): Promise<boolean> {
  try {
    // First, get the user to check their role
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      return false;
    }
    
    // Find the resource
    const [resource] = await db.select().from(resources).where(eq(resources.name, resourceName));
    
    if (!resource) {
      return false;
    }
    
    // Find the specific permission for this resource and action
    const [permission] = await db.select().from(permissions).where(
      and(
        eq(permissions.resourceId, resource.id),
        eq(permissions.action, action as any)
      )
    );
    
    if (!permission) {
      return false;
    }
    
    // Check if this permission is granted to the user's role
    const roleBasedPermissions = await db.select().from(rolePermissions).where(
      and(
        eq(rolePermissions.role, user.role),
        eq(rolePermissions.permissionId, permission.id)
      )
    );
    
    if (roleBasedPermissions.length > 0) {
      return true;
    }
    
    // Check for specific user permissions (can override role permissions)
    const [userSpecificPermission] = await db.select().from(userPermissions).where(
      and(
        eq(userPermissions.userId, userId),
        eq(userPermissions.permissionId, permission.id),
        eq(userPermissions.granted, true)
      )
    );
    
    // If a specific user permission exists and is granted
    if (userSpecificPermission) {
      // Check if the permission has expired
      if (userSpecificPermission.expiresAt && userSpecificPermission.expiresAt < new Date()) {
        return false;
      }
      return true;
    }
    
    // No permission found
    return false;
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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const hasAccess = await hasPermission(req.user.id, resourceName, action);
    
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
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user && user.role === "admin";
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
    // Get the user
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      return [];
    }
    
    // Get role-based permissions
    const rolePerms = await db.select({
      permission: permissions,
      resource: resources
    })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .innerJoin(resources, eq(permissions.resourceId, resources.id))
    .where(eq(rolePermissions.role, user.role));
    
    // Get user-specific permissions
    const userPerms = await db.select({
      permission: permissions,
      resource: resources,
      granted: userPermissions.granted,
      expiresAt: userPermissions.expiresAt
    })
    .from(userPermissions)
    .innerJoin(permissions, eq(userPermissions.permissionId, permissions.id))
    .innerJoin(resources, eq(permissions.resourceId, resources.id))
    .where(
      and(
        eq(userPermissions.userId, userId),
        eq(userPermissions.granted, true)
      )
    );
    
    // Filter out expired permissions
    const validUserPerms = userPerms.filter(p => 
      !p.expiresAt || p.expiresAt > new Date()
    );
    
    // Combine both sets of permissions
    return [
      ...rolePerms.map(p => ({
        resource: p.resource.name,
        resourceDisplayName: p.resource.displayName,
        action: p.permission.action,
        description: p.permission.description,
        source: 'role'
      })),
      ...validUserPerms.map(p => ({
        resource: p.resource.name,
        resourceDisplayName: p.resource.displayName,
        action: p.permission.action,
        description: p.permission.description,
        source: 'user',
        expiresAt: p.expiresAt
      }))
    ];
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return [];
  }
}
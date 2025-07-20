import { Request, Response } from "express";
import { storage } from "../../database/storage";
import { 
  insertResourceSchema, 
  insertPermissionSchema, 
  insertRolePermissionSchema, 
  insertUserPermissionSchema 
} from "@shared/schema";

// Resource Controllers
export async function createResource(req: Request, res: Response) {
  try {
    const validatedData = insertResourceSchema.parse(req.body);
    const resource = await storage.createResource(validatedData);
    res.status(201).json(resource);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getAllResources(req: Request, res: Response) {
  try {
    const resources = await storage.getAllResources();
    res.json(resources);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getResourceById(req: Request, res: Response) {
  try {
    const resourceId = parseInt(req.params.id);
    const resource = await storage.getResource(resourceId);
    
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    
    res.json(resource);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Permission Controllers
export async function createPermission(req: Request, res: Response) {
  try {
    const validatedData = insertPermissionSchema.parse(req.body);
    const permission = await storage.createPermission(validatedData);
    res.status(201).json(permission);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getAllPermissions(req: Request, res: Response) {
  try {
    const permissions = await storage.getAllPermissions();
    res.json(permissions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getResourcePermissions(req: Request, res: Response) {
  try {
    const resourceId = parseInt(req.params.resourceId);
    const permissions = await storage.getResourcePermissions(resourceId);
    res.json(permissions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Role Permission Controllers
export async function assignPermissionToRole(req: Request, res: Response) {
  try {
    const validatedData = insertRolePermissionSchema.parse(req.body);
    const rolePermission = await storage.assignPermissionToRole(validatedData);
    res.status(201).json(rolePermission);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getRolePermissions(req: Request, res: Response) {
  try {
    const role = req.params.role;
    const permissions = await storage.getRolePermissions(role);
    res.json(permissions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function removeRolePermission(req: Request, res: Response) {
  try {
    const rolePermissionId = parseInt(req.params.id);
    await storage.removeRolePermission(rolePermissionId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// User Permission Controllers
export async function assignPermissionToUser(req: Request, res: Response) {
  try {
    const validatedData = insertUserPermissionSchema.parse(req.body);
    const userPermission = await storage.assignPermissionToUser(validatedData);
    res.status(201).json(userPermission);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getUserPermissions(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId);
    const permissions = await storage.getUserPermissions(userId);
    res.json(permissions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function removeUserPermission(req: Request, res: Response) {
  try {
    const userPermissionId = parseInt(req.params.id);
    await storage.removeUserPermission(userPermissionId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Permission Check Controller
export async function checkPermission(req: Request, res: Response) {
  try {
    const { userId, resourceName, action } = req.body;
    
    if (!userId || !resourceName || !action) {
      return res.status(400).json({ 
        message: "userId, resourceName, and action are required" 
      });
    }
    
    const hasAccess = await storage.checkUserPermission(userId, resourceName, action);
    res.json({ hasPermission: hasAccess });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Check Current User Permission
export async function checkCurrentUserPermission(req: Request, res: Response) {
  try {
    if (!req.user || !(req.user as any).id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = (req.user as any).id;
    const { resourceName, action } = req.body;
    
    if (!resourceName || !action) {
      return res.status(400).json({ 
        message: "resourceName and action are required" 
      });
    }
    
    const hasAccess = await storage.checkUserPermission(userId, resourceName, action);
    res.json({ hasPermission: hasAccess });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
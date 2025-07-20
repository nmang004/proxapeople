import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';

interface Permission {
  id: number;
  resourceId: number;
  action: string;
  description: string;
}

interface Resource {
  id: number;
  name: string;
  displayName: string;
  description: string;
}

interface PermissionsContextType {
  permissions: Permission[];
  resources: Resource[];
  isLoading: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  checkPermission: (resource: string, action: string) => Promise<boolean>;
  refreshPermissions: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
}

interface PermissionsProviderProps {
  children: ReactNode;
}

export function PermissionsProvider({ children }: PermissionsProviderProps) {
  const { user, tokens, isAuthenticated } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionCache, setPermissionCache] = useState<Map<string, boolean>>(new Map());

  // Fetch user's permissions and available resources
  const refreshPermissions = async () => {
    if (!isAuthenticated || !user || !tokens) {
      setPermissions([]);
      setResources([]);
      setPermissionCache(new Map());
      return;
    }

    setIsLoading(true);
    try {
      // Fetch user's permissions
      const permissionsResponse = await fetch(`/api/permissions/users/${user.id}/permissions`, {
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
      });

      if (permissionsResponse.ok) {
        const userPermissions = await permissionsResponse.json();
        setPermissions(userPermissions);
      }

      // Fetch available resources
      const resourcesResponse = await fetch('/api/permissions/resources', {
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
      });

      if (resourcesResponse.ok) {
        const availableResources = await resourcesResponse.json();
        setResources(availableResources);
      }

      // Clear permission cache when refreshing
      setPermissionCache(new Map());
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has a specific permission (client-side check)
  const hasPermission = (resource: string, action: string): boolean => {
    if (!isAuthenticated || !user) return false;

    // Admin users have all permissions
    if (user.role === 'admin') return true;

    // Check cache first
    const cacheKey = `${resource}:${action}`;
    if (permissionCache.has(cacheKey)) {
      return permissionCache.get(cacheKey)!;
    }

    // Find the resource
    const resourceObj = resources.find(r => r.name === resource);
    if (!resourceObj) return false;

    // Check if user has the specific permission
    const hasPermissionForResource = permissions.some(permission => {
      // We need to check if this permission is for the right resource and action
      // This requires additional data from the API that includes resource info
      return permission.action === action && permission.resourceId === resourceObj.id;
    });

    // Cache the result
    setPermissionCache(prev => new Map(prev).set(cacheKey, hasPermissionForResource));
    return hasPermissionForResource;
  };

  // Check permission against the server (authoritative check)
  const checkPermission = async (resource: string, action: string): Promise<boolean> => {
    if (!isAuthenticated || !tokens) return false;

    // Admin users have all permissions
    if (user?.role === 'admin') return true;

    // Check cache first
    const cacheKey = `${resource}:${action}:server`;
    if (permissionCache.has(cacheKey)) {
      return permissionCache.get(cacheKey)!;
    }

    try {
      const response = await fetch('/api/permissions/check-my-permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify({ resource, action }),
      });

      if (response.ok) {
        const result = await response.json();
        // Cache the result
        setPermissionCache(prev => new Map(prev).set(cacheKey, result.hasPermission));
        return result.hasPermission;
      }
    } catch (error) {
      console.error('Failed to check permission:', error);
    }

    return false;
  };

  // Load permissions when user authentication changes
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshPermissions();
    } else {
      setPermissions([]);
      setResources([]);
      setPermissionCache(new Map());
    }
  }, [isAuthenticated, user?.id]);

  const value: PermissionsContextType = {
    permissions,
    resources,
    isLoading,
    hasPermission,
    checkPermission,
    refreshPermissions,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}
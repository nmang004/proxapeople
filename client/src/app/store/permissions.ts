import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Store configuration utilities (copied from index.ts to avoid circular dependency)
const createStore = <T>(
  storeName: string,
  storeCreator: (
    set: (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean | undefined) => void,
    get: () => T,
    api: any
  ) => T,
  options: {
    persist?: boolean;
    devtools?: boolean;
  } = {}
) => {
  const { persist: enablePersist = false, devtools: enableDevtools = true } = options;

  let store = storeCreator;

  // Add devtools if enabled and in development
  if (enableDevtools && process.env.NODE_ENV === 'development') {
    store = devtools(store, { name: `ProxaPeople ${storeName}` });
  }

  return create(store);
};

// Common store types
interface BaseState {
  isLoading: boolean;
  error: string | null;
}

interface AsyncActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export interface Permission {
  id: number;
  resourceId: number;
  action: string;
  description: string;
}

export interface Resource {
  id: number;
  name: string;
  displayName: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  displayName: string;
  description: string;
  permissions: Permission[];
}

export interface UserPermission {
  userId: number;
  resourceName: string;
  action: string;
  granted: boolean;
  inheritedFrom?: 'role' | 'direct';
}

interface PermissionsState extends BaseState {
  // Current user's permissions
  userPermissions: Permission[];
  
  // Available resources and actions
  resources: Resource[];
  
  // Available roles
  roles: Role[];
  
  // Permission cache for quick lookups
  permissionCache: Map<string, boolean>;
  
  // Role-based permissions (for admin management)
  rolePermissions: Record<number, Permission[]>; // role ID -> permissions
  
  // User role assignments
  userRoles: Record<number, number[]>; // user ID -> role IDs
  
  // Permission matrix for quick reference
  permissionMatrix: Record<string, Record<string, boolean>>; // resource -> action -> allowed
}

interface PermissionsActions extends AsyncActions {
  // Initialize and refresh permissions
  initializePermissions: () => Promise<void>;
  refreshPermissions: () => Promise<void>;
  
  // Permission checking
  hasPermission: (resource: string, action: string) => boolean;
  checkPermission: (resource: string, action: string) => Promise<boolean>;
  checkPermissions: (checks: { resource: string; action: string }[]) => Promise<boolean[]>;
  
  // Resource management
  fetchResources: () => Promise<void>;
  
  // Role management (admin functions)
  fetchRoles: () => Promise<void>;
  createRole: (role: Omit<Role, 'id' | 'permissions'>) => Promise<void>;
  updateRole: (roleId: number, updates: Partial<Role>) => Promise<void>;
  deleteRole: (roleId: number) => Promise<void>;
  
  // Role permission management
  assignPermissionToRole: (roleId: number, permissionId: number) => Promise<void>;
  removePermissionFromRole: (roleId: number, permissionId: number) => Promise<void>;
  updateRolePermissions: (roleId: number, permissionIds: number[]) => Promise<void>;
  
  // User role assignment
  assignRoleToUser: (userId: number, roleId: number) => Promise<void>;
  removeRoleFromUser: (userId: number, roleId: number) => Promise<void>;
  updateUserRoles: (userId: number, roleIds: number[]) => Promise<void>;
  
  // Direct permission assignment (override role permissions)
  assignDirectPermission: (userId: number, resourceName: string, action: string) => Promise<void>;
  removeDirectPermission: (userId: number, resourceName: string, action: string) => Promise<void>;
  
  // Utility functions
  getUserPermissions: (userId: number) => UserPermission[];
  getRolePermissions: (roleId: number) => Permission[];
  clearPermissionCache: () => void;
}

type PermissionsStore = PermissionsState & PermissionsActions;

// API client for permissions
class PermissionsAPI {
  private async request(endpoint: string, options: RequestInit = {}) {
    const accessToken = localStorage.getItem('proxapeople_access_token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`/api${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `Request failed: ${response.status}`);
    }

    return response.json();
  }

  async getUserPermissions() {
    return this.request('/permissions/user');
  }

  async checkPermission(resource: string, action: string) {
    return this.request('/permissions/check', {
      method: 'POST',
      body: JSON.stringify({ resource, action }),
    });
  }

  async checkPermissions(checks: { resource: string; action: string }[]) {
    return this.request('/permissions/check-multiple', {
      method: 'POST',
      body: JSON.stringify({ checks }),
    });
  }

  async getResources() {
    return this.request('/permissions/resources');
  }

  async getRoles() {
    return this.request('/permissions/roles');
  }

  async createRole(role: Omit<Role, 'id' | 'permissions'>) {
    return this.request('/permissions/roles', {
      method: 'POST',
      body: JSON.stringify(role),
    });
  }

  async updateRole(roleId: number, updates: Partial<Role>) {
    return this.request(`/permissions/roles/${roleId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteRole(roleId: number) {
    return this.request(`/permissions/roles/${roleId}`, {
      method: 'DELETE',
    });
  }

  async updateRolePermissions(roleId: number, permissionIds: number[]) {
    return this.request(`/permissions/roles/${roleId}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permissionIds }),
    });
  }

  async assignRoleToUser(userId: number, roleId: number) {
    return this.request('/permissions/user-roles', {
      method: 'POST',
      body: JSON.stringify({ userId, roleId }),
    });
  }

  async removeRoleFromUser(userId: number, roleId: number) {
    return this.request(`/permissions/user-roles`, {
      method: 'DELETE',
      body: JSON.stringify({ userId, roleId }),
    });
  }

  async updateUserRoles(userId: number, roleIds: number[]) {
    return this.request(`/permissions/users/${userId}/roles`, {
      method: 'PUT',
      body: JSON.stringify({ roleIds }),
    });
  }

  async assignDirectPermission(userId: number, resourceName: string, action: string) {
    return this.request('/permissions/direct', {
      method: 'POST',
      body: JSON.stringify({ userId, resourceName, action }),
    });
  }

  async removeDirectPermission(userId: number, resourceName: string, action: string) {
    return this.request('/permissions/direct', {
      method: 'DELETE',
      body: JSON.stringify({ userId, resourceName, action }),
    });
  }
}

const api = new PermissionsAPI();

// Utility functions
const buildPermissionMatrix = (permissions: Permission[], resources: Resource[]) => {
  const matrix: Record<string, Record<string, boolean>> = {};
  
  resources.forEach(resource => {
    matrix[resource.name] = {};
  });
  
  permissions.forEach(permission => {
    const resource = resources.find(r => r.id === permission.resourceId);
    if (resource) {
      matrix[resource.name][permission.action] = true;
    }
  });
  
  return matrix;
};

const createPermissionKey = (resource: string, action: string) => `${resource}:${action}`;

// Create the permissions store
export const usePermissionsStore = createStore<PermissionsStore>(
  'permissions',
  (set, get) => ({
    // Initial state
    userPermissions: [],
    resources: [],
    roles: [],
    permissionCache: new Map(),
    rolePermissions: {},
    userRoles: {},
    permissionMatrix: {},
    isLoading: false,
    error: null,

    // Async utilities
    setLoading: (loading: boolean) =>
      set((state) => ({ ...state, isLoading: loading })),

    setError: (error: string | null) =>
      set((state) => ({ ...state, error, isLoading: false })),

    clearError: () =>
      set((state) => ({ ...state, error: null })),

    // Initialize and refresh permissions
    initializePermissions: async () => {
      const { refreshPermissions, fetchResources } = get();
      
      try {
        // Fetch resources first, then permissions
        await fetchResources();
        await refreshPermissions();
      } catch (error) {
        console.error('Failed to initialize permissions:', error);
      }
    },

    refreshPermissions: async () => {
      const { setLoading, setError, resources } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.getUserPermissions();
        const { permissions } = response;
        
        // Build permission matrix for quick lookups
        const permissionMatrix = buildPermissionMatrix(permissions, resources);
        
        // Clear cache when refreshing
        const permissionCache = new Map<string, boolean>();
        
        set((state) => ({
          ...state,
          userPermissions: permissions,
          permissionMatrix,
          permissionCache,
          isLoading: false,
        }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to refresh permissions');
        throw error;
      }
    },

    // Permission checking
    hasPermission: (resource: string, action: string) => {
      const { permissionMatrix, permissionCache } = get();
      
      const cacheKey = createPermissionKey(resource, action);
      
      // Check cache first
      if (permissionCache.has(cacheKey)) {
        return permissionCache.get(cacheKey)!;
      }
      
      // Check permission matrix
      const hasPermission = permissionMatrix[resource]?.[action] === true;
      
      // Cache the result
      permissionCache.set(cacheKey, hasPermission);
      
      return hasPermission;
    },

    checkPermission: async (resource: string, action: string) => {
      const { setError, permissionCache } = get();
      
      const cacheKey = createPermissionKey(resource, action);
      
      // Check cache first
      if (permissionCache.has(cacheKey)) {
        return permissionCache.get(cacheKey)!;
      }
      
      try {
        const response = await api.checkPermission(resource, action);
        const hasPermission = response.allowed;
        
        // Cache the result
        permissionCache.set(cacheKey, hasPermission);
        
        set((state) => ({
          ...state,
          permissionCache: new Map(permissionCache),
        }));
        
        return hasPermission;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to check permission');
        return false;
      }
    },

    checkPermissions: async (checks: { resource: string; action: string }[]) => {
      const { setError, permissionCache } = get();
      
      try {
        const response = await api.checkPermissions(checks);
        const results = response.results;
        
        // Cache all results
        checks.forEach((check, index) => {
          const cacheKey = createPermissionKey(check.resource, check.action);
          permissionCache.set(cacheKey, results[index]);
        });
        
        set((state) => ({
          ...state,
          permissionCache: new Map(permissionCache),
        }));
        
        return results;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to check permissions');
        return new Array(checks.length).fill(false);
      }
    },

    // Resource management
    fetchResources: async () => {
      const { setLoading, setError } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        const resources = await api.getResources();
        
        set((state) => ({
          ...state,
          resources,
          isLoading: false,
        }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch resources');
        throw error;
      }
    },

    // Role management
    fetchRoles: async () => {
      const { setLoading, setError } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        const roles = await api.getRoles();
        
        // Build role permissions map
        const rolePermissions: Record<number, Permission[]> = {};
        roles.forEach((role: Role) => {
          rolePermissions[role.id] = role.permissions;
        });
        
        set((state) => ({
          ...state,
          roles,
          rolePermissions,
          isLoading: false,
        }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch roles');
        throw error;
      }
    },

    createRole: async (role: Omit<Role, 'id' | 'permissions'>) => {
      const { setLoading, setError, fetchRoles } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        await api.createRole(role);
        
        // Refresh roles list
        await fetchRoles();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to create role');
        throw error;
      }
    },

    updateRole: async (roleId: number, updates: Partial<Role>) => {
      const { setLoading, setError, fetchRoles } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        await api.updateRole(roleId, updates);
        
        // Refresh roles list
        await fetchRoles();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update role');
        throw error;
      }
    },

    deleteRole: async (roleId: number) => {
      const { setLoading, setError, fetchRoles } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        await api.deleteRole(roleId);
        
        // Refresh roles list
        await fetchRoles();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to delete role');
        throw error;
      }
    },

    // Role permission management
    assignPermissionToRole: async (roleId: number, permissionId: number) => {
      const { rolePermissions, getRolePermissions, updateRolePermissions } = get();
      
      const currentPermissions = getRolePermissions(roleId);
      const permissionIds = currentPermissions.map(p => p.id);
      
      if (!permissionIds.includes(permissionId)) {
        permissionIds.push(permissionId);
        await updateRolePermissions(roleId, permissionIds);
      }
    },

    removePermissionFromRole: async (roleId: number, permissionId: number) => {
      const { getRolePermissions, updateRolePermissions } = get();
      
      const currentPermissions = getRolePermissions(roleId);
      const permissionIds = currentPermissions
        .map(p => p.id)
        .filter(id => id !== permissionId);
      
      await updateRolePermissions(roleId, permissionIds);
    },

    updateRolePermissions: async (roleId: number, permissionIds: number[]) => {
      const { setLoading, setError, fetchRoles, clearPermissionCache } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        await api.updateRolePermissions(roleId, permissionIds);
        
        // Clear permission cache since role permissions changed
        clearPermissionCache();
        
        // Refresh roles list
        await fetchRoles();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update role permissions');
        throw error;
      }
    },

    // User role assignment
    assignRoleToUser: async (userId: number, roleId: number) => {
      const { setLoading, setError, clearPermissionCache } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        await api.assignRoleToUser(userId, roleId);
        
        // Clear permission cache since user roles changed
        clearPermissionCache();
        
        set((state) => ({ ...state, isLoading: false }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to assign role to user');
        throw error;
      }
    },

    removeRoleFromUser: async (userId: number, roleId: number) => {
      const { setLoading, setError, clearPermissionCache } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        await api.removeRoleFromUser(userId, roleId);
        
        // Clear permission cache since user roles changed
        clearPermissionCache();
        
        set((state) => ({ ...state, isLoading: false }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to remove role from user');
        throw error;
      }
    },

    updateUserRoles: async (userId: number, roleIds: number[]) => {
      const { setLoading, setError, clearPermissionCache } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        await api.updateUserRoles(userId, roleIds);
        
        // Clear permission cache since user roles changed
        clearPermissionCache();
        
        set((state) => ({ ...state, isLoading: false }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update user roles');
        throw error;
      }
    },

    // Direct permission assignment
    assignDirectPermission: async (userId: number, resourceName: string, action: string) => {
      const { setLoading, setError, clearPermissionCache } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        await api.assignDirectPermission(userId, resourceName, action);
        
        // Clear permission cache since permissions changed
        clearPermissionCache();
        
        set((state) => ({ ...state, isLoading: false }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to assign direct permission');
        throw error;
      }
    },

    removeDirectPermission: async (userId: number, resourceName: string, action: string) => {
      const { setLoading, setError, clearPermissionCache } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        await api.removeDirectPermission(userId, resourceName, action);
        
        // Clear permission cache since permissions changed
        clearPermissionCache();
        
        set((state) => ({ ...state, isLoading: false }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to remove direct permission');
        throw error;
      }
    },

    // Utility functions
    getUserPermissions: (userId: number) => {
      // This would need to be implemented based on server response
      // For now, return empty array
      return [];
    },

    getRolePermissions: (roleId: number) => {
      const { rolePermissions } = get();
      return rolePermissions[roleId] || [];
    },

    clearPermissionCache: () => {
      set((state) => ({
        ...state,
        permissionCache: new Map(),
      }));
    },
  }),
  {
    persist: false, // Don't persist permissions for security
    devtools: true,
  }
);
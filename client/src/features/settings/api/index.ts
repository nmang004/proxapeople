// TODO: Add permissions endpoints when they are implemented

// Re-export permissions-specific hooks
export {
  usePermissionCheck,
  useUserPermissions,
  useRolePermissions,
} from '../../../shared/api/hooks';

// Re-export permissions-specific types
export type {
  Permission,
  Resource,
  RolePermission,
  UserPermission,
  PermissionCheckRequest,
  PermissionCheckResponse,
} from '../../../shared/api/types';

// Permission action types
export type PermissionAction = 'view' | 'create' | 'update' | 'delete' | 'approve' | 'assign' | 'admin';

// Export a convenience object for settings/permissions API
export const settingsApi = {
  // Helper functions specific to settings/permissions feature
  getActionLabel: (action: PermissionAction): string => {
    switch (action) {
      case 'view':
        return 'View';
      case 'create':
        return 'Create';
      case 'update':
        return 'Update';
      case 'delete':
        return 'Delete';
      case 'approve':
        return 'Approve';
      case 'assign':
        return 'Assign';
      case 'admin':
        return 'Admin';
      default:
        return 'Unknown';
    }
  },

  getActionColor: (action: PermissionAction): string => {
    switch (action) {
      case 'view':
        return 'text-blue-600 bg-blue-100';
      case 'create':
        return 'text-green-600 bg-green-100';
      case 'update':
        return 'text-yellow-600 bg-yellow-100';
      case 'delete':
        return 'text-red-600 bg-red-100';
      case 'approve':
        return 'text-purple-600 bg-purple-100';
      case 'assign':
        return 'text-indigo-600 bg-indigo-100';
      case 'admin':
        return 'text-gray-800 bg-gray-200';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  },

  getRoleDisplayName: (role: 'admin' | 'hr' | 'manager' | 'employee'): string => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'hr':
        return 'HR Manager';
      case 'manager':
        return 'Manager';
      case 'employee':
        return 'Employee';
      default:
        return 'Unknown';
    }
  },

  getRoleDescription: (role: 'admin' | 'hr' | 'manager' | 'employee'): string => {
    switch (role) {
      case 'admin':
        return 'Full system access with all administrative privileges';
      case 'hr':
        return 'Human resources management with employee and policy access';
      case 'manager':
        return 'Team management with direct report oversight';
      case 'employee':
        return 'Standard user access with personal data management';
      default:
        return 'Unknown role';
    }
  },

  getDefaultRolePermissions: (role: 'admin' | 'hr' | 'manager' | 'employee'): Record<string, PermissionAction[]> => {
    switch (role) {
      case 'admin':
        return {
          users: ['view', 'create', 'update', 'delete', 'admin'],
          departments: ['view', 'create', 'update', 'delete', 'admin'],
          teams: ['view', 'create', 'update', 'delete', 'admin'],
          goals: ['view', 'create', 'update', 'delete', 'approve', 'assign'],
          meetings: ['view', 'create', 'update', 'delete'],
          reviews: ['view', 'create', 'update', 'delete', 'approve'],
          surveys: ['view', 'create', 'update', 'delete'],
          analytics: ['view', 'admin'],
          permissions: ['view', 'create', 'update', 'delete', 'admin'],
        };
      
      case 'hr':
        return {
          users: ['view', 'create', 'update', 'delete'],
          departments: ['view', 'create', 'update'],
          teams: ['view', 'create', 'update'],
          goals: ['view', 'create', 'update', 'approve'],
          meetings: ['view', 'create', 'update'],
          reviews: ['view', 'create', 'update', 'approve'],
          surveys: ['view', 'create', 'update', 'delete'],
          analytics: ['view'],
          permissions: ['view'],
        };
      
      case 'manager':
        return {
          users: ['view', 'update'], // Can only update direct reports
          departments: ['view'],
          teams: ['view', 'update'], // Can only update managed teams
          goals: ['view', 'create', 'update', 'assign'],
          meetings: ['view', 'create', 'update'],
          reviews: ['view', 'create', 'update'],
          surveys: ['view'],
          analytics: ['view'],
          permissions: ['view'],
        };
      
      case 'employee':
        return {
          users: ['view'], // Can only view limited user info
          departments: ['view'],
          teams: ['view'],
          goals: ['view', 'update'], // Can only update own goals
          meetings: ['view', 'update'], // Can only update own meetings
          reviews: ['view', 'update'], // Can only update own reviews
          surveys: ['view'],
          analytics: [],
          permissions: [],
        };
      
      default:
        return {};
    }
  },

  formatPermissionKey: (resource: string, action: PermissionAction): string => {
    return `${resource}:${action}`;
  },

  parsePermissionKey: (permissionKey: string): { resource: string; action: PermissionAction } | null => {
    const [resource, action] = permissionKey.split(':');
    if (!resource || !action) return null;
    
    return {
      resource,
      action: action as PermissionAction,
    };
  },

  hasPermission: (userPermissions: string[], resource: string, action: PermissionAction): boolean => {
    const permissionKey = settingsApi.formatPermissionKey(resource, action);
    return userPermissions.includes(permissionKey);
  },

  getResourceIcon: (resource: string): string => {
    switch (resource) {
      case 'users':
        return '👥';
      case 'departments':
        return '🏢';
      case 'teams':
        return '👨‍👩‍👧‍👦';
      case 'goals':
        return '🎯';
      case 'meetings':
        return '📅';
      case 'reviews':
        return '📊';
      case 'surveys':
        return '📋';
      case 'analytics':
        return '📈';
      case 'permissions':
        return '🔐';
      default:
        return '📄';
    }
  },

  getResourceDisplayName: (resource: string): string => {
    switch (resource) {
      case 'users':
        return 'Users';
      case 'departments':
        return 'Departments';
      case 'teams':
        return 'Teams';
      case 'goals':
        return 'Goals';
      case 'meetings':
        return 'Meetings';
      case 'reviews':
        return 'Performance Reviews';
      case 'surveys':
        return 'Surveys';
      case 'analytics':
        return 'Analytics';
      case 'permissions':
        return 'Permissions';
      default:
        return resource.charAt(0).toUpperCase() + resource.slice(1);
    }
  },

  getPermissionLevel: (actions: PermissionAction[]): 'none' | 'read' | 'write' | 'admin' => {
    if (actions.includes('admin')) return 'admin';
    if (actions.some(action => ['create', 'update', 'delete', 'approve', 'assign'].includes(action))) return 'write';
    if (actions.includes('view')) return 'read';
    return 'none';
  },

  getLevelColor: (level: 'none' | 'read' | 'write' | 'admin'): string => {
    switch (level) {
      case 'none':
        return 'text-gray-600 bg-gray-100';
      case 'read':
        return 'text-blue-600 bg-blue-100';
      case 'write':
        return 'text-green-600 bg-green-100';
      case 'admin':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  },

  validateRolePermissions: (permissions: Record<string, PermissionAction[]>): string[] => {
    const errors: string[] = [];
    
    // Check for required view permissions
    const requiredViewResources = ['users', 'departments', 'teams'];
    requiredViewResources.forEach(resource => {
      if (!permissions[resource]?.includes('view')) {
        errors.push(`${settingsApi.getResourceDisplayName(resource)} view permission is required`);
      }
    });
    
    // Check for logical consistency
    Object.entries(permissions).forEach(([resource, actions]) => {
      if (actions.includes('admin') && actions.length > 1) {
        errors.push(`${settingsApi.getResourceDisplayName(resource)} admin permission should not be combined with other permissions`);
      }
      
      if (['create', 'update', 'delete'].some(action => actions.includes(action as PermissionAction)) && !actions.includes('view')) {
        errors.push(`${settingsApi.getResourceDisplayName(resource)} write permissions require view permission`);
      }
    });
    
    return errors;
  },
};
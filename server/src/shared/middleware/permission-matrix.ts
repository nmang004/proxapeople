/**
 * Permission Matrix for ProxaPeople HR System
 * 
 * This file defines all resources, actions, and role-based permissions
 * for the RBAC system. It serves as the source of truth for authorization.
 */

export interface ResourceDefinition {
  name: string;
  displayName: string;
  description: string;
  actions: string[];
}

export interface RolePermission {
  role: string;
  resource: string;
  actions: string[];
}

/**
 * All available resources in the system
 */
export const RESOURCES: ResourceDefinition[] = [
  {
    name: 'users',
    displayName: 'User Management',
    description: 'Manage user accounts, profiles, and access',
    actions: ['view', 'create', 'update', 'delete', 'admin']
  },
  {
    name: 'departments',
    displayName: 'Department Management',
    description: 'Manage organizational departments',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    name: 'teams',
    displayName: 'Team Management',
    description: 'Manage teams within departments',
    actions: ['view', 'create', 'update', 'delete', 'assign']
  },
  {
    name: 'performance_reviews',
    displayName: 'Performance Reviews',
    description: 'Manage performance review cycles and evaluations',
    actions: ['view', 'create', 'update', 'delete', 'approve', 'assign']
  },
  {
    name: 'goals',
    displayName: 'Goal Management',
    description: 'Manage individual and team goals',
    actions: ['view', 'create', 'update', 'delete', 'assign']
  },
  {
    name: 'meetings',
    displayName: '1:1 Meetings',
    description: 'Schedule and manage one-on-one meetings',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    name: 'surveys',
    displayName: 'Survey Management',
    description: 'Create and manage employee surveys',
    actions: ['view', 'create', 'update', 'delete', 'assign']
  },
  {
    name: 'analytics',
    displayName: 'Analytics & Reporting',
    description: 'Access analytics dashboards and reports',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    name: 'feedback',
    displayName: 'Feedback System',
    description: 'Give and receive feedback',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    name: 'settings',
    displayName: 'System Settings',
    description: 'Configure system settings and permissions',
    actions: ['view', 'update', 'admin']
  }
];

/**
 * Role-based permission assignments
 * Higher privilege roles inherit permissions from lower privilege roles
 */
export const ROLE_PERMISSIONS: RolePermission[] = [
  // Employee permissions (base level)
  {
    role: 'employee',
    resource: 'users',
    actions: ['view'] // Can view basic user directory
  },
  {
    role: 'employee',
    resource: 'departments',
    actions: ['view'] // Can view department structure
  },
  {
    role: 'employee',
    resource: 'teams',
    actions: ['view'] // Can view team structure
  },
  {
    role: 'employee',
    resource: 'performance_reviews',
    actions: ['view', 'update'] // Can view and update own reviews
  },
  {
    role: 'employee',
    resource: 'goals',
    actions: ['view', 'create', 'update'] // Can manage own goals
  },
  {
    role: 'employee',
    resource: 'meetings',
    actions: ['view', 'create', 'update'] // Can schedule meetings with manager
  },
  {
    role: 'employee',
    resource: 'surveys',
    actions: ['view', 'update'] // Can participate in surveys
  },
  {
    role: 'employee',
    resource: 'feedback',
    actions: ['view', 'create', 'update'] // Can give/receive feedback
  },

  // Manager permissions (includes employee permissions + team management)
  {
    role: 'manager',
    resource: 'users',
    actions: ['view', 'update'] // Can view and update team members
  },
  {
    role: 'manager',
    resource: 'teams',
    actions: ['view', 'update'] // Can manage own team
  },
  {
    role: 'manager',
    resource: 'performance_reviews',
    actions: ['view', 'create', 'update', 'approve', 'assign'] // Full review management for team
  },
  {
    role: 'manager',
    resource: 'goals',
    actions: ['view', 'create', 'update', 'assign'] // Can manage team goals
  },
  {
    role: 'manager',
    resource: 'meetings',
    actions: ['view', 'create', 'update', 'delete'] // Full meeting management
  },
  {
    role: 'manager',
    resource: 'analytics',
    actions: ['view'] // Can view team analytics
  },
  {
    role: 'manager',
    resource: 'feedback',
    actions: ['view', 'create', 'update', 'delete'] // Full feedback management for team
  },

  // HR permissions (includes manager permissions + organization-wide access)
  {
    role: 'hr',
    resource: 'users',
    actions: ['view', 'create', 'update', 'delete'] // Full user management
  },
  {
    role: 'hr',
    resource: 'departments',
    actions: ['view', 'create', 'update', 'delete'] // Full department management
  },
  {
    role: 'hr',
    resource: 'teams',
    actions: ['view', 'create', 'update', 'delete', 'assign'] // Full team management
  },
  {
    role: 'hr',
    resource: 'performance_reviews',
    actions: ['view', 'create', 'update', 'delete', 'approve', 'assign'] // Full review management
  },
  {
    role: 'hr',
    resource: 'goals',
    actions: ['view', 'create', 'update', 'delete', 'assign'] // Full goal management
  },
  {
    role: 'hr',
    resource: 'surveys',
    actions: ['view', 'create', 'update', 'delete', 'assign'] // Full survey management
  },
  {
    role: 'hr',
    resource: 'analytics',
    actions: ['view', 'create', 'update'] // Advanced analytics access
  },
  {
    role: 'hr',
    resource: 'settings',
    actions: ['view', 'update'] // Can modify HR-related settings
  },

  // Admin permissions (includes all permissions)
  {
    role: 'admin',
    resource: 'users',
    actions: ['view', 'create', 'update', 'delete', 'admin'] // Full user administration
  },
  {
    role: 'admin',
    resource: 'departments',
    actions: ['view', 'create', 'update', 'delete'] // Full department control
  },
  {
    role: 'admin',
    resource: 'teams',
    actions: ['view', 'create', 'update', 'delete', 'assign'] // Full team control
  },
  {
    role: 'admin',
    resource: 'performance_reviews',
    actions: ['view', 'create', 'update', 'delete', 'approve', 'assign'] // Full review control
  },
  {
    role: 'admin',
    resource: 'goals',
    actions: ['view', 'create', 'update', 'delete', 'assign'] // Full goal control
  },
  {
    role: 'admin',
    resource: 'meetings',
    actions: ['view', 'create', 'update', 'delete'] // Full meeting control
  },
  {
    role: 'admin',
    resource: 'surveys',
    actions: ['view', 'create', 'update', 'delete', 'assign'] // Full survey control
  },
  {
    role: 'admin',
    resource: 'analytics',
    actions: ['view', 'create', 'update', 'delete'] // Full analytics control
  },
  {
    role: 'admin',
    resource: 'feedback',
    actions: ['view', 'create', 'update', 'delete'] // Full feedback control
  },
  {
    role: 'admin',
    resource: 'settings',
    actions: ['view', 'update', 'admin'] // Full system administration
  }
];

/**
 * Role hierarchy for inheritance
 * Higher roles inherit permissions from lower roles
 */
export const ROLE_HIERARCHY: Record<string, string[]> = {
  'employee': [], // Base role, no inheritance
  'manager': ['employee'], // Inherits from employee
  'hr': ['employee', 'manager'], // Inherits from employee and manager
  'admin': ['employee', 'manager', 'hr'] // Inherits from all roles
};

/**
 * Helper function to get all permissions for a role (including inherited)
 */
export function getAllRolePermissions(role: string): RolePermission[] {
  const directPermissions = ROLE_PERMISSIONS.filter(p => p.role === role);
  const inheritedRoles = ROLE_HIERARCHY[role] || [];
  
  const inheritedPermissions = inheritedRoles.flatMap(inheritedRole =>
    ROLE_PERMISSIONS.filter(p => p.role === inheritedRole)
  );

  // Merge permissions, with direct permissions taking precedence
  const permissionMap = new Map<string, string[]>();
  
  // Add inherited permissions first
  for (const perm of inheritedPermissions) {
    const key = `${perm.resource}`;
    const existing = permissionMap.get(key) || [];
    permissionMap.set(key, Array.from(new Set([...existing, ...perm.actions])));
  }
  
  // Add direct permissions (override inherited)
  for (const perm of directPermissions) {
    const key = `${perm.resource}`;
    const existing = permissionMap.get(key) || [];
    permissionMap.set(key, Array.from(new Set([...existing, ...perm.actions])));
  }
  
  // Convert back to RolePermission format
  return Array.from(permissionMap.entries()).map(([resource, actions]) => ({
    role,
    resource,
    actions
  }));
}

/**
 * Check if a role has permission for a specific resource and action
 */
export function hasPermission(role: string, resource: string, action: string): boolean {
  const rolePermissions = getAllRolePermissions(role);
  const resourcePermission = rolePermissions.find(p => p.resource === resource);
  return resourcePermission?.actions.includes(action) || false;
}
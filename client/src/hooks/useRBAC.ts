// Placeholder RBAC hooks - these should be implemented with actual backend integration
// For now, providing type-safe stubs to resolve TypeScript errors

export interface Permission {
  id: number;
  name: string;
  action: string;
  resource: string;
}

export interface Resource {
  id: number;
  name: string;
  description: string;
}

export interface UserPermission {
  id: number;
  userId: number;
  permissionId: number;
  permission: Permission;
}

export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  permission: Permission;
}

// Placeholder hooks that return empty arrays to fix TypeScript errors
export function usePermissions() {
  return {
    data: [] as Permission[],
    isLoading: false,
    error: null
  };
}

export function useResources() {
  return {
    data: [] as Resource[],
    isLoading: false,
    error: null
  };
}

export function useUserPermissions(userId?: number) {
  return {
    data: [] as UserPermission[],
    isLoading: false,
    error: null
  };
}

export function useRolePermissions(roleId?: number) {
  return {
    data: [] as RolePermission[],
    isLoading: false,
    error: null
  };
}

export function useAssignPermissionToUser() {
  return {
    mutate: (data: { userId: number; permissionId: number }) => {
      console.log('TODO: Implement assign permission to user', data);
    },
    isLoading: false,
    error: null
  };
}

export function useRemoveUserPermission() {
  return {
    mutate: (data: { userId: number; permissionId: number }) => {
      console.log('TODO: Implement remove user permission', data);
    },
    isLoading: false,
    error: null
  };
}

export function useAssignPermissionToRole() {
  return {
    mutate: (data: { roleId: number; permissionId: number }) => {
      console.log('TODO: Implement assign permission to role', data);
    },
    isLoading: false,
    error: null
  };
}

export function useRemoveRolePermission() {
  return {
    mutate: (data: { roleId: number; permissionId: number }) => {
      console.log('TODO: Implement remove role permission', data);
    },
    isLoading: false,
    error: null
  };
}

export function useCreateResource() {
  return {
    mutate: (data: { name: string; description: string }) => {
      console.log('TODO: Implement create resource', data);
    },
    isLoading: false,
    error: null
  };
}

export function useUpdateResource() {
  return {
    mutate: (data: { id: number; name: string; description: string }) => {
      console.log('TODO: Implement update resource', data);
    },
    isLoading: false,
    error: null
  };
}

export function useDeleteResource() {
  return {
    mutate: (id: number) => {
      console.log('TODO: Implement delete resource', id);
    },
    isLoading: false,
    error: null
  };
}

export function useResourcePermissions(resourceId?: number) {
  return {
    data: [] as Permission[],
    isLoading: false,
    error: null
  };
}

export function useCreatePermission() {
  return {
    mutate: (data: { name: string; action: string; resource: string }) => {
      console.log('TODO: Implement create permission', data);
    },
    isLoading: false,
    error: null
  };
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Types for our RBAC system
export interface Resource {
  id: number;
  name: string;
  displayName: string;
  description?: string;
}

export interface Permission {
  id: number;
  resourceId: number;
  action: 'view' | 'create' | 'update' | 'delete' | 'approve' | 'assign' | 'admin';
  description: string;
}

export interface RolePermission {
  id: number;
  role: 'admin' | 'manager' | 'employee' | 'hr';
  permissionId: number;
}

export interface UserPermission {
  id: number;
  userId: number;
  permissionId: number;
  granted: boolean;
  grantedBy?: number;
  grantedAt?: Date;
  expiresAt?: Date;
}

export interface PermissionWithResource extends Permission {
  resource: Resource;
}

// Custom hooks for working with resources
export function useResources() {
  return useQuery({
    queryKey: ['/api/rbac/resources'],
  });
}

export function useResource(id: number) {
  return useQuery({
    queryKey: ['/api/rbac/resources', id],
    enabled: !!id,
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (resource: Omit<Resource, 'id'>) => 
      apiRequest('POST', '/api/rbac/resources', resource),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rbac/resources'] });
    }
  });
}

// Custom hooks for working with permissions
export function usePermissions() {
  return useQuery({
    queryKey: ['/api/rbac/permissions'],
  });
}

export function useResourcePermissions(resourceId: number) {
  return useQuery({
    queryKey: ['/api/rbac/resources', resourceId, 'permissions'],
    enabled: !!resourceId,
  });
}

export function useCreatePermission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (permission: Omit<Permission, 'id'>) => 
      apiRequest('POST', '/api/rbac/permissions', permission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rbac/permissions'] });
    }
  });
}

// Custom hooks for working with role permissions
export function useRolePermissions(role: string) {
  return useQuery({
    queryKey: ['/api/rbac/roles', role, 'permissions'],
    enabled: !!role,
  });
}

export function useAssignPermissionToRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (rolePermission: Omit<RolePermission, 'id'>) => 
      apiRequest('POST', '/api/rbac/role-permissions', rolePermission),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/rbac/roles', variables.role, 'permissions'] });
    }
  });
}

export function useRemoveRolePermission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => 
      apiRequest('DELETE', `/api/rbac/role-permissions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rbac/roles'] });
    }
  });
}

// Custom hooks for working with user permissions
export function useUserPermissions(userId: number) {
  return useQuery({
    queryKey: ['/api/rbac/users', userId, 'permissions'],
    enabled: !!userId,
  });
}

export function useAssignPermissionToUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userPermission: Omit<UserPermission, 'id'>) => 
      apiRequest('POST', '/api/rbac/user-permissions', userPermission),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/rbac/users', variables.userId, 'permissions'] });
    }
  });
}

export function useRemoveUserPermission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => 
      apiRequest('DELETE', `/api/rbac/user-permissions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rbac/users'] });
    }
  });
}

// Custom hook to check if current user has permission
export function useCheckPermission(resourceName: string, action: string) {
  return useQuery({
    queryKey: ['/api/rbac/check-my-permission', resourceName, action],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/rbac/check-my-permission', { resourceName, action });
      return await response.json();
    },
    select: (data) => data.hasPermission,
  });
}
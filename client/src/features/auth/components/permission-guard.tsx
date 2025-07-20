import React, { ReactNode, useState, useEffect } from 'react';
import { usePermissions } from '@/contexts/permissions-context';
import { useAuthStore } from '@/app/store/auth';
import { useAuth } from '../hooks/useAuth';

interface PermissionGuardProps {
  resource: string;
  action: string;
  children: ReactNode;
  fallback?: ReactNode;
  serverCheck?: boolean; // Whether to do server-side permission check
}

/**
 * Component that conditionally renders children based on user permissions
 */
export function PermissionGuard({ 
  resource, 
  action, 
  children, 
  fallback = null,
  serverCheck = false 
}: PermissionGuardProps) {
  const { hasPermission, checkPermission, isLoading } = usePermissions();
  const { isAuthenticated } = useAuthStore();
  const [hasServerPermission, setHasServerPermission] = useState<boolean | null>(null);
  const [isCheckingServer, setIsCheckingServer] = useState(false);

  // Perform server-side permission check if requested
  useEffect(() => {
    if (serverCheck && isAuthenticated && !isLoading) {
      setIsCheckingServer(true);
      checkPermission(resource, action)
        .then(setHasServerPermission)
        .finally(() => setIsCheckingServer(false));
    }
  }, [serverCheck, isAuthenticated, isLoading, resource, action, checkPermission]);

  // Don't render anything while loading
  if (isLoading || (serverCheck && isCheckingServer)) {
    return null;
  }

  // Not authenticated - don't show protected content
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Use server check result if available, otherwise use client check
  const allowed = serverCheck ? hasServerPermission : hasPermission(resource, action);

  return allowed ? <>{children}</> : <>{fallback}</>;
}

interface PermissionButtonProps {
  resource: string;
  action: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

/**
 * Button component that's only visible/enabled if user has permission
 */
export function PermissionButton({
  resource,
  action,
  children,
  className,
  onClick,
  disabled = false,
  variant = 'default',
  size = 'default',
}: PermissionButtonProps) {
  const { hasPermission } = usePermissions();
  const { isAuthenticated } = useAuthStore();

  const allowed = isAuthenticated && hasPermission(resource, action);

  if (!allowed) {
    return null;
  }

  // Import Button component dynamically to avoid circular imports
  const Button = React.lazy(() => import('@/components/ui/button').then(m => ({ default: m.Button })));

  return (
    <React.Suspense fallback={null}>
      <Button
        className={className}
        onClick={onClick}
        disabled={disabled}
        variant={variant}
        size={size}
      >
        {children}
      </Button>
    </React.Suspense>
  );
}

interface ConditionalPermissionProps {
  conditions: Array<{ resource: string; action: string }>;
  mode?: 'any' | 'all'; // Whether user needs ANY or ALL of the permissions
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders based on multiple permissions
 */
export function ConditionalPermission({
  conditions,
  mode = 'any',
  children,
  fallback = null,
}: ConditionalPermissionProps) {
  const { hasPermission } = usePermissions();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  const allowed = mode === 'any'
    ? conditions.some(({ resource, action }) => hasPermission(resource, action))
    : conditions.every(({ resource, action }) => hasPermission(resource, action));

  return allowed ? <>{children}</> : <>{fallback}</>;
}

interface RoleGuardProps {
  roles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders based on user role
 */
export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  const allowed = roles.includes(user.role);
  return allowed ? <>{children}</> : <>{fallback}</>;
}

// Hook for using permissions in components
export function usePermissionCheck() {
  const { hasPermission, checkPermission } = usePermissions();
  const { isAuthenticated, user } = useAuth();

  return {
    hasPermission: (resource: string, action: string) => {
      return isAuthenticated && hasPermission(resource, action);
    },
    checkPermission: async (resource: string, action: string) => {
      if (!isAuthenticated) return false;
      return await checkPermission(resource, action);
    },
    hasRole: (role: string) => {
      return isAuthenticated && user?.role === role;
    },
    hasAnyRole: (roles: string[]) => {
      return isAuthenticated && user && roles.includes(user.role);
    },
    isAdmin: () => {
      return isAuthenticated && user?.role === 'admin';
    },
    isHR: () => {
      return isAuthenticated && (user?.role === 'hr' || user?.role === 'admin');
    },
    isManager: () => {
      return isAuthenticated && ['manager', 'hr', 'admin'].includes(user?.role || '');
    },
  };
}
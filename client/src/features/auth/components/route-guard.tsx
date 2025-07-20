import React, { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '@/app/store/auth';
import { usePermissionsStore } from '@/app/store/permissions';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRoles?: string[];
  fallbackUrl?: string;
  onNavigate?: (url: string) => void;
}

export function RouteGuard({
  children,
  requireAuth = true,
  requiredRoles = [],
  fallbackUrl = '/login',
  onNavigate = () => {},
}: RouteGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  
  console.log("🔐 RouteGuard: Starting with", {
    requireAuth,
    isAuthenticated,
    isLoading,
    user: user ? `${user.firstName} ${user.lastName}` : 'null',
    fallbackUrl,
    requiredRoles
  });

  // Show loading spinner while checking authentication status
  if (isLoading) {
    console.log("🔐 RouteGuard: Showing loading spinner");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    console.log("🔐 RouteGuard: User not authenticated, redirecting to", fallbackUrl);
    onNavigate(fallbackUrl);
    return null;
  }

  // Check role requirements
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this page. Required roles: {requiredRoles.join(', ')}.
            </p>
            <p className="text-sm text-muted-foreground">
              Your current role: <span className="font-medium">{user.role}</span>
            </p>
          </div>
        </div>
      );
    }
  }

  console.log("🔐 RouteGuard: All checks passed, rendering children");
  return <>{children}</>;
}

// Convenience components for common use cases
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <RouteGuard requiredRoles={['admin']}>
      {children}
    </RouteGuard>
  );
}

export function HRRoute({ children }: { children: ReactNode }) {
  return (
    <RouteGuard requiredRoles={['admin', 'hr']}>
      {children}
    </RouteGuard>
  );
}

export function ManagerRoute({ children }: { children: ReactNode }) {
  return (
    <RouteGuard requiredRoles={['admin', 'hr', 'manager']}>
      {children}
    </RouteGuard>
  );
}

export function ProtectedRoute({ children, onNavigate }: { children: ReactNode; onNavigate?: (url: string) => void }) {
  return (
    <RouteGuard requireAuth={true} onNavigate={onNavigate}>
      {children}
    </RouteGuard>
  );
}

// Permission-based route guards
interface PermissionRouteProps {
  children: ReactNode;
  resource: string;
  action: string;
}

export function PermissionRoute({ children, resource, action }: PermissionRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const { hasPermission, checkPermission } = usePermissionsStore();
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [hasRequiredPermission, setHasRequiredPermission] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // First check cached permission
      const cachedResult = hasPermission(resource, action);
      if (cachedResult !== undefined) {
        setHasRequiredPermission(cachedResult);
        setPermissionChecked(true);
        return;
      }

      // If not cached, check via API
      checkPermission(resource, action)
        .then((result) => {
          setHasRequiredPermission(result);
          setPermissionChecked(true);
        })
        .catch(() => {
          setHasRequiredPermission(false);
          setPermissionChecked(true);
        });
    }
  }, [isAuthenticated, isLoading, user, resource, action, hasPermission, checkPermission]);

  // Show loading spinner while checking
  if (isLoading || !permissionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (!isAuthenticated) {
    console.log("Permission route redirecting to login");
    window.location.href = '/login';
    return null;
  }

  // Check permission requirement
  if (!hasRequiredPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access this page. Required permission: {action} on {resource}.
          </p>
          <p className="text-sm text-muted-foreground">
            Your current role: <span className="font-medium">{user?.role}</span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
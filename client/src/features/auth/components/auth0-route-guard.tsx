import React, { ReactNode } from 'react';
import { useAuth } from '@/app/store/auth0-store';
import { Loader2 } from 'lucide-react';

interface Auth0RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRoles?: string[];
  fallbackUrl?: string;
  onNavigate?: (url: string) => void;
}

export function Auth0RouteGuard({
  children,
  requireAuth = true,
  requiredRoles = [],
  fallbackUrl = '/login',
  onNavigate = () => {},
}: Auth0RouteGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  console.log("🔐 Auth0RouteGuard: Starting with", {
    requireAuth,
    isAuthenticated,
    isLoading,
    user: user ? `${user.firstName} ${user.lastName}` : 'null',
    fallbackUrl,
    requiredRoles
  });

  // Show loading spinner while checking authentication status
  if (isLoading) {
    console.log("🔐 Auth0RouteGuard: Showing loading spinner");
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
    console.log("🔐 Auth0RouteGuard: User not authenticated, redirecting to", fallbackUrl);
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

  console.log("🔐 Auth0RouteGuard: All checks passed, rendering children");
  return <>{children}</>;
}

// Convenience components for common use cases
export function Auth0AdminRoute({ children }: { children: ReactNode }) {
  return (
    <Auth0RouteGuard requiredRoles={['admin']}>
      {children}
    </Auth0RouteGuard>
  );
}

export function Auth0HRRoute({ children }: { children: ReactNode }) {
  return (
    <Auth0RouteGuard requiredRoles={['admin', 'hr']}>
      {children}
    </Auth0RouteGuard>
  );
}

export function Auth0ManagerRoute({ children }: { children: ReactNode }) {
  return (
    <Auth0RouteGuard requiredRoles={['admin', 'hr', 'manager']}>
      {children}
    </Auth0RouteGuard>
  );
}

export function Auth0ProtectedRoute({ children, onNavigate }: { children: ReactNode; onNavigate?: (url: string) => void }) {
  return (
    <Auth0RouteGuard requireAuth={true} onNavigate={onNavigate}>
      {children}
    </Auth0RouteGuard>
  );
}
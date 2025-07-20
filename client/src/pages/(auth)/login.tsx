import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/app/store/auth';
import { LoginForm } from '@/features/auth/components/login-form';
import { RegisterForm } from '@/features/auth/components/register-form';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';
import { Loader2 } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot-password';

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [mode, setMode] = useState<AuthMode>('login');
  const [, setLocation] = useLocation();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if we're redirecting
  if (isAuthenticated) {
    return null;
  }

  const handleAuthSuccess = () => {
    // The auth context will handle the redirect via the Navigate above
    // when isAuthenticated becomes true
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        {mode === 'login' ? (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setMode('register')}
            onSwitchToForgotPassword={() => setMode('forgot-password')}
          />
        ) : mode === 'register' ? (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setMode('login')}
          />
        ) : (
          <ForgotPasswordForm
            onBackToLogin={() => setMode('login')}
          />
        )}
      </div>
    </div>
  );
}
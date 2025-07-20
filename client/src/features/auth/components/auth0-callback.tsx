import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';

export function Auth0Callback() {
  const { isLoading, error, isAuthenticated } = useAuth0();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (error) {
        console.error('Auth0 callback error:', error);
        setLocation('/login');
      } else if (isAuthenticated) {
        // Redirect to dashboard after successful authentication
        setLocation('/dashboard');
      }
    }
  }, [isLoading, error, isAuthenticated, setLocation]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button 
            onClick={() => setLocation('/login')}
            className="text-blue-600 hover:underline"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Completing Sign In</h1>
        <p className="text-gray-600">Please wait while we set up your account...</p>
      </div>
    </div>
  );
}
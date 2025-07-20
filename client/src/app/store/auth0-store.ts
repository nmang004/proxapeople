import React from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useAuth0 } from '@auth0/auth0-react';

// User interface matching the backend
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  jobTitle: string;
  department: string;
  profileImage?: string | null;
  hireDate?: string | null;
}

interface Auth0Store {
  // State
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  syncUserProfile: (auth0User: any, accessToken: string) => Promise<void>;
}

// Create the Auth0 store
export const useAuth0Store = create<Auth0Store>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user: User | null) => set({ user }),
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      setError: (error: string | null) => set({ error, isLoading: false }),
      
      clearError: () => set({ error: null }),

      // Sync user profile with backend
      syncUserProfile: async (auth0User: any, accessToken: string) => {
        const { setLoading, setError, setUser } = get();
        
        try {
          setLoading(true);
          setError(null);

          // Try to get existing user from backend
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else if (response.status === 404) {
            // User doesn't exist in our system, create them
            const newUserData = {
              email: auth0User.email,
              firstName: auth0User.given_name || auth0User.name?.split(' ')[0] || 'Unknown',
              lastName: auth0User.family_name || auth0User.name?.split(' ').slice(1).join(' ') || 'User',
              role: 'employee' as const, // Default role
              jobTitle: 'New Employee',
              department: 'General',
            };

            const createResponse = await fetch('/api/auth/sync-user', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newUserData),
            });

            if (createResponse.ok) {
              const data = await createResponse.json();
              setUser(data.user);
            } else {
              throw new Error('Failed to create user profile');
            }
          } else {
            throw new Error('Failed to fetch user profile');
          }
        } catch (error) {
          console.error('Failed to sync user profile:', error);
          setError(error instanceof Error ? error.message : 'Failed to sync user profile');
          
          // Fallback: create a basic user object from Auth0 data
          const fallbackUser: User = {
            id: 0, // Temporary ID
            email: auth0User.email,
            firstName: auth0User.given_name || auth0User.name?.split(' ')[0] || 'Unknown',
            lastName: auth0User.family_name || auth0User.name?.split(' ').slice(1).join(' ') || 'User',
            role: 'employee',
            jobTitle: 'New Employee',
            department: 'General',
          };
          setUser(fallbackUser);
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: 'auth0-store',
    }
  )
);

// Custom hook that combines Auth0 with our store
export function useAuth() {
  const {
    isAuthenticated,
    isLoading: auth0Loading,
    user: auth0User,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();
  
  const {
    user,
    isLoading: storeLoading,
    error,
    setUser,
    setLoading,
    setError,
    clearError,
    syncUserProfile,
  } = useAuth0Store();

  // Combined loading state
  const isLoading = auth0Loading || storeLoading;

  // Login function
  const login = () => {
    clearError();
    loginWithRedirect();
  };

  // Logout function
  const logout = () => {
    setUser(null);
    clearError();
    auth0Logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      } 
    });
  };

  // Initialize user profile when Auth0 authentication is complete
  React.useEffect(() => {
    if (isAuthenticated && auth0User && !user && !storeLoading) {
      getAccessTokenSilently()
        .then(accessToken => syncUserProfile(auth0User, accessToken))
        .catch(error => {
          console.error('Failed to get access token:', error);
          setError('Failed to initialize user session');
        });
    }
  }, [isAuthenticated, auth0User, user, storeLoading, getAccessTokenSilently, syncUserProfile, setError]);

  return {
    // State
    isAuthenticated,
    isLoading,
    user,
    error,
    
    // Actions
    login,
    logout,
    clearError,
    
    // Auth0 specific
    getAccessToken: getAccessTokenSilently,
  };
}
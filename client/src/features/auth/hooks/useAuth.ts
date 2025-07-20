import { useAuthStore } from '@/app/store/auth';

/**
 * Hook to access authentication state and actions
 * Provides a clean interface to the auth store
 */
export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
    clearError,
    loginDemo
  } = useAuthStore();

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    refreshToken,
    updateUser,
    clearError,
    loginDemo,
  };
}
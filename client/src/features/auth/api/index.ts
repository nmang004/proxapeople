// Re-export auth endpoints and hooks for this feature
export { auth } from '../../../shared/api/endpoints';

// Re-export auth-specific hooks
export {
  useCurrentUser,
  useUserPermissions,
  useLogin,
  useRegister,
  useLogout,
  useForgotPassword,
  useResetPassword,
} from '../../../shared/api/hooks';

// Re-export auth-specific types
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../../../shared/api/types';

// Export a convenience object for auth API
export const authApi = {
  // Endpoints
  ...auth,
  
  // Helper functions specific to auth feature
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password: string): boolean => {
    return password.length >= 8;
  },

  formatUserDisplayName: (user: { firstName: string; lastName: string }): string => {
    return `${user.firstName} ${user.lastName}`;
  },

  getUserInitials: (user: { firstName: string; lastName: string }): string => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  },
};
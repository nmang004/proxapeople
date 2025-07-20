import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { api } from '../../shared/api';
import { ApiError } from '../../shared/api/client';

// Re-export types from the new API layer
export type { 
  User, 
  LoginRequest as LoginData,
  RegisterRequest as RegisterData 
} from '../../shared/api/types';

// Zustand doesn't persist User properly from the API types, so redefine locally
interface User {
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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  role?: 'admin' | 'hr' | 'manager' | 'employee';
}

interface AuthStore {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (user: User) => void;
  initializeAuth: () => Promise<void>;
}

// Storage utilities
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'proxapeople_access_token',
  REFRESH_TOKEN: 'proxapeople_refresh_token',
  USER: 'proxapeople_user',
} as const;

const storage = {
  get: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silently fail
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail
    }
  },
  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch {
      // Silently fail
    }
  },
};

// Create the auth store
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
    // Initial state
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Async utilities
    setLoading: (loading: boolean) =>
      set({ isLoading: loading }),

    setError: (error: string | null) =>
      set({ error, isLoading: false }),

    clearError: () =>
      set({ error: null }),

    // Auth actions
    login: async (email: string, password: string) => {
      const { setLoading, setError } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.auth.login.execute({ email, password });
        const { user, accessToken, refreshToken } = response;
        
        const tokens = { accessToken, refreshToken };
        
        // Update storage
        storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        storage.set(STORAGE_KEYS.USER, JSON.stringify(user));
        
        // Update state
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        storage.clear();
        const errorMessage = error instanceof ApiError 
          ? error.message 
          : error instanceof Error 
            ? error.message 
            : 'Login failed';
        setError(errorMessage);
        throw error;
      }
    },

    register: async (userData: RegisterData) => {
      const { setLoading, setError } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.auth.register.execute(userData);
        const { user, accessToken, refreshToken } = response;
        
        const tokens = { accessToken, refreshToken };
        
        // Update storage
        storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        storage.set(STORAGE_KEYS.USER, JSON.stringify(user));
        
        // Update state
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        storage.clear();
        const errorMessage = error instanceof ApiError 
          ? error.message 
          : error instanceof Error 
            ? error.message 
            : 'Registration failed';
        setError(errorMessage);
        throw error;
      }
    },

    logout: async () => {
      const { setLoading } = get();
      
      try {
        setLoading(true);
        await api.auth.logout.execute();
      } catch {
        // Ignore logout API errors, still clear local state
      } finally {
        storage.clear();
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    },

    refreshToken: async () => {
      const refreshToken = storage.get(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { setError, logout } = get();

      try {
        const response = await api.auth.refresh.execute({ refreshToken });
        const newTokens = {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        };
        
        // Update storage
        storage.set(STORAGE_KEYS.ACCESS_TOKEN, newTokens.accessToken);
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, newTokens.refreshToken);
        
        // Update state
        set({ tokens: newTokens });
      } catch (error) {
        // Refresh failed, logout user
        setError('Session expired. Please log in again.');
        await logout();
        throw error;
      }
    },

    updateUser: (user: User) => {
      storage.set(STORAGE_KEYS.USER, JSON.stringify(user));
      set({ user });
    },

    initializeAuth: async () => {
      const { setLoading, setError, refreshToken: refreshTokens } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        const accessToken = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = storage.get(STORAGE_KEYS.REFRESH_TOKEN);
        const userStr = storage.get(STORAGE_KEYS.USER);

        if (accessToken && refreshToken && userStr) {
          const user = JSON.parse(userStr);
          const tokens = { accessToken, refreshToken };
          
          // Verify token is still valid by fetching profile
          try {
            const profileResponse = await api.auth.me.execute();
            set({
              user: profileResponse.user,
              tokens,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch {
            // Token is invalid, try to refresh
            try {
              await refreshTokens();
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            } catch {
              // Refresh failed, clear everything
              storage.clear();
              set({
                user: null,
                tokens: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          }
        } else {
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        const errorMessage = error instanceof ApiError 
          ? error.message 
          : error instanceof Error 
            ? error.message 
            : 'Failed to initialize authentication';
        setError(errorMessage);
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    },
  }),
      {
        name: 'proxapeople-auth',
        partialize: (state) => {
          // Only persist non-transient state
          const { isLoading, error, ...persistedState } = state;
          return persistedState;
        },
      }
    ),
    { name: 'ProxaPeople Auth' }
  )
);
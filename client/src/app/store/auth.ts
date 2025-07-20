import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Define types locally to avoid circular dependencies
class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Zustand doesn't persist User properly from the API types, so redefine locally
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
  loginDemo: (userType?: 'admin' | 'hr' | 'manager' | 'employee') => Promise<void>;
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
      (set, get) => {
        console.log("🔑 AuthStore: Creating store with initial state");
        return {
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

    // Demo login bypass for testing
    loginDemo: async (userType: 'admin' | 'hr' | 'manager' | 'employee' = 'admin') => {
      const { setLoading, setError } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        // Call demo endpoint to get real JWT tokens
        const response = await fetch('/api/auth/demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userType })
        });
        
        if (!response.ok) throw new ApiError('Demo login failed');
        const data = await response.json();
        const { user, accessToken, refreshToken } = data;
        
        const tokens = { accessToken, refreshToken };
        
        // Store authentication state
        storage.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
        storage.set(STORAGE_KEYS.USER, JSON.stringify(user));
        
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        console.log(`🔑 Demo login successful for ${userType}:`, user);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Demo login failed');
        throw error;
      }
    },

    // Auth actions
    login: async (email: string, password: string) => {
      const { setLoading, setError, loginDemo } = get();
      
      // Check for demo credentials first
      const demoCredentials = {
        'admin@demo.com': 'admin',
        'hr@demo.com': 'hr123',
        'manager@demo.com': 'manager123',
        'employee@demo.com': 'employee123'
      };
      
      if (email in demoCredentials && password === demoCredentials[email as keyof typeof demoCredentials]) {
        const userType = email.split('@')[0] as 'admin' | 'hr' | 'manager' | 'employee';
        return loginDemo(userType);
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new ApiError('Login failed');
        const data = await response.json();
        const { user, accessToken, refreshToken } = data;
        
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
        
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        if (!response.ok) throw new ApiError('Registration failed');
        const data = await response.json();
        const { user, accessToken, refreshToken } = data;
        
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
        await fetch('/api/auth/logout', { method: 'POST' });
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
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        if (!response.ok) throw new ApiError('Token refresh failed');
        const data = await response.json();
        const newTokens = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
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
      
      console.log("🔑 AuthStore: Starting initializeAuth");
      try {
        setLoading(true);
        setError(null);
        
        const accessToken = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = storage.get(STORAGE_KEYS.REFRESH_TOKEN);
        const userStr = storage.get(STORAGE_KEYS.USER);

        console.log("🔑 AuthStore: Found tokens in storage", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasUser: !!userStr
        });

        if (accessToken && refreshToken && userStr) {
          const user = JSON.parse(userStr);
          const tokens = { accessToken, refreshToken };
          
          // Verify token is still valid by fetching profile
          try {
            const profileResponse = await fetch('/api/auth/me', {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (!profileResponse.ok) throw new ApiError('Profile fetch failed');
            const profileData = await profileResponse.json();
            set({
              user: profileData.user,
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
          console.log("🔑 AuthStore: No tokens found, user not authenticated");
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
    };
  },
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
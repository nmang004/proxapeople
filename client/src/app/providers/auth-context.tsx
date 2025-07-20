import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  jobTitle: string;
  department: string;
  profileImage?: string;
  hireDate?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (user: User) => void;
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

// API endpoints
const API_BASE = '/api';

// Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'proxapeople_access_token',
  REFRESH_TOKEN: 'proxapeople_refresh_token',
  USER: 'proxapeople_user',
} as const;

// Utility functions
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

// API client with automatic token handling
class AuthAPI {
  private async request(endpoint: string, options: RequestInit = {}) {
    const accessToken = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `Request failed: ${response.status}`);
    }

    return response.json();
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: RegisterData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }
}

const api = new AuthAPI();

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = storage.get(STORAGE_KEYS.REFRESH_TOKEN);
        const userStr = storage.get(STORAGE_KEYS.USER);

        if (accessToken && refreshToken && userStr) {
          const user = JSON.parse(userStr);
          const tokens = { accessToken, refreshToken };
          
          // Verify token is still valid by fetching profile
          try {
            const profileResponse = await api.getProfile();
            setState({
              user: profileResponse.user,
              tokens,
              isLoading: false,
              isAuthenticated: true,
            });
          } catch {
            // Token is invalid, try to refresh
            try {
              const refreshResponse = await api.refreshToken(refreshToken);
              const newTokens = {
                accessToken: refreshResponse.accessToken,
                refreshToken: refreshResponse.refreshToken,
              };
              
              // Update storage
              storage.set(STORAGE_KEYS.ACCESS_TOKEN, newTokens.accessToken);
              storage.set(STORAGE_KEYS.REFRESH_TOKEN, newTokens.refreshToken);
              
              setState({
                user,
                tokens: newTokens,
                isLoading: false,
                isAuthenticated: true,
              });
            } catch {
              // Refresh failed, clear everything
              storage.clear();
              setState({
                user: null,
                tokens: null,
                isLoading: false,
                isAuthenticated: false,
              });
            }
          }
        } else {
          setState({
            user: null,
            tokens: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setState({
          user: null,
          tokens: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      const { user, accessToken, refreshToken } = response;
      
      const tokens = { accessToken, refreshToken };
      
      // Update storage
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      storage.set(STORAGE_KEYS.USER, JSON.stringify(user));
      
      // Update state
      setState({
        user,
        tokens,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      // Clear any partial data
      storage.clear();
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.register(userData);
      const { user, accessToken, refreshToken } = response;
      
      const tokens = { accessToken, refreshToken };
      
      // Update storage
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      storage.set(STORAGE_KEYS.USER, JSON.stringify(user));
      
      // Update state
      setState({
        user,
        tokens,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      // Clear any partial data
      storage.clear();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore logout API errors, still clear local state
    } finally {
      storage.clear();
      setState({
        user: null,
        tokens: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const refreshTokens = async () => {
    const refreshToken = storage.get(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await api.refreshToken(refreshToken);
      const newTokens = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };
      
      // Update storage
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, newTokens.accessToken);
      storage.set(STORAGE_KEYS.REFRESH_TOKEN, newTokens.refreshToken);
      
      // Update state
      setState(prev => ({
        ...prev,
        tokens: newTokens,
      }));
    } catch (error) {
      // Refresh failed, logout user
      logout();
      throw error;
    }
  };

  const updateUser = (user: User) => {
    storage.set(STORAGE_KEYS.USER, JSON.stringify(user));
    setState(prev => ({
      ...prev,
      user,
    }));
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken: refreshTokens,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Store configuration utilities
export const createStore = <T>(
  storeName: string,
  storeCreator: (
    set: (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean | undefined) => void,
    get: () => T,
    api: any
  ) => T,
  options: {
    persist?: boolean;
    devtools?: boolean;
  } = {}
) => {
  const { persist: enablePersist = false, devtools: enableDevtools = true } = options;

  let store = storeCreator;

  // Add persistence if enabled
  if (enablePersist) {
    store = persist(store, {
      name: `proxapeople-${storeName}`,
      partialize: (state: any) => {
        // Remove transient state from persistence
        const { isLoading, error, ...persistedState } = state;
        return persistedState;
      },
    });
  }

  // Add devtools if enabled and in development
  if (enableDevtools && process.env.NODE_ENV === 'development') {
    store = devtools(store, { name: `ProxaPeople ${storeName}` });
  }

  return create(store);
};

// Common store types
export interface BaseState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Export store hooks for direct use
export { useAuthStore } from './auth';
export { useUserStore } from './user';
export { useUIStore } from './ui';
export { usePermissionsStore } from './permissions';

// Export convenience hooks
export * from './hooks';

// Store initialization
export const initializeStores = () => {
  // Initialize stores that need setup
  console.log('Initializing ProxaPeople stores...');
};
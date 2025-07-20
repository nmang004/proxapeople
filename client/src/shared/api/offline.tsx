import { useState, useEffect, useCallback, useRef } from 'react';

// Network status manager
export class NetworkStatusManager {
  private isOnline = navigator.onLine;
  private listeners: Array<(online: boolean) => void> = [];
  private retryQueue: Array<{
    id: string;
    request: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
    retries: number;
    maxRetries: number;
  }> = [];

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  private handleOnline = () => {
    this.isOnline = true;
    this.notifyListeners();
    this.processRetryQueue();
  };

  private handleOffline = () => {
    this.isOnline = false;
    this.notifyListeners();
  };

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  private async processRetryQueue() {
    if (!this.isOnline || this.retryQueue.length === 0) return;

    const queue = [...this.retryQueue];
    this.retryQueue = [];

    for (const item of queue) {
      try {
        const result = await item.request();
        item.resolve(result);
      } catch (error) {
        if (item.retries < item.maxRetries) {
          // Retry with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, item.retries), 30000);
          setTimeout(() => {
            this.retryQueue.push({
              ...item,
              retries: item.retries + 1,
            });
            this.processRetryQueue();
          }, delay);
        } else {
          item.reject(error);
        }
      }
    }
  }

  // Public API
  get online() {
    return this.isOnline;
  }

  subscribe(listener: (online: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  addToRetryQueue<T>(
    id: string,
    request: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.retryQueue.push({
        id,
        request,
        resolve,
        reject,
        retries: 0,
        maxRetries,
      });

      // If online, process immediately
      if (this.isOnline) {
        this.processRetryQueue();
      }
    });
  }

  removeFromRetryQueue(id: string) {
    this.retryQueue = this.retryQueue.filter(item => item.id !== id);
  }

  getQueueSize() {
    return this.retryQueue.length;
  }

  cleanup() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.listeners = [];
    this.retryQueue = [];
  }
}

// Global instance
export const networkStatusManager = new NetworkStatusManager();

// Hook for network status
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(networkStatusManager.online);
  const [queueSize, setQueueSize] = useState(networkStatusManager.getQueueSize());

  useEffect(() => {
    const unsubscribe = networkStatusManager.subscribe(setIsOnline);
    
    // Update queue size periodically
    const interval = setInterval(() => {
      setQueueSize(networkStatusManager.getQueueSize());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return { isOnline, queueSize };
}

// Hook for offline-aware requests
export function useOfflineRequest() {
  const addToQueue = useCallback(<T,>(
    id: string,
    request: () => Promise<T>,
    maxRetries?: number
  ) => {
    if (networkStatusManager.online) {
      return request();
    } else {
      return networkStatusManager.addToRetryQueue(id, request, maxRetries);
    }
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    networkStatusManager.removeFromRetryQueue(id);
  }, []);

  return { addToQueue, removeFromQueue };
}

// Local storage queue for persistent offline actions
export class OfflineActionQueue {
  private storageKey = 'proxapeople_offline_actions';
  
  // Add action to persistent queue
  addAction(action: {
    id: string;
    type: string;
    data: any;
    timestamp: number;
    retries?: number;
  }) {
    const actions = this.getActions();
    actions.push(action);
    localStorage.setItem(this.storageKey, JSON.stringify(actions));
  }

  // Get all queued actions
  getActions(): Array<{
    id: string;
    type: string;
    data: any;
    timestamp: number;
    retries?: number;
  }> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Remove action from queue
  removeAction(id: string) {
    const actions = this.getActions().filter(action => action.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(actions));
  }

  // Clear all actions
  clearActions() {
    localStorage.removeItem(this.storageKey);
  }

  // Process queued actions when online
  async processActions(
    processor: (action: any) => Promise<void>
  ) {
    const actions = this.getActions();
    
    for (const action of actions) {
      try {
        await processor(action);
        this.removeAction(action.id);
      } catch (error) {
        console.error('Failed to process offline action:', action, error);
        
        // Increment retry count
        const retries = (action.retries || 0) + 1;
        if (retries < 3) {
          // Update retry count
          this.removeAction(action.id);
          this.addAction({ ...action, retries });
        } else {
          // Max retries reached, remove action
          this.removeAction(action.id);
        }
      }
    }
  }
}

// Global offline action queue
export const offlineActionQueue = new OfflineActionQueue();

// Hook for managing offline actions
export function useOfflineActions() {
  const [actions, setActions] = useState(offlineActionQueue.getActions());
  const { isOnline } = useNetworkStatus();

  // Refresh actions from storage
  const refreshActions = useCallback(() => {
    setActions(offlineActionQueue.getActions());
  }, []);

  // Add action to queue
  const addAction = useCallback((
    type: string,
    data: any,
    id?: string
  ) => {
    const action = {
      id: id || `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
    };
    
    offlineActionQueue.addAction(action);
    refreshActions();
    
    return action.id;
  }, [refreshActions]);

  // Remove action from queue
  const removeAction = useCallback((id: string) => {
    offlineActionQueue.removeAction(id);
    refreshActions();
  }, [refreshActions]);

  // Process all actions
  const processActions = useCallback(async (
    processor: (action: any) => Promise<void>
  ) => {
    await offlineActionQueue.processActions(processor);
    refreshActions();
  }, [refreshActions]);

  // Clear all actions
  const clearActions = useCallback(() => {
    offlineActionQueue.clearActions();
    refreshActions();
  }, [refreshActions]);

  // Auto-process when coming online
  useEffect(() => {
    if (isOnline && actions.length > 0) {
      // Auto-process with default processor that does nothing
      // The application should provide its own processor
      console.log('Device came online with pending actions:', actions);
    }
  }, [isOnline, actions]);

  return {
    actions,
    addAction,
    removeAction,
    processActions,
    clearActions,
    refreshActions,
  };
}

// Cache manager for offline data
export class OfflineCacheManager {
  private storagePrefix = 'proxapeople_cache_';
  private ttlSuffix = '_ttl';

  // Store data with TTL
  set(key: string, data: any, ttlMs: number = 5 * 60 * 1000) {
    try {
      const expiresAt = Date.now() + ttlMs;
      localStorage.setItem(this.storagePrefix + key, JSON.stringify(data));
      localStorage.setItem(this.storagePrefix + key + this.ttlSuffix, expiresAt.toString());
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  // Get data if not expired
  get(key: string): any | null {
    try {
      const ttlKey = this.storagePrefix + key + this.ttlSuffix;
      const expiresAt = localStorage.getItem(ttlKey);
      
      if (!expiresAt || Date.now() > parseInt(expiresAt, 10)) {
        this.remove(key);
        return null;
      }

      const data = localStorage.getItem(this.storagePrefix + key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to get cached data:', error);
      return null;
    }
  }

  // Remove cached data
  remove(key: string) {
    localStorage.removeItem(this.storagePrefix + key);
    localStorage.removeItem(this.storagePrefix + key + this.ttlSuffix);
  }

  // Clear all cached data
  clear() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.storagePrefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Get cache size
  getSize(): number {
    const keys = Object.keys(localStorage);
    return keys.filter(key => key.startsWith(this.storagePrefix)).length;
  }

  // Check if data exists and is valid
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

// Global cache manager
export const offlineCacheManager = new OfflineCacheManager();

// Hook for cached data
export function useOfflineCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs?: number,
  dependencies: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { isOnline } = useNetworkStatus();
  const fetchedRef = useRef(false);

  const fetchData = useCallback(async (useCache = true) => {
    if (useCache) {
      const cached = offlineCacheManager.get(key);
      if (cached) {
        setData(cached);
        return cached;
      }
    }

    if (!isOnline) {
      return data; // Return current data if offline
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      offlineCacheManager.set(key, result, ttlMs);
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttlMs, isOnline, data]);

  // Initial fetch
  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchData().catch(() => {
        // Error already handled in fetchData
      });
    }
  }, [fetchData]);

  // Refetch when dependencies change
  useEffect(() => {
    if (fetchedRef.current) {
      fetchData(false).catch(() => {
        // Error already handled in fetchData
      });
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(false),
    hasCache: offlineCacheManager.has(key),
  };
}

// Network status indicator component
export function NetworkStatusIndicator() {
  const { isOnline, queueSize } = useNetworkStatus();

  if (isOnline && queueSize === 0) {
    return null; // Don't show anything when online and no pending requests
  }

  return (
    <div className={`fixed top-4 right-4 z-50 px-3 py-2 rounded-md text-sm font-medium ${
      isOnline 
        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
        : 'bg-red-100 text-red-800 border border-red-300'
    }`}>
      {isOnline ? (
        <>
          <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
          {queueSize > 0 && `Syncing ${queueSize} request${queueSize === 1 ? '' : 's'}...`}
        </>
      ) : (
        <>
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          Offline
          {queueSize > 0 && ` • ${queueSize} pending`}
        </>
      )}
    </div>
  );
}
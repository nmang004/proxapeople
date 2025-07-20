import { useEffect, useRef, useCallback } from 'react';

// Request cancellation manager
export class RequestCancellation {
  private controllers = new Map<string, AbortController>();

  // Create a new abort controller for a request
  createController(requestId: string): AbortController {
    // Cancel any existing request with the same ID
    this.cancel(requestId);
    
    const controller = new AbortController();
    this.controllers.set(requestId, controller);
    
    return controller;
  }

  // Cancel a specific request
  cancel(requestId: string): void {
    const controller = this.controllers.get(requestId);
    if (controller) {
      controller.abort();
      this.controllers.delete(requestId);
    }
  }

  // Cancel all requests
  cancelAll(): void {
    this.controllers.forEach((controller, requestId) => {
      controller.abort();
    });
    this.controllers.clear();
  }

  // Check if a request is cancelled
  isCancelled(requestId: string): boolean {
    const controller = this.controllers.get(requestId);
    return controller?.signal.aborted ?? false;
  }

  // Clean up completed requests
  cleanup(requestId: string): void {
    this.controllers.delete(requestId);
  }

  // Get the signal for a request
  getSignal(requestId: string): AbortSignal | undefined {
    return this.controllers.get(requestId)?.signal;
  }
}

// Global instance
export const requestCancellation = new RequestCancellation();

// Hook for managing request cancellation in components
export function useRequestCancellation() {
  const cancellationRef = useRef(new RequestCancellation());

  // Cancel all requests when component unmounts
  useEffect(() => {
    return () => {
      cancellationRef.current.cancelAll();
    };
  }, []);

  const createController = useCallback((requestId: string) => {
    return cancellationRef.current.createController(requestId);
  }, []);

  const cancel = useCallback((requestId: string) => {
    cancellationRef.current.cancel(requestId);
  }, []);

  const cancelAll = useCallback(() => {
    cancellationRef.current.cancelAll();
  }, []);

  const isCancelled = useCallback((requestId: string) => {
    return cancellationRef.current.isCancelled(requestId);
  }, []);

  const cleanup = useCallback((requestId: string) => {
    cancellationRef.current.cleanup(requestId);
  }, []);

  return {
    createController,
    cancel,
    cancelAll,
    isCancelled,
    cleanup,
  };
}

// Hook for auto-cancelling requests based on dependencies
export function useAutoCancelRequest(
  requestId: string,
  dependencies: React.DependencyList = []
) {
  const { createController, cancel } = useRequestCancellation();
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel previous request if dependencies change
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Create new controller
    controllerRef.current = createController(requestId);

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, dependencies);

  return controllerRef.current?.signal;
}

// Utility for creating request IDs
export function createRequestId(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.join(':')}:${Date.now()}`;
}

// Hook for debounced requests with cancellation
export function useDebouncedRequest<T>(
  requestFn: (signal: AbortSignal) => Promise<T>,
  delay: number = 300,
  dependencies: React.DependencyList = []
) {
  const { createController } = useRequestCancellation();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const requestIdRef = useRef<string>();

  const execute = useCallback(() => {
    return new Promise<T>((resolve, reject) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Create new timeout
      timeoutRef.current = setTimeout(async () => {
        try {
          const requestId = createRequestId('debounced', Math.random().toString(36));
          requestIdRef.current = requestId;
          
          const controller = createController(requestId);
          const result = await requestFn(controller.signal);
          
          resolve(result);
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            // Request was cancelled, don't reject
            return;
          }
          reject(error);
        }
      }, delay);
    });
  }, [requestFn, delay, createController]);

  // Update dependencies
  useEffect(() => {
    // Dependencies changed, cancel current request
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, dependencies);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return execute;
}

// Request queue for managing concurrent requests
export class RequestQueue {
  private queue: Array<{
    id: string;
    execute: () => Promise<any>;
    priority: number;
  }> = [];
  private running = new Set<string>();
  private maxConcurrent: number;

  constructor(maxConcurrent: number = 3) {
    this.maxConcurrent = maxConcurrent;
  }

  // Add request to queue
  add<T>(
    id: string,
    requestFn: () => Promise<T>,
    priority: number = 0
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        id,
        execute: async () => {
          try {
            this.running.add(id);
            const result = await requestFn();
            resolve(result);
            return result;
          } catch (error) {
            reject(error);
            throw error;
          } finally {
            this.running.delete(id);
            this.processQueue();
          }
        },
        priority,
      });

      // Sort by priority (higher first)
      this.queue.sort((a, b) => b.priority - a.priority);
      
      this.processQueue();
    });
  }

  // Process the queue
  private processQueue(): void {
    if (this.running.size >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const next = this.queue.shift();
    if (next) {
      next.execute().catch(() => {
        // Error already handled in the promise
      });
    }
  }

  // Cancel a request
  cancel(id: string): void {
    const index = this.queue.findIndex(item => item.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
    }
  }

  // Get queue status
  getStatus() {
    return {
      queued: this.queue.length,
      running: this.running.size,
      total: this.queue.length + this.running.size,
    };
  }
}

// Global request queue
export const requestQueue = new RequestQueue();

// Hook for using the request queue
export function useRequestQueue() {
  const add = useCallback(<T,>(
    id: string,
    requestFn: () => Promise<T>,
    priority?: number
  ) => {
    return requestQueue.add(id, requestFn, priority);
  }, []);

  const cancel = useCallback((id: string) => {
    requestQueue.cancel(id);
  }, []);

  const getStatus = useCallback(() => {
    return requestQueue.getStatus();
  }, []);

  return { add, cancel, getStatus };
}

// Utility for handling race conditions
export function createRaceConditionHandler() {
  let latestRequestId: string | null = null;

  return {
    // Start a new request and mark it as the latest
    start: (requestId: string) => {
      latestRequestId = requestId;
      return requestId;
    },

    // Check if this request is still the latest
    isLatest: (requestId: string) => {
      return requestId === latestRequestId;
    },

    // Reset the handler
    reset: () => {
      latestRequestId = null;
    },
  };
}

// Hook for handling race conditions
export function useRaceConditionHandler() {
  const handlerRef = useRef(createRaceConditionHandler());

  useEffect(() => {
    return () => {
      handlerRef.current.reset();
    };
  }, []);

  return handlerRef.current;
}
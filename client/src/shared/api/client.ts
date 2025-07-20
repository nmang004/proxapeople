import { z } from 'zod';

// Storage utilities
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'proxapeople_access_token',
  REFRESH_TOKEN: 'proxapeople_refresh_token',
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
};

// Error types
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public issues: z.ZodIssue[]
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Request/Response types
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
  retries?: number;
  timeout?: number;
  validateResponse?: z.ZodSchema;
  skipAuth?: boolean;
}

export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Interceptor types
export type RequestInterceptor = (config: RequestConfig, url: string) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor = (response: Response, data: unknown) => unknown | Promise<unknown>;
export type ErrorInterceptor = (error: Error) => Error | Promise<Error>;

// Network status detection
class NetworkStatus {
  private isOnline = navigator.onLine;
  private listeners: ((online: boolean) => void)[] = [];

  constructor() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners();
    });
  }

  get online() {
    return this.isOnline;
  }

  subscribe(listener: (online: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }
}

// Main API Client class
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];
  private networkStatus = new NetworkStatus();
  private refreshPromise: Promise<void> | null = null;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };

    if (process.env.NODE_ENV === 'development') {
      this.addRequestInterceptor(this.logRequest);
      this.addResponseInterceptor(this.logResponse);
    }
  }

  // Interceptor management
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor);
  }

  // Network status
  get isOnline() {
    return this.networkStatus.online;
  }

  onNetworkChange(listener: (online: boolean) => void) {
    return this.networkStatus.subscribe(listener);
  }

  // Token management
  private getAuthHeader(): Record<string, string> {
    const token = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async refreshToken(): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<void> {
    const refreshToken = storage.get(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new ApiError('No refresh token available', 401, 'NO_REFRESH_TOKEN');
    }

    try {
      const response = await this.rawRequest('/auth/refresh', {
        method: 'POST',
        body: { refreshToken },
        skipAuth: true,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data as { accessToken: string; refreshToken: string };
      
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      if (newRefreshToken) {
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
      }
    } catch (error) {
      // Clear tokens on refresh failure
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
      throw error;
    }
  }

  // Core request method
  private async rawRequest<T = unknown>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    if (!this.isOnline) {
      throw new NetworkError('No internet connection');
    }

    const {
      method = 'GET',
      headers = {},
      body,
      signal,
      timeout = 30000,
      validateResponse,
      skipAuth = false,
      retries = 3,
    } = config;

    const url = `${this.baseUrl}${endpoint}`;
    
    // Build headers
    let requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    if (!skipAuth) {
      requestHeaders = {
        ...requestHeaders,
        ...this.getAuthHeader(),
      };
    }

    // Apply request interceptors
    let interceptedConfig: RequestConfig = { ...config, headers: requestHeaders };
    for (const interceptor of this.requestInterceptors) {
      interceptedConfig = await interceptor(interceptedConfig, url);
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    // Use provided signal or timeout signal
    const requestSignal = signal || controller.signal;

    try {
      const requestInit: RequestInit = {
        method: interceptedConfig.method,
        headers: interceptedConfig.headers,
        signal: requestSignal,
        credentials: 'include',
      };

      if (body && method !== 'GET') {
        requestInit.body = JSON.stringify(body);
      }

      const response = await fetch(url, requestInit);
      clearTimeout(timeoutId);

      // Handle non-2xx responses
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Parse response
      let data: unknown;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Apply response interceptors
      for (const interceptor of this.responseInterceptors) {
        data = await interceptor(response, data);
      }

      // Validate response if schema provided
      if (validateResponse) {
        try {
          data = validateResponse.parse(data);
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new ValidationError('Response validation failed', error.issues);
          }
          throw error;
        }
      }

      return data as ApiResponse<T>;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Apply error interceptors
      let processedError = error as Error;
      for (const interceptor of this.errorInterceptors) {
        processedError = await interceptor(processedError);
      }

      throw processedError;
    }
  }

  // Public request method with retry logic
  async request<T = unknown>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const maxRetries = config.retries ?? 3;
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.rawRequest<T>(endpoint, config);
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors
        if (error instanceof ValidationError || 
            (error instanceof ApiError && [400, 401, 403, 404, 422].includes(error.status))) {
          throw error;
        }

        // Handle 401 with token refresh
        if (error instanceof ApiError && error.status === 401 && !config.skipAuth) {
          try {
            await this.refreshToken();
            continue; // Retry with new token
          } catch (refreshError) {
            throw refreshError;
          }
        }

        // Don't retry on last attempt
        if (attempt === maxRetries) {
          throw error;
        }

        // Exponential backoff for retries
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  // Convenience methods
  async get<T = unknown>(endpoint: string, config: Omit<RequestConfig, 'method'> = {}) {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = unknown>(endpoint: string, body?: unknown, config: Omit<RequestConfig, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T = unknown>(endpoint: string, body?: unknown, config: Omit<RequestConfig, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async patch<T = unknown>(endpoint: string, body?: unknown, config: Omit<RequestConfig, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  async delete<T = unknown>(endpoint: string, config: Omit<RequestConfig, 'method'> = {}) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // Error handling
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: any;
    const contentType = response.headers.get('content-type');
    
    try {
      if (contentType?.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = { message: await response.text() || response.statusText };
      }
    } catch {
      errorData = { message: response.statusText || 'Unknown error' };
    }

    throw new ApiError(
      errorData.message || `Request failed with status ${response.status}`,
      response.status,
      errorData.code,
      errorData
    );
  }

  // Development logging
  private logRequest: RequestInterceptor = (config, url) => {
    console.group(`🚀 API Request: ${config.method || 'GET'} ${url}`);
    console.log('Headers:', config.headers);
    if (config.body) {
      console.log('Body:', config.body);
    }
    console.groupEnd();
    return config;
  };

  private logResponse: ResponseInterceptor = (response, data) => {
    console.group(`✅ API Response: ${response.status} ${response.statusText}`);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    console.log('Data:', data);
    console.groupEnd();
    return data;
  };
}

// Create default client instance
export const apiClient = new ApiClient();

// Export for convenience
export default apiClient;
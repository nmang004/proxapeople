// Core API Client
export { 
  apiClient, 
  ApiError, 
  NetworkError, 
  ValidationError 
} from './client';

// Endpoint definitions
export { api, auth, users, departments, teams, goals, meetings, reviews, surveys, permissions, analytics } from './endpoints';

// Type definitions
export * from './types';

// React Query hooks
export * from './hooks';

// Error handling
export { 
  ApiErrorBoundary, 
  useErrorHandler, 
  withErrorBoundary 
} from './error-boundary';

// Request cancellation
export {
  RequestCancellation,
  requestCancellation,
  useRequestCancellation,
  useAutoCancelRequest,
  useDebouncedRequest,
  RequestQueue,
  requestQueue,
  useRequestQueue,
  createRaceConditionHandler,
  useRaceConditionHandler,
  createRequestId,
} from './cancellation';

// Offline support
export {
  NetworkStatusManager,
  networkStatusManager,
  useNetworkStatus,
  useOfflineRequest,
  OfflineActionQueue,
  offlineActionQueue,
  useOfflineActions,
  OfflineCacheManager,
  offlineCacheManager,
  useOfflineCache,
  NetworkStatusIndicator,
} from './offline.tsx';

// Performance monitoring
export {
  PerformanceMonitor,
  performanceMonitor,
  usePerformanceMonitoring,
  createRequestTimer,
  useRequestTimer,
  PerformanceAlertManager,
  performanceAlertManager,
  usePerformanceAlerts,
  PerformanceDashboard,
} from './monitoring.tsx';

// Default export
export { api as default } from './endpoints';
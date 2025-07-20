// Shared Layer Public API

// UI Components and Hooks
export * from './ui';

// API Client (with conflict resolution)
export { 
  apiClient, 
  ApiError, 
  NetworkError, 
  ValidationError,
  api,
  auth,
  users,
  departments,
  teams,
  goals,
  meetings,
  reviews,
  surveys,
  permissions,
  analytics,
  ApiErrorBoundary,
  useErrorHandler,
  withErrorBoundary,
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
  PerformanceMonitor,
  performanceMonitor,
  usePerformanceMonitoring,
  createRequestTimer,
  useRequestTimer,
  PerformanceAlertManager,
  performanceAlertManager,
  usePerformanceAlerts,
  PerformanceDashboard
} from './api';

// API Permission hooks with aliases to avoid conflicts
export {
  useUserPermissions as useApiUserPermissions,
  useRolePermissions as useApiRolePermissions,
  usePermissionCheck as useApiPermissionCheck
} from './api/hooks';

// Types
export * from './types/types';

// Utilities
export * from './lib/utils';
export * from './lib/queryClient';
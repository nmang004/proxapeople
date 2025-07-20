import { useEffect, useRef, useState, useCallback } from 'react';

// Performance metrics collection
export interface RequestMetrics {
  url: string;
  method: string;
  startTime: number;
  endTime: number;
  duration: number;
  status: number;
  success: boolean;
  size?: number;
  cached?: boolean;
  retryCount?: number;
}

export interface PerformanceStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  slowestRequest: RequestMetrics | null;
  fastestRequest: RequestMetrics | null;
  errorRate: number;
  cacheHitRate: number;
  retryRate: number;
}

// Performance monitor class
export class PerformanceMonitor {
  private metrics: RequestMetrics[] = [];
  private maxMetrics = 1000; // Keep last 1000 requests
  private listeners: Array<(stats: PerformanceStats) => void> = [];

  // Record a new request metric
  recordRequest(metric: RequestMetrics) {
    this.metrics.push(metric);
    
    // Keep only the latest metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    this.notifyListeners();
  }

  // Get current performance statistics
  getStats(): PerformanceStats {
    if (this.metrics.length === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        slowestRequest: null,
        fastestRequest: null,
        errorRate: 0,
        cacheHitRate: 0,
        retryRate: 0,
      };
    }

    const successfulRequests = this.metrics.filter(m => m.success).length;
    const failedRequests = this.metrics.length - successfulRequests;
    const cachedRequests = this.metrics.filter(m => m.cached).length;
    const retriedRequests = this.metrics.filter(m => (m.retryCount || 0) > 0).length;

    const durations = this.metrics.map(m => m.duration);
    const averageResponseTime = durations.reduce((sum, d) => sum + d, 0) / durations.length;

    const slowestRequest = this.metrics.reduce((slowest, current) => 
      !slowest || current.duration > slowest.duration ? current : slowest
    );

    const fastestRequest = this.metrics.reduce((fastest, current) => 
      !fastest || current.duration < fastest.duration ? current : fastest
    );

    return {
      totalRequests: this.metrics.length,
      successfulRequests,
      failedRequests,
      averageResponseTime: Math.round(averageResponseTime),
      slowestRequest,
      fastestRequest,
      errorRate: Math.round((failedRequests / this.metrics.length) * 100),
      cacheHitRate: Math.round((cachedRequests / this.metrics.length) * 100),
      retryRate: Math.round((retriedRequests / this.metrics.length) * 100),
    };
  }

  // Get metrics for a specific time period
  getMetricsForPeriod(minutes: number): RequestMetrics[] {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.metrics.filter(m => m.endTime >= cutoff);
  }

  // Get error rate trend
  getErrorRateTrend(intervalMinutes: number = 5): Array<{ time: number; errorRate: number }> {
    const now = Date.now();
    const intervals = [];
    
    for (let i = 6; i >= 0; i--) {
      const endTime = now - (i * intervalMinutes * 60 * 1000);
      const startTime = endTime - (intervalMinutes * 60 * 1000);
      
      const intervalMetrics = this.metrics.filter(
        m => m.endTime >= startTime && m.endTime < endTime
      );
      
      const errorRate = intervalMetrics.length > 0
        ? (intervalMetrics.filter(m => !m.success).length / intervalMetrics.length) * 100
        : 0;
      
      intervals.push({
        time: endTime,
        errorRate: Math.round(errorRate),
      });
    }
    
    return intervals;
  }

  // Subscribe to stats updates
  subscribe(listener: (stats: PerformanceStats) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    const stats = this.getStats();
    this.listeners.forEach(listener => listener(stats));
  }

  // Clear all metrics
  clear() {
    this.metrics = [];
    this.notifyListeners();
  }

  // Export metrics for analysis
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  // Import metrics from exported data
  importMetrics(data: string): void {
    try {
      const imported = JSON.parse(data) as RequestMetrics[];
      this.metrics = imported.slice(-this.maxMetrics);
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to import metrics:', error);
    }
  }
}

// Global performance monitor
export const performanceMonitor = new PerformanceMonitor();

// Hook for performance monitoring
export function usePerformanceMonitoring() {
  const [stats, setStats] = useState<PerformanceStats>(performanceMonitor.getStats());

  useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe(setStats);
    return unsubscribe;
  }, []);

  const clear = useCallback(() => {
    performanceMonitor.clear();
  }, []);

  const exportData = useCallback(() => {
    return performanceMonitor.exportMetrics();
  }, []);

  const importData = useCallback((data: string) => {
    performanceMonitor.importMetrics(data);
  }, []);

  const getErrorTrend = useCallback((intervalMinutes?: number) => {
    return performanceMonitor.getErrorRateTrend(intervalMinutes);
  }, []);

  const getMetricsForPeriod = useCallback((minutes: number) => {
    return performanceMonitor.getMetricsForPeriod(minutes);
  }, []);

  return {
    stats,
    clear,
    exportData,
    importData,
    getErrorTrend,
    getMetricsForPeriod,
  };
}

// Request timing utility
export function createRequestTimer() {
  const startTime = performance.now();
  
  return {
    end: (): number => {
      return performance.now() - startTime;
    },
    
    getMetric: (
      url: string,
      method: string,
      status: number,
      options?: {
        size?: number;
        cached?: boolean;
        retryCount?: number;
      }
    ): RequestMetrics => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      return {
        url,
        method,
        startTime,
        endTime,
        duration,
        status,
        success: status >= 200 && status < 400,
        ...options,
      };
    },
  };
}

// Hook for timing individual requests
export function useRequestTimer() {
  const timerRef = useRef<ReturnType<typeof createRequestTimer> | null>(null);

  const start = useCallback(() => {
    timerRef.current = createRequestTimer();
  }, []);

  const end = useCallback((
    url: string,
    method: string,
    status: number,
    options?: {
      size?: number;
      cached?: boolean;
      retryCount?: number;
    }
  ) => {
    if (!timerRef.current) {
      console.warn('Request timer not started');
      return;
    }

    const metric = timerRef.current.getMetric(url, method, status, options);
    performanceMonitor.recordRequest(metric);
    timerRef.current = null;
    
    return metric;
  }, []);

  return { start, end };
}

// Performance threshold alerts
export interface PerformanceThresholds {
  maxResponseTime: number; // ms
  maxErrorRate: number; // percentage
  minSuccessRate: number; // percentage
}

export class PerformanceAlertManager {
  private thresholds: PerformanceThresholds = {
    maxResponseTime: 5000,
    maxErrorRate: 10,
    minSuccessRate: 95,
  };
  
  private alertListeners: Array<(alert: PerformanceAlert) => void> = [];

  setThresholds(thresholds: Partial<PerformanceThresholds>) {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  checkThresholds(stats: PerformanceStats) {
    const alerts: PerformanceAlert[] = [];

    if (stats.averageResponseTime > this.thresholds.maxResponseTime) {
      alerts.push({
        type: 'slow_response',
        severity: 'warning',
        message: `Average response time (${stats.averageResponseTime}ms) exceeds threshold (${this.thresholds.maxResponseTime}ms)`,
        value: stats.averageResponseTime,
        threshold: this.thresholds.maxResponseTime,
      });
    }

    if (stats.errorRate > this.thresholds.maxErrorRate) {
      alerts.push({
        type: 'high_error_rate',
        severity: 'error',
        message: `Error rate (${stats.errorRate}%) exceeds threshold (${this.thresholds.maxErrorRate}%)`,
        value: stats.errorRate,
        threshold: this.thresholds.maxErrorRate,
      });
    }

    const successRate = 100 - stats.errorRate;
    if (successRate < this.thresholds.minSuccessRate) {
      alerts.push({
        type: 'low_success_rate',
        severity: 'error',
        message: `Success rate (${successRate}%) below threshold (${this.thresholds.minSuccessRate}%)`,
        value: successRate,
        threshold: this.thresholds.minSuccessRate,
      });
    }

    alerts.forEach(alert => {
      this.alertListeners.forEach(listener => listener(alert));
    });
  }

  subscribe(listener: (alert: PerformanceAlert) => void) {
    this.alertListeners.push(listener);
    return () => {
      this.alertListeners = this.alertListeners.filter(l => l !== listener);
    };
  }
}

export interface PerformanceAlert {
  type: 'slow_response' | 'high_error_rate' | 'low_success_rate';
  severity: 'warning' | 'error';
  message: string;
  value: number;
  threshold: number;
}

// Global alert manager
export const performanceAlertManager = new PerformanceAlertManager();

// Hook for performance alerts
export function usePerformanceAlerts() {
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const { stats } = usePerformanceMonitoring();

  useEffect(() => {
    const unsubscribe = performanceAlertManager.subscribe((alert) => {
      setAlerts(prev => [...prev.slice(-9), alert]); // Keep last 10 alerts
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    performanceAlertManager.checkThresholds(stats);
  }, [stats]);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const setThresholds = useCallback((thresholds: Partial<PerformanceThresholds>) => {
    performanceAlertManager.setThresholds(thresholds);
  }, []);

  return {
    alerts,
    clearAlerts,
    setThresholds,
  };
}

// Development performance dashboard component
export function PerformanceDashboard() {
  const { stats, clear, getErrorTrend } = usePerformanceMonitoring();
  const { alerts, clearAlerts } = usePerformanceAlerts();
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-3 py-2 rounded-full text-sm shadow-lg hover:bg-blue-700"
      >
        📊
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">API Performance</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-blue-600 font-medium">Total Requests</div>
            <div className="text-lg font-bold">{stats.totalRequests}</div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="text-green-600 font-medium">Success Rate</div>
            <div className="text-lg font-bold">{100 - stats.errorRate}%</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-yellow-50 p-2 rounded">
            <div className="text-yellow-600 font-medium">Avg Response</div>
            <div className="text-lg font-bold">{stats.averageResponseTime}ms</div>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <div className="text-purple-600 font-medium">Cache Hit</div>
            <div className="text-lg font-bold">{stats.cacheHitRate}%</div>
          </div>
        </div>

        {alerts.length > 0 && (
          <div className="bg-red-50 p-2 rounded">
            <div className="text-red-600 font-medium mb-1">Alerts ({alerts.length})</div>
            {alerts.slice(-3).map((alert, index) => (
              <div key={index} className="text-xs text-red-800">
                {alert.message}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={clear}
            className="flex-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200"
          >
            Clear
          </button>
          <button
            onClick={clearAlerts}
            className="flex-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200"
          >
            Clear Alerts
          </button>
        </div>
      </div>
    </div>
  );
}
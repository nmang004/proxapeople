// Re-export analytics endpoints
export { analytics } from '../../../shared/api/endpoints';

// Re-export analytics-specific hooks
export {
  useDashboardStats,
  useTeamMetrics,
  useDepartmentMetrics,
} from '../../../shared/api/hooks';

// Re-export analytics-specific types
export type {
  Analytics,
  InsertAnalytics,
} from '../../../shared/api/types';

// Export a convenience object for analytics API
export const analyticsApi = {
  // Endpoints
  ...analytics,
  
  // Helper functions specific to analytics feature
  formatMetricValue: (value: unknown, type: 'percentage' | 'number' | 'currency' | 'duration' = 'number'): string => {
    if (value === null || value === undefined) return 'N/A';
    
    const numValue = Number(value);
    if (isNaN(numValue)) return String(value);
    
    switch (type) {
      case 'percentage':
        return `${numValue.toFixed(1)}%`;
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(numValue);
      case 'duration':
        if (numValue < 60) return `${numValue}min`;
        const hours = Math.floor(numValue / 60);
        const minutes = numValue % 60;
        return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
      case 'number':
      default:
        return new Intl.NumberFormat('en-US').format(numValue);
    }
  },

  getMetricTrend: (current: number, previous: number): 'up' | 'down' | 'stable' => {
    const diff = current - previous;
    const threshold = previous * 0.05; // 5% threshold
    
    if (Math.abs(diff) < threshold) return 'stable';
    return diff > 0 ? 'up' : 'down';
  },

  getTrendColor: (trend: 'up' | 'down' | 'stable', isPositive = true): string => {
    switch (trend) {
      case 'up':
        return isPositive ? 'text-green-600' : 'text-red-600';
      case 'down':
        return isPositive ? 'text-red-600' : 'text-green-600';
      case 'stable':
      default:
        return 'text-gray-600';
    }
  },

  getTrendIcon: (trend: 'up' | 'down' | 'stable'): string => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'stable':
      default:
        return '→';
    }
  },

  calculateEngagementScore: (metrics: {
    surveyScore?: number;
    goalCompletion?: number;
    meetingAttendance?: number;
    reviewScore?: number;
  }): number => {
    const weights = {
      surveyScore: 0.3,
      goalCompletion: 0.3,
      meetingAttendance: 0.2,
      reviewScore: 0.2,
    };
    
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.entries(metrics).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const weight = weights[key as keyof typeof weights];
        totalScore += value * weight;
        totalWeight += weight;
      }
    });
    
    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  },

  getScoreColor: (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  },

  getScoreLabel: (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  },

  formatTimeRange: (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const sameYear = start.getFullYear() === end.getFullYear();
    const sameMonth = sameYear && start.getMonth() === end.getMonth();
    
    if (sameMonth) {
      return `${start.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })} - ${end.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })}`;
    } else if (sameYear) {
      return `${start.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })} - ${end.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })}`;
    } else {
      return `${start.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      })} - ${end.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      })}`;
    }
  },

  generateReportData: (metrics: Record<string, unknown>): Array<{ key: string; value: string; trend?: string }> => {
    return Object.entries(metrics).map(([key, value]) => ({
      key: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value: analyticsApi.formatMetricValue(value),
    }));
  },
};
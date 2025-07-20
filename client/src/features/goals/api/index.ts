// Re-export goals endpoints
import { goals } from '../../../shared/api/endpoints';
import type { Goal } from '../../../shared/api/types';

// Re-export goals-specific hooks
export {
  useGoals,
  useGoal,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
} from '../../../shared/api/hooks';

// Re-export goals-specific types
export type {
  Goal,
  InsertGoal,
  GoalFilter,
} from '../../../shared/api/types';

// Export a convenience object for goals API
export const goalsApi = {
  // Endpoints
  ...goals,
  
  // Helper functions specific to goals feature
  calculateProgress: (currentValue?: string | null, targetValue?: string | null): number => {
    if (!currentValue || !targetValue) return 0;
    
    const current = parseFloat(currentValue);
    const target = parseFloat(targetValue);
    
    if (isNaN(current) || isNaN(target) || target === 0) return 0;
    
    return Math.min(100, Math.max(0, Math.round((current / target) * 100)));
  },

  getStatusColor: (status: 'not_started' | 'in_progress' | 'completed'): string => {
    switch (status) {
      case 'not_started':
        return 'text-gray-500';
      case 'in_progress':
        return 'text-yellow-500';
      case 'completed':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  },

  getStatusLabel: (status: 'not_started' | 'in_progress' | 'completed'): string => {
    switch (status) {
      case 'not_started':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  },

  isOverdue: (dueDate: string): boolean => {
    return new Date(dueDate) < new Date();
  },

  getDaysUntilDue: (dueDate: string): number => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  formatGoalType: (goal: Goal): string => {
    if (goal.isCompanyGoal) return 'Company Goal';
    if (goal.departmentId) return 'Department Goal';
    if (goal.teamId) return 'Team Goal';
    if (goal.userId) return 'Individual Goal';
    return 'Goal';
  },
};

// Export the imported endpoints
export { goals };
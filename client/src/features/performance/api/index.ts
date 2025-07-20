// Re-export reviews endpoints
export { reviews } from '../../../shared/api/endpoints';

// Re-export reviews-specific hooks (note: need to add these to hooks.ts)
// export {
//   useReviews,
//   useReview,
//   useCreateReview,
//   useUpdateReview,
//   useDeleteReview,
// } from '../../../shared/api/hooks';

// Re-export reviews-specific types
export type {
  PerformanceReview,
  InsertPerformanceReview,
  ReviewFilter,
} from '../../../shared/api/types';

// Export a convenience object for performance reviews API
export const performanceApi = {
  // Endpoints
  ...reviews,
  
  // Helper functions specific to performance reviews feature
  getStatusColor: (status: 'not_started' | 'self_review' | 'peer_review' | 'manager_review' | 'completed'): string => {
    switch (status) {
      case 'not_started':
        return 'text-gray-600 bg-gray-100';
      case 'self_review':
        return 'text-blue-600 bg-blue-100';
      case 'peer_review':
        return 'text-yellow-600 bg-yellow-100';
      case 'manager_review':
        return 'text-purple-600 bg-purple-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  },

  getStatusLabel: (status: 'not_started' | 'self_review' | 'peer_review' | 'manager_review' | 'completed'): string => {
    switch (status) {
      case 'not_started':
        return 'Not Started';
      case 'self_review':
        return 'Self Review';
      case 'peer_review':
        return 'Peer Review';
      case 'manager_review':
        return 'Manager Review';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  },

  getTypeLabel: (type: 'quarterly' | 'annual' | 'peer' | 'self'): string => {
    switch (type) {
      case 'quarterly':
        return 'Quarterly Review';
      case 'annual':
        return 'Annual Review';
      case 'peer':
        return 'Peer Review';
      case 'self':
        return 'Self Review';
      default:
        return 'Unknown';
    }
  },

  getTypeColor: (type: 'quarterly' | 'annual' | 'peer' | 'self'): string => {
    switch (type) {
      case 'quarterly':
        return 'text-blue-600 bg-blue-100';
      case 'annual':
        return 'text-purple-600 bg-purple-100';
      case 'peer':
        return 'text-green-600 bg-green-100';
      case 'self':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  },

  getRatingLabel: (rating?: number | null): string => {
    if (!rating) return 'Not Rated';
    
    switch (rating) {
      case 1:
        return 'Needs Improvement';
      case 2:
        return 'Below Expectations';
      case 3:
        return 'Meets Expectations';
      case 4:
        return 'Exceeds Expectations';
      case 5:
        return 'Outstanding';
      default:
        return 'Not Rated';
    }
  },

  getRatingColor: (rating?: number | null): string => {
    if (!rating) return 'text-gray-600 bg-gray-100';
    
    switch (rating) {
      case 1:
        return 'text-red-600 bg-red-100';
      case 2:
        return 'text-orange-600 bg-orange-100';
      case 3:
        return 'text-yellow-600 bg-yellow-100';
      case 4:
        return 'text-blue-600 bg-blue-100';
      case 5:
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
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

  canEdit: (review: PerformanceReview, currentUserId: number, currentUserRole: string): boolean => {
    // Admin and HR can edit any review
    if (['admin', 'hr'].includes(currentUserRole)) return true;
    
    // Employee can edit during self-review phase
    if (review.status === 'self_review' && review.employeeId === currentUserId) return true;
    
    // Manager can edit during manager review phase
    if (review.status === 'manager_review' && review.reviewerId === currentUserId) return true;
    
    return false;
  },

  getNextStatus: (currentStatus: 'not_started' | 'self_review' | 'peer_review' | 'manager_review' | 'completed'): string | null => {
    switch (currentStatus) {
      case 'not_started':
        return 'self_review';
      case 'self_review':
        return 'peer_review';
      case 'peer_review':
        return 'manager_review';
      case 'manager_review':
        return 'completed';
      case 'completed':
        return null;
      default:
        return null;
    }
  },

  getProgressPercentage: (status: 'not_started' | 'self_review' | 'peer_review' | 'manager_review' | 'completed'): number => {
    switch (status) {
      case 'not_started':
        return 0;
      case 'self_review':
        return 25;
      case 'peer_review':
        return 50;
      case 'manager_review':
        return 75;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  },
};
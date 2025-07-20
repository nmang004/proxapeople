import { Analytics, InsertAnalytics } from '@shared/schema';

export type { Analytics, InsertAnalytics };

export interface DashboardStats {
  teamCount: number;
  reviewsInProgress: number;
  activeGoals: number;
  engagementScore: number;
}

export interface DashboardData {
  stats: DashboardStats;
  upcomingReviews: any[];
  teamGoals: any[];
  upcomingOneOnOnes: any[];
  teamPerformance: any;
  teamEngagement: any;
}
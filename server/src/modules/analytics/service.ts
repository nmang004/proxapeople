import { storage } from '../../database/storage';
import { type Analytics, type InsertAnalytics } from '@shared/schema';

export class AnalyticsService {
  async getAllAnalytics(): Promise<Analytics[]> {
    return await storage.getAllAnalytics();
  }

  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    return await storage.createAnalytics(analyticsData);
  }

  async getDashboardData() {
    const teamCount = await storage.getTeamMemberCount();
    const reviewsInProgress = await storage.getReviewsInProgressCount();
    const activeGoals = await storage.getActiveGoalsCount();
    const engagementScore = await storage.getAverageEngagementScore();
    const upcomingReviews = await storage.getUpcomingReviews();
    const teamGoals = await storage.getTeamGoals(1); // Default team ID
    const upcomingOneOnOnes = await storage.getUpcomingOneOnOnes();
    const teamPerformance = await storage.getTeamPerformance();
    const teamEngagement = await storage.getTeamEngagement();

    return {
      stats: {
        teamCount,
        reviewsInProgress,
        activeGoals,
        engagementScore
      },
      upcomingReviews,
      teamGoals,
      upcomingOneOnOnes,
      teamPerformance,
      teamEngagement
    };
  }
}
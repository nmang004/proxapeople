import { storage } from '../../database/storage';
import { 
  type PerformanceReview, 
  type InsertPerformanceReview, 
  type ReviewCycle, 
  type InsertReviewCycle 
} from '@shared/schema';

export class PerformanceService {
  async getAllPerformanceReviews(): Promise<PerformanceReview[]> {
    return await storage.getAllPerformanceReviews();
  }

  async getPerformanceReview(id: number): Promise<PerformanceReview | null> {
    const review = await storage.getPerformanceReview(id);
    return review || null;
  }

  async createPerformanceReview(reviewData: InsertPerformanceReview): Promise<PerformanceReview> {
    return await storage.createPerformanceReview(reviewData);
  }

  async getAllReviewCycles(): Promise<ReviewCycle[]> {
    return await storage.getAllReviewCycles();
  }

  async createReviewCycle(cycleData: InsertReviewCycle): Promise<ReviewCycle> {
    return await storage.createReviewCycle(cycleData);
  }
}
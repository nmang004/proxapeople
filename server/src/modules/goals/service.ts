import { storage } from '../../database/storage';
import { type Goal, type InsertGoal } from '@shared/schema';

export class GoalService {
  async getAllGoals(): Promise<Goal[]> {
    return await storage.getAllGoals();
  }

  async getGoal(id: number): Promise<Goal | null> {
    const goal = await storage.getGoal(id);
    return goal || null;
  }

  async createGoal(goalData: InsertGoal): Promise<Goal> {
    return await storage.createGoal(goalData);
  }

  async getUserGoals(userId: number): Promise<Goal[]> {
    return await storage.getUserGoals(userId);
  }

  async getTeamGoals(teamId: number): Promise<Goal[]> {
    return await storage.getTeamGoals(teamId);
  }
}
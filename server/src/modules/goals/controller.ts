import { Request, Response } from 'express';
import { GoalService } from './service';
import { insertGoalSchema } from '@shared/schema';
import { asyncHandler } from '../../shared/utils/async-handler';
import { validateRequestBody, handleValidationError } from '../../shared/utils/validation';
import { z } from 'zod';

export class GoalController {
  constructor(private goalService: GoalService) {}

  getAllGoals = asyncHandler(async (req: Request, res: Response) => {
    const goals = await this.goalService.getAllGoals();
    res.json(goals);
  });

  getGoal = asyncHandler(async (req: Request, res: Response) => {
    const goal = await this.goalService.getGoal(parseInt(req.params.id));
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(goal);
  });

  createGoal = asyncHandler(async (req: Request, res: Response) => {
    const goalData = validateRequestBody(insertGoalSchema, req, res);
    if (!goalData) return;

    try {
      const goal = await this.goalService.createGoal(goalData);
      res.status(201).json(goal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return handleValidationError(err, res, 'goal');
      }
      throw err;
    }
  });

  getUserGoals = asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const goals = await this.goalService.getUserGoals(userId);
    res.json(goals);
  });

  getTeamGoals = asyncHandler(async (req: Request, res: Response) => {
    const teamId = parseInt(req.params.teamId);
    const goals = await this.goalService.getTeamGoals(teamId);
    res.json(goals);
  });
}
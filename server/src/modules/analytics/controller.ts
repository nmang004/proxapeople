import { Request, Response } from 'express';
import { AnalyticsService } from './service';
import { insertAnalyticsSchema } from '@shared/schema';
import { asyncHandler } from '../../shared/utils/async-handler';
import { validateRequestBody, handleValidationError } from '../../shared/utils/validation';
import { z } from 'zod';

export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  getAllAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const analytics = await this.analyticsService.getAllAnalytics();
    res.json(analytics);
  });

  createAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const analyticsData = validateRequestBody(insertAnalyticsSchema, req, res);
    if (!analyticsData) return;

    try {
      const analytics = await this.analyticsService.createAnalytics(analyticsData);
      res.status(201).json(analytics);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return handleValidationError(err, res, 'analytics');
      }
      throw err;
    }
  });

  getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const dashboardData = await this.analyticsService.getDashboardData();
    res.json(dashboardData);
  });
}
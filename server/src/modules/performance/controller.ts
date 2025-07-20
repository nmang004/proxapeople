import { Request, Response } from 'express';
import { PerformanceService } from './service';
import { insertPerformanceReviewSchema, insertReviewCycleSchema } from '@shared/schema';
import { asyncHandler } from '../../shared/utils/async-handler';
import { validateRequestBody, handleValidationError } from '../../shared/utils/validation';
import { z } from 'zod';

export class PerformanceController {
  constructor(private performanceService: PerformanceService) {}

  getAllReviews = asyncHandler(async (req: Request, res: Response) => {
    const reviews = await this.performanceService.getAllPerformanceReviews();
    res.json(reviews);
  });

  getReview = asyncHandler(async (req: Request, res: Response) => {
    const review = await this.performanceService.getPerformanceReview(parseInt(req.params.id));
    if (!review) {
      return res.status(404).json({ message: 'Performance review not found' });
    }
    res.json(review);
  });

  createReview = asyncHandler(async (req: Request, res: Response) => {
    const reviewData = validateRequestBody(insertPerformanceReviewSchema, req, res);
    if (!reviewData) return;

    try {
      const review = await this.performanceService.createPerformanceReview(reviewData);
      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return handleValidationError(err, res, 'performance review');
      }
      throw err;
    }
  });

  getAllCycles = asyncHandler(async (req: Request, res: Response) => {
    const reviewCycles = await this.performanceService.getAllReviewCycles();
    res.json(reviewCycles);
  });

  createCycle = asyncHandler(async (req: Request, res: Response) => {
    const cycleData = validateRequestBody(insertReviewCycleSchema, req, res);
    if (!cycleData) return;

    try {
      const cycle = await this.performanceService.createReviewCycle(cycleData);
      res.status(201).json(cycle);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return handleValidationError(err, res, 'review cycle');
      }
      throw err;
    }
  });
}
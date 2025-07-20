import express from 'express';
import { PerformanceController } from './controller';
import { PerformanceService } from './service';

const router = express.Router();
const performanceService = new PerformanceService();
const performanceController = new PerformanceController(performanceService);

// Performance review routes
router.get('/reviews', performanceController.getAllReviews);
router.get('/reviews/:id', performanceController.getReview);
router.post('/reviews', performanceController.createReview);

// Review cycle routes  
router.get('/review-cycles', performanceController.getAllCycles);
router.post('/review-cycles', performanceController.createCycle);

export default router;
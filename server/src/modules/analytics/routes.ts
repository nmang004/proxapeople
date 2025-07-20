import express from 'express';
import { AnalyticsController } from './controller';
import { AnalyticsService } from './service';

const router = express.Router();
const analyticsService = new AnalyticsService();
const analyticsController = new AnalyticsController(analyticsService);

// Analytics routes
router.get('/', analyticsController.getAllAnalytics);
router.post('/', analyticsController.createAnalytics);

// Dashboard data route
router.get('/dashboard', analyticsController.getDashboard);

export default router;
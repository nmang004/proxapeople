import express from 'express';
import { AnalyticsController } from './controller';
import { AnalyticsService } from './service';

const router = express.Router();
const analyticsService = new AnalyticsService();
const analyticsController = new AnalyticsController(analyticsService);

// Dashboard data route (when mounted at /dashboard)
router.get('/', analyticsController.getDashboard);

// Analytics routes (when mounted at /analytics)
router.get('/analytics', analyticsController.getAllAnalytics);
router.post('/analytics', analyticsController.createAnalytics);

export default router;
import express from 'express';
import { SurveyController } from './controller';
import { SurveyService } from './service';

const router = express.Router();
const surveyService = new SurveyService();
const surveyController = new SurveyController(surveyService);

// Survey routes
router.get('/', surveyController.getAllSurveys);
router.post('/', surveyController.createSurvey);

// Survey template routes
router.get('/templates', surveyController.getAllTemplates);
router.post('/templates', surveyController.createTemplate);

// Survey response routes
router.post('/responses', surveyController.createResponse);

// Feedback routes
router.post('/feedback', surveyController.createFeedback);
router.get('/users/:userId/feedback', surveyController.getUserFeedback);

export default router;
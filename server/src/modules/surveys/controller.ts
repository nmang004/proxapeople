import { Request, Response } from 'express';
import { SurveyService } from './service';
import { 
  insertSurveySchema, 
  insertSurveyTemplateSchema, 
  insertSurveyResponseSchema,
  insertFeedbackSchema
} from '@shared/schema';
import { asyncHandler } from '../../shared/utils/async-handler';
import { validateRequestBody, handleValidationError } from '../../shared/utils/validation';
import { z } from 'zod';

export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  // Survey methods
  getAllSurveys = asyncHandler(async (req: Request, res: Response) => {
    const surveys = await this.surveyService.getAllSurveys();
    res.json(surveys);
  });

  createSurvey = asyncHandler(async (req: Request, res: Response) => {
    const surveyData = validateRequestBody(insertSurveySchema, req, res);
    if (!surveyData) return;

    try {
      const survey = await this.surveyService.createSurvey(surveyData);
      res.status(201).json(survey);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return handleValidationError(err, res, 'survey');
      }
      throw err;
    }
  });

  // Survey template methods
  getAllTemplates = asyncHandler(async (req: Request, res: Response) => {
    const templates = await this.surveyService.getAllSurveyTemplates();
    res.json(templates);
  });

  createTemplate = asyncHandler(async (req: Request, res: Response) => {
    const templateData = validateRequestBody(insertSurveyTemplateSchema, req, res);
    if (!templateData) return;

    try {
      const template = await this.surveyService.createSurveyTemplate(templateData);
      res.status(201).json(template);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return handleValidationError(err, res, 'survey template');
      }
      throw err;
    }
  });

  // Survey response methods
  createResponse = asyncHandler(async (req: Request, res: Response) => {
    const responseData = validateRequestBody(insertSurveyResponseSchema, req, res);
    if (!responseData) return;

    try {
      const response = await this.surveyService.createSurveyResponse(responseData);
      res.status(201).json(response);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return handleValidationError(err, res, 'survey response');
      }
      throw err;
    }
  });

  // Feedback methods
  createFeedback = asyncHandler(async (req: Request, res: Response) => {
    const feedbackData = validateRequestBody(insertFeedbackSchema, req, res);
    if (!feedbackData) return;

    try {
      const feedback = await this.surveyService.createFeedback(feedbackData);
      res.status(201).json(feedback);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return handleValidationError(err, res, 'feedback');
      }
      throw err;
    }
  });

  getUserFeedback = asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const feedback = await this.surveyService.getUserFeedback(userId);
    res.json(feedback);
  });
}
import { storage } from '../../database/storage';
import { 
  type Survey, 
  type InsertSurvey, 
  type SurveyTemplate, 
  type InsertSurveyTemplate,
  type SurveyResponse,
  type InsertSurveyResponse,
  type Feedback,
  type InsertFeedback
} from '@shared/schema';

export class SurveyService {
  // Survey methods
  async getAllSurveys(): Promise<Survey[]> {
    return await storage.getAllSurveys();
  }

  async createSurvey(surveyData: InsertSurvey): Promise<Survey> {
    return await storage.createSurvey(surveyData);
  }

  // Survey template methods
  async getAllSurveyTemplates(): Promise<SurveyTemplate[]> {
    return await storage.getAllSurveyTemplates();
  }

  async createSurveyTemplate(templateData: InsertSurveyTemplate): Promise<SurveyTemplate> {
    return await storage.createSurveyTemplate(templateData);
  }

  // Survey response methods
  async createSurveyResponse(responseData: InsertSurveyResponse): Promise<SurveyResponse> {
    return await storage.createSurveyResponse(responseData);
  }

  // Feedback methods
  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    return await storage.createFeedback(feedbackData);
  }

  async getUserFeedback(userId: number): Promise<Feedback[]> {
    return await storage.getUserFeedback(userId);
  }
}
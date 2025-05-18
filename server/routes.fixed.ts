import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertDepartmentSchema, 
  insertTeamSchema, 
  insertTeamMemberSchema,
  insertPerformanceReviewSchema,
  insertReviewCycleSchema,
  insertGoalSchema,
  insertOneOnOneMeetingSchema,
  insertSurveyTemplateSchema, 
  insertSurveySchema,
  insertSurveyResponseSchema,
  insertFeedbackSchema,
  insertAnalyticsSchema,
  reviewStatusEnum,
  goalStatusEnum,
  meetingStatusEnum
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  const apiRouter = express.Router();

  // Error handling middleware
  const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

  // User routes
  apiRouter.get('/users', asyncHandler(async (req: Request, res: Response) => {
    const users = await storage.getAllUsers();
    res.json(users);
  }));

  apiRouter.get('/users/:id', asyncHandler(async (req: Request, res: Response) => {
    const user = await storage.getUser(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  }));

  apiRouter.post('/users', asyncHandler(async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid user data', errors: fromZodError(err) });
      }
      throw err;
    }
  }));

  // Department routes
  apiRouter.get('/departments', asyncHandler(async (req: Request, res: Response) => {
    const departments = await storage.getAllDepartments();
    res.json(departments);
  }));

  apiRouter.post('/departments', asyncHandler(async (req: Request, res: Response) => {
    try {
      const departmentData = insertDepartmentSchema.parse(req.body);
      const department = await storage.createDepartment(departmentData);
      res.status(201).json(department);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid department data', errors: fromZodError(err) });
      }
      throw err;
    }
  }));

  // Team routes
  apiRouter.get('/teams', asyncHandler(async (req: Request, res: Response) => {
    const teams = await storage.getAllTeams();
    res.json(teams);
  }));

  apiRouter.post('/teams', asyncHandler(async (req: Request, res: Response) => {
    try {
      const teamData = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(teamData);
      res.status(201).json(team);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid team data', errors: fromZodError(err) });
      }
      throw err;
    }
  }));

  // Team members routes
  apiRouter.post('/team-members', asyncHandler(async (req: Request, res: Response) => {
    try {
      const teamMemberData = insertTeamMemberSchema.parse(req.body);
      const teamMember = await storage.addTeamMember(teamMemberData);
      res.status(201).json(teamMember);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid team member data', errors: fromZodError(err) });
      }
      throw err;
    }
  }));

  apiRouter.get('/teams/:teamId/members', asyncHandler(async (req: Request, res: Response) => {
    const teamId = parseInt(req.params.teamId);
    const members = await storage.getTeamMembers(teamId);
    res.json(members);
  }));

  // Performance review routes
  apiRouter.get('/reviews', asyncHandler(async (req: Request, res: Response) => {
    const reviews = await storage.getAllPerformanceReviews();
    res.json(reviews);
  }));

  apiRouter.get('/reviews/:id', asyncHandler(async (req: Request, res: Response) => {
    const review = await storage.getPerformanceReview(parseInt(req.params.id));
    if (!review) {
      return res.status(404).json({ message: 'Performance review not found' });
    }
    res.json(review);
  }));

  apiRouter.post('/reviews', asyncHandler(async (req: Request, res: Response) => {
    try {
      const reviewData = insertPerformanceReviewSchema.parse(req.body);
      const review = await storage.createPerformanceReview(reviewData);
      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid performance review data', errors: fromZodError(err) });
      }
      throw err;
    }
  }));

  apiRouter.get('/review-cycles', asyncHandler(async (req: Request, res: Response) => {
    const reviewCycles = await storage.getAllReviewCycles();
    res.json(reviewCycles);
  }));

  apiRouter.post('/review-cycles', asyncHandler(async (req: Request, res: Response) => {
    try {
      const cycleData = insertReviewCycleSchema.parse(req.body);
      const cycle = await storage.createReviewCycle(cycleData);
      res.status(201).json(cycle);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid review cycle data', errors: fromZodError(err) });
      }
      throw err;
    }
  }));

  // Goal routes
  apiRouter.get('/goals', asyncHandler(async (req: Request, res: Response) => {
    const goals = await storage.getAllGoals();
    res.json(goals);
  }));

  apiRouter.get('/goals/:id', asyncHandler(async (req: Request, res: Response) => {
    const goal = await storage.getGoal(parseInt(req.params.id));
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(goal);
  }));

  apiRouter.post('/goals', asyncHandler(async (req: Request, res: Response) => {
    try {
      const goalData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal(goalData);
      res.status(201).json(goal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid goal data', errors: fromZodError(err) });
      }
      throw err;
    }
  }));

  apiRouter.get('/user/:userId/goals', asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const goals = await storage.getUserGoals(userId);
    res.json(goals);
  }));

  apiRouter.get('/team/:teamId/goals', asyncHandler(async (req: Request, res: Response) => {
    const teamId = parseInt(req.params.teamId);
    const goals = await storage.getTeamGoals(teamId);
    res.json(goals);
  }));

  // One-on-One meeting routes
  apiRouter.get('/one-on-ones', asyncHandler(async (req: Request, res: Response) => {
    const meetings = await storage.getAllOneOnOneMeetings();
    res.json(meetings);
  }));

  apiRouter.post('/one-on-ones', asyncHandler(async (req: Request, res: Response) => {
    try {
      const meetingData = insertOneOnOneMeetingSchema.parse(req.body);
      const meeting = await storage.createOneOnOneMeeting(meetingData);
      res.status(201).json(meeting);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid meeting data', errors: fromZodError(err) });
      }
      throw err;
    }
  }));

  apiRouter.get('/one-on-ones/:id', asyncHandler(async (req: Request, res: Response) => {
    const meeting = await storage.getOneOnOneMeeting(parseInt(req.params.id));
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json(meeting);
  }));

  apiRouter.get('/users/:userId/one-on-ones', asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const meetings = await storage.getUserOneOnOneMeetings(userId);
    res.json(meetings);
  }));

  // Survey routes
  apiRouter.get('/surveys', asyncHandler(async (req: Request, res: Response) => {
    const surveys = await storage.getAllSurveys();
    res.json(surveys);
  }));

  apiRouter.post('/surveys', asyncHandler(async (req: Request, res: Response) => {
    try {
      const surveyData = insertSurveySchema.parse(req.body);
      const survey = await storage.createSurvey(surveyData);
      res.status(201).json(survey);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid survey data', errors: fromZodError(err) });
      }
      throw err;
    }
  }));

  // Survey Template routes
  apiRouter.get('/survey-templates', asyncHandler(async (req: Request, res: Response) => {
    const templates = await storage.getAllSurveyTemplates();
    res.json(templates);
  }));

  apiRouter.post('/survey-templates', asyncHandler(async (req: Request, res: Response) => {
    try {
      const templateData = insertSurveyTemplateSchema.parse(req.body);
      const template = await storage.createSurveyTemplate(templateData);
      res.status(201).json(template);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid survey template data', errors: fromZodError(err) });
      }
      throw err;
    }
  }));

  // Survey Response routes
  apiRouter.post('/survey-responses', asyncHandler(async (req: Request, res: Response) => {
    try {
      const responseData = insertSurveyResponseSchema.parse(req.body);
      const response = await storage.createSurveyResponse(responseData);
      res.status(201).json(response);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid survey response data', errors: fromZodError(err) });
      }
      throw err;
    }
  }));

  // Feedback routes
  apiRouter.post('/feedback', asyncHandler(async (req: Request, res: Response) => {
    try {
      const feedbackData = insertFeedbackSchema.parse(req.body);
      const feedbackItem = await storage.createFeedback(feedbackData);
      res.status(201).json(feedbackItem);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid feedback data', errors: fromZodError(err) });
      }
      throw err;
    }
  }));

  apiRouter.get('/users/:userId/feedback', asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const feedback = await storage.getUserFeedback(userId);
    res.json(feedback);
  }));

  // Analytics routes
  apiRouter.get('/analytics', asyncHandler(async (req: Request, res: Response) => {
    const analytics = await storage.getAllAnalytics();
    res.json(analytics);
  }));

  apiRouter.post('/analytics', asyncHandler(async (req: Request, res: Response) => {
    try {
      const analyticsData = insertAnalyticsSchema.parse(req.body);
      const analyticsItem = await storage.createAnalytics(analyticsData);
      res.status(201).json(analyticsItem);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid analytics data', errors: fromZodError(err) });
      }
      throw err;
    }
  }));

  // Dashboard data (aggregated from multiple sources)
  apiRouter.get('/dashboard', asyncHandler(async (req: Request, res: Response) => {
    const teamCount = await storage.getTeamMemberCount();
    const reviewsInProgress = await storage.getReviewsInProgressCount();
    const activeGoals = await storage.getActiveGoalsCount();
    const engagementScore = await storage.getAverageEngagementScore();
    const upcomingReviews = await storage.getUpcomingReviews();
    const teamGoals = await storage.getTeamGoals(1); // Default team ID
    const upcomingOneOnOnes = await storage.getUpcomingOneOnOnes();
    const teamPerformance = await storage.getTeamPerformance();
    const teamEngagement = await storage.getTeamEngagement();

    res.json({
      stats: {
        teamCount,
        reviewsInProgress,
        activeGoals,
        engagementScore
      },
      upcomingReviews,
      teamGoals,
      upcomingOneOnOnes,
      teamPerformance,
      teamEngagement
    });
  }));

  // Use apiRouter with prefix
  app.use('/api', apiRouter);
  
  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  const httpServer = createServer(app);
  return httpServer;
}
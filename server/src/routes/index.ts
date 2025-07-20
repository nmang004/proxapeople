import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { ModuleRegistry } from '../shared/module-registry';
import { authenticateToken, requirePermission } from "../shared/middleware/auth";
import { authRateLimit, apiRateLimit } from "../shared/middleware/security";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  const apiRouter = express.Router();
  
  // Apply rate limiting to API routes
  apiRouter.use(apiRateLimit);

  // Initialize module registry
  const moduleRegistry = new ModuleRegistry();
  
  // Register public routes (auth)
  const authModule = moduleRegistry.getModule('auth');
  if (authModule) {
    apiRouter.use(authModule.config.prefix, authRateLimit, authModule.router);
  }

  // Require authentication for all subsequent routes
  apiRouter.use(authenticateToken);

  // Register permission management routes (admin only)
  const permissionModule = moduleRegistry.getModule('permissions');
  if (permissionModule) {
    apiRouter.use(permissionModule.config.prefix, requirePermission('settings', 'admin'), permissionModule.router);
  }

  // Register all other protected modules
  const protectedModules = ['users', 'departments', 'teams', 'performance', 'goals', 'meetings', 'surveys', 'analytics'];
  
  protectedModules.forEach(moduleName => {
    const module = moduleRegistry.getModule(moduleName);
    if (module) {
      apiRouter.use(module.config.prefix, module.router);
    }
  });

  // Register permission routes under /rbac for backwards compatibility
  if (permissionModule) {
    apiRouter.use('/rbac', permissionModule.router);
  }

  // Special routes that need custom handling
  // Team members route (from teams module but different path structure)
  const teamModule = moduleRegistry.getModule('teams');
  if (teamModule) {
    // Add team-members route for backwards compatibility
    apiRouter.use('/team-members', teamModule.router);
  }

  // Survey-specific routes for backwards compatibility
  const surveyModule = moduleRegistry.getModule('surveys');
  if (surveyModule) {
    apiRouter.use('/survey-templates', surveyModule.router);
    apiRouter.use('/survey-responses', surveyModule.router);
    apiRouter.use('/feedback', surveyModule.router);
  }

  // Dashboard route (from analytics module)
  const analyticsModule = moduleRegistry.getModule('analytics');
  if (analyticsModule) {
    apiRouter.use('/dashboard', analyticsModule.router);
  }

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
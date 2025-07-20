import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes/index";
import { setupVite, serveStatic, log } from "../vite";
import { config } from "./config/index";
import { 
  helmetConfig, 
  corsConfig, 
  generalRateLimit, 
  correlationId, 
  additionalSecurityHeaders,
  healthCheckBypass 
} from "./shared/middleware/security";

export async function createApp() {
  const app = express();

  // Trust proxy for Cloud Run and Vercel
  app.set('trust proxy', true);

  // Health check bypass (must be first)
  app.use(healthCheckBypass);

  // Security headers
  app.use(helmetConfig);
  app.use(corsConfig);
  app.use(additionalSecurityHeaders);
  app.use(correlationId);

  // Rate limiting
  app.use(generalRateLimit);

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        log(logLine);
      }
    });

    next();
  });

  // Register API routes
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Only setup vite in development
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  return { app, server };
}

// For Vercel serverless function export
export async function createServerlessApp() {
  const { app } = await createApp();
  return app;
}
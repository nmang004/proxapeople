import { createApp } from "./app";
import { config } from "./config/index";
import { log } from "../vite";

// For development and production server
(async () => {
  const { app, server } = await createApp();

  // Serve the app on configured port (defaults to 5000 for development, 8080 for production)
  // this serves both the API and the client.
  const port = config.PORT;
  server.listen({
    port,
    host: "localhost",
    reusePort: false,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

// Export for Vercel serverless function
export { createServerlessApp as createServer } from "./app";

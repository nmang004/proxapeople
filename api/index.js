// Vercel serverless function that serves the Express app
import { createServer } from '../dist/index.js'

// Export the Express app as a Vercel serverless function
export default async (req, res) => {
  const app = await createServer()
  return app(req, res)
}
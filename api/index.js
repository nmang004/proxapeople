// Vercel serverless function that serves the Express app
import { createServer } from '../dist/index.js'

// Export the Express app as a Vercel serverless function
export default async (req, res) => {
  // Ensure headers are properly forwarded
  // Vercel sometimes uses x-authorization instead of authorization
  if (req.headers['x-authorization'] && !req.headers.authorization) {
    req.headers.authorization = req.headers['x-authorization'];
  }
  
  try {
    const app = await createServer();
    return app(req, res);
  } catch (error) {
    console.error('❌ Vercel Function: Error creating server:', error);
    return res.status(500).json({ error: 'Server initialization failed' });
  }
}
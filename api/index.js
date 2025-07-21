// Vercel serverless function that serves the Express app
import { createServer } from '../dist/index.js'

// Export the Express app as a Vercel serverless function
export default async (req, res) => {
  // Log the incoming request
  console.log('🚀 Vercel Function: Incoming request:', {
    method: req.method,
    url: req.url,
    path: req.url?.split('?')[0],
    query: req.query,
    timestamp: new Date().toISOString()
  });

  // Ensure headers are properly forwarded
  // Vercel sometimes uses x-authorization instead of authorization
  if (req.headers['x-authorization'] && !req.headers.authorization) {
    req.headers.authorization = req.headers['x-authorization'];
  }
  
  // Log headers for debugging
  console.log('🔍 Vercel Function: Request headers:', {
    authorization: req.headers.authorization ? 'Present' : 'Missing',
    'x-authorization': req.headers['x-authorization'] ? 'Present' : 'Missing',
    'content-type': req.headers['content-type'],
    origin: req.headers.origin,
    host: req.headers.host,
  });
  
  try {
    const app = await createServer();
    return app(req, res);
  } catch (error) {
    console.error('❌ Vercel Function: Error creating server:', error);
    return res.status(500).json({ error: 'Server initialization failed' });
  }
}
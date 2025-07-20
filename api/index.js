// Vercel serverless function that serves the Express app
const { createServer } = require('../dist/index.js')

// Export the Express app as a Vercel serverless function
module.exports = async (req, res) => {
  const app = await createServer()
  return app(req, res)
}
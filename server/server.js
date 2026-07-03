// server/server.js

// Load environment variables FIRST
require('dotenv').config()

const validateEnv = require('./src/config/validateEnv')
const app = require('./app')
const { connectDB } = require('./src/config/db')

// Validate required ENV variables after dotenv is loaded
validateEnv()

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB()

    // Start Express server
    app.listen(PORT, () => {
      console.log(
        `🚀 Carnex API running on port ${PORT} in ${
          process.env.NODE_ENV || 'development'
        } mode`
      )
    })
  } catch (error) {
    console.error('❌ Server startup failed:', error.message)

    process.exit(1)
  }
}

startServer()

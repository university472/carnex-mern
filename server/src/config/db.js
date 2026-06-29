// server/src/config/db.js
const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables')
}

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    })

    const conn = mongoose.connection
    console.log(`MongoDB connected: ${conn.host}`)

    conn.on('error', (err) => {
      console.error('MongoDB connection error:', err.message)
    })

    conn.on('disconnected', () => {
      console.warn('MongoDB disconnected')
    })
  } catch (error) {
    console.error('MongoDB initial connection error:', error.message)
    process.exit(1)
  }
}

module.exports = { connectDB }

// server/src/config/db.js
const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables')
}

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message)
})

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected')
})

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected')
})

async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    })

    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('MongoDB initial connection error:', error.message)

    process.exit(1)
  }
}
async function closeDB() {
  await mongoose.connection.close()

  console.log(
    'MongoDB connection closed'
  )
}

module.exports = {
  connectDB,
  closeDB
}
module.exports = { connectDB }

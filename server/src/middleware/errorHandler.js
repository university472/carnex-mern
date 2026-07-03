// server/src/middleware/errorHandler.js
const ApiError = require('../utils/ApiError')

function notFoundHandler(req, res, next) {
  const error = ApiError.notFound(`Route ${req.originalUrl} not found`)
  next(error)
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500

  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  }

  res.status(statusCode).json({
    success: false,

    message:
      process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'Internal server error'
        : err.message,

    errors: process.env.NODE_ENV === 'production' ? [] : err.errors || []
  })
}

module.exports = { notFoundHandler, errorHandler }

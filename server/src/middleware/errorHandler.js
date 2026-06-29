// const ApiError = require('../utils/ApiError')

// function notFoundHandler(req, res, next) {
//   const error = ApiError.notFound(`Route ${req.originalUrl} not found`)
//   next(error)
// }

// // eslint-disable-next-line no-unused-vars
// function errorHandler(err, req, res, next) {
//   const statusCode = err.statusCode || 500

//   if (process.env.NODE_ENV !== 'production') {
//     console.error('API Error:', err)
//   }

//   res.status(statusCode).json({
//     success: false,
//     message: err.message || 'Internal server error',
//     errors: err.errors || []
//   })
// }

// module.exports = {
//   notFoundHandler,
//   errorHandler
// }


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
    console.error('API Error:', err)
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    errors: err.errors || []
  })
}

module.exports = { notFoundHandler, errorHandler }

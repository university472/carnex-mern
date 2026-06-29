// server/src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit')
const {
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_AUTH_MAX_REQUESTS
} = require('../config/constants')

const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
})

const authLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_AUTH_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.'
  }
})

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many submissions from this IP, please try again later.'
  }
})

module.exports = { generalLimiter, authLimiter, formLimiter }

// const rateLimit = require('express-rate-limit')
// const {
//   RATE_LIMIT_WINDOW_MS,
//   RATE_LIMIT_MAX_REQUESTS,
//   RATE_LIMIT_AUTH_MAX_REQUESTS
// } = require('../config/constants')

// const generalLimiter = rateLimit({
//   windowMs: RATE_LIMIT_WINDOW_MS,
//   max: RATE_LIMIT_MAX_REQUESTS,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     success: false,
//     message: 'Too many requests, please try again later.'
//   }
// })

// const authLimiter = rateLimit({
//   windowMs: RATE_LIMIT_WINDOW_MS,
//   max: RATE_LIMIT_AUTH_MAX_REQUESTS,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     success: false,
//     message: 'Too many login attempts, please try again later.'
//   }
// })

// // Stricter rate limit for public forms (finance, trade-in, etc.).
// const formLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 20,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     success: false,
//     message: 'Too many form submissions from this IP, please try again later.'
//   }
// })

// module.exports = {
//   generalLimiter,
//   authLimiter,
//   formLimiter
// }

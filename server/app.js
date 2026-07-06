// server/app.js
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
// const mongoSanitize = require('express-mongo-sanitize')
// const xssClean = require('xss-clean')
const mongoSanitize = require('./src/middleware/mongoSanitize')
const hpp = require('hpp')

// ── Admin routes ──────────────────────────────────────────────
const adminAuthRoutes = require('./src/routes/admin/auth')
const adminLeadRoutes = require('./src/routes/admin/leads')
const adminVehicleRoutes = require('./src/routes/admin/vehicles')
const adminUserRoutes = require('./src/routes/admin/users')
const adminAuditLogRoutes = require('./src/routes/admin/auditLogs')
const adminSettingsRoutes = require('./src/routes/admin/settings')
const adminAnalyticsRoutes = require('./src/routes/admin/analytics')
const adminReviewRoutes = require('./src/routes/admin/reviews')

// ── Public routes ─────────────────────────────────────────────
const publicVehicleRoutes = require('./src/routes/public/vehicles')
const publicFinanceRoutes = require('./src/routes/public/finance')
const publicTradeInRoutes = require('./src/routes/public/tradeIn')
const publicTestDriveRoutes = require('./src/routes/public/testDrive')
const publicSourcingRoutes = require('./src/routes/public/sourcing')
const publicContactRoutes = require('./src/routes/public/contact')
const publicSettingsRoutes = require('./src/routes/public/settings')
const publicAnalyticsRoutes = require('./src/routes/public/analytics')
const publicReviewRoutes = require('./src/routes/public/reviews')

// ── Middleware ────────────────────────────────────────────────
const {
  generalLimiter,
  authLimiter,
  formLimiter
} = require('./src/middleware/rateLimiter')
const {
  notFoundHandler,
  errorHandler
} = require('./src/middleware/errorHandler')
const ApiResponse = require('./src/utils/ApiResponse')
const { API_PREFIX } = require('./src/config/constants')

const app = express()
app.set('trust proxy', 1)

// 1) Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    }
  })
)

// 2) CORS
// const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173']
const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(',')
  : ['http://localhost:5173']
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true
  })
)

// 3) Logging & compression
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
app.use(compression())

// 4) Global rate limiter
app.use(generalLimiter)

// 5) Body parsers & cookies
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// // 6) Sanitization
// app.use(mongoSanitize())
// app.use(xssClean())

app.use(mongoSanitize)
// 7) HPP
app.use(hpp({ whitelist: ['sort', 'filters', 'page', 'limit'] }))

// 8) Health check
app.get(`${API_PREFIX}/health`, (_req, res) => {
  res.json(new ApiResponse(200, { uptime: process.uptime() }, 'API is healthy'))
})

// ── 9) Admin routes ───────────────────────────────────────────
// app.use(`${API_PREFIX}/admin/auth`, authLimiter, adminAuthRoutes)
app.use(`${API_PREFIX}/admin/auth`, authLimiter, adminAuthRoutes)
app.use(`${API_PREFIX}/admin/leads`, adminLeadRoutes)
app.use(`${API_PREFIX}/admin/vehicles`, adminVehicleRoutes)
app.use(`${API_PREFIX}/admin/users`, adminUserRoutes)
app.use(`${API_PREFIX}/admin/audit-logs`, adminAuditLogRoutes)
app.use(`${API_PREFIX}/admin/settings`, adminSettingsRoutes)
app.use(`${API_PREFIX}/admin/analytics`, adminAnalyticsRoutes)
app.use(`${API_PREFIX}/admin/reviews`, adminReviewRoutes)

// ── 10) Public routes ─────────────────────────────────────────
app.use(`${API_PREFIX}/vehicles`, publicVehicleRoutes)
app.use(`${API_PREFIX}/finance`, formLimiter, publicFinanceRoutes)
app.use(`${API_PREFIX}/trade-in`, formLimiter, publicTradeInRoutes)
app.use(`${API_PREFIX}/test-drive`, formLimiter, publicTestDriveRoutes)
app.use(`${API_PREFIX}/sourcing`, formLimiter, publicSourcingRoutes)
app.use(`${API_PREFIX}/contact`, formLimiter, publicContactRoutes)
app.use(`${API_PREFIX}/settings`, publicSettingsRoutes)
app.use(`${API_PREFIX}/analytics`, publicAnalyticsRoutes)
app.use(`${API_PREFIX}/reviews`, publicReviewRoutes)

// ── 11) 404 + error handler ───────────────────────────────────
app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app

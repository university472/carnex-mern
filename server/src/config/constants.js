// server/src/config/constants.js

const ONE_MINUTE = 60 * 1000

module.exports = {
  API_PREFIX: '/api',

  // General website browsing
  RATE_LIMIT_WINDOW_MS: 6 * ONE_MINUTE,
  RATE_LIMIT_MAX_REQUESTS: 10000,

  // Admin login + OTP
  RATE_LIMIT_AUTH_MAX_REQUESTS: 60
}

// server/src/config/constants.js
const ONE_MINUTE = 60 * 1000

module.exports = {
  API_PREFIX: '/api',
  RATE_LIMIT_WINDOW_MS: 15 * ONE_MINUTE,
  RATE_LIMIT_MAX_REQUESTS: 100,
  RATE_LIMIT_AUTH_MAX_REQUESTS: 15
}

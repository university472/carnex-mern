// server/src/utils/pagination.js
function getPaginationParams(query, defaultLimit = 20, maxLimit = 100) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1)
  const limitRaw = parseInt(query.limit, 10) || defaultLimit
  const limit = Math.min(Math.max(limitRaw, 1), maxLimit) // hard cap to protect API.[web:213]
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

module.exports = {
  getPaginationParams
}

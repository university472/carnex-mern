// server/src/controllers/admin/auditLogController.js
const AuditLog = require('../../models/AuditLog')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { getPaginationParams } = require('../../utils/pagination')

async function getAuditLogs(req, res, next) {
  try {
    const { page, limit, skip } = getPaginationParams(req.query, 25, 100)
    const { search, action, entity } = req.query

    const query = {}
    if (action) query.action = action
    if (entity) query.entity = entity
    if (search) {
      const regex = new RegExp(search, 'i')
      query.$or = [
        { action: regex },
        { 'actor.email': regex },
        { entity: regex }
      ]
    }

    const [items, totalItems] = await Promise.all([
      AuditLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(query)
    ])

    const totalPages = Math.ceil(totalItems / limit) || 1

    return res.json(
      new ApiResponse(
        200,
        {
          items,
          pagination: {
            page,
            limit,
            totalItems,
            totalPages,
            hasNextPage: page < totalPages
          }
        },
        'Audit logs fetched successfully'
      )
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

module.exports = { getAuditLogs }

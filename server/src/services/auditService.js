// import AuditLog from '../models/AuditLog.js'

// export const logAction = async (
//   actor,
//   action,
//   entity,
//   entityId,
//   changes = {},
//   req = {}
// ) => {
//   try {
//     const actorSnapshot = actor
//       ? {
//           id: actor.id || actor._id,
//           name: actor.name,
//           email: actor.email,
//           role: actor.role
//         }
//       : null

//     await AuditLog.create({
//       actor: actorSnapshot,
//       action,
//       entity,
//       entityId: String(entityId),
//       changes,
//       ip: req.ip,
//       userAgent: req.headers?.['user-agent']
//     })
//   } catch (err) {
//     // Logging must never break request handling
//     // eslint-disable-next-line no-console
//     console.error('Failed to write audit log', err)
//   }
// }

// server/src/services/auditService.js
let AuditLog

const getModel = () => {
  if (!AuditLog) {
    try {
      AuditLog = require('../models/AuditLog')
    } catch {
      AuditLog = null
    }
  }
  return AuditLog
}

const logAction = async (
  actor,
  action,
  entity,
  entityId,
  changes = {},
  req = {}
) => {
  try {
    const Model = getModel()
    if (!Model) return

    const actorSnapshot = actor
      ? {
          id: actor.id || actor._id,
          name: actor.name,
          email: actor.email,
          role: actor.role
        }
      : null

    await Model.create({
      actor: actorSnapshot,
      action,
      entity,
      entityId: String(entityId),
      changes,
      ip: req.ip,
      userAgent: req.headers?.['user-agent']
    })
  } catch (err) {
    console.error('Failed to write audit log:', err.message)
  }
}

module.exports = { logAction }

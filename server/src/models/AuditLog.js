// server/src/models/AuditLog.js
const mongoose = require('mongoose')

const { Schema } = mongoose

const actorSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId },
    name: String,
    email: String,
    role: String
  },
  { _id: false }
)

const auditLogSchema = new Schema(
  {
    actor: actorSchema,
    action: { type: String, required: true, trim: true },
    entity: { type: String, required: true, trim: true },
    entityId: { type: String, trim: true },
    changes: { type: Schema.Types.Mixed, default: {} },
    ipHash: String,
    userAgent: String
  },
  { timestamps: true }
)

auditLogSchema.index({ createdAt: -1 })
auditLogSchema.index({ action: 1, entity: 1 })
auditLogSchema.index({ 'actor.id': 1 })

const AuditLog = mongoose.model('AuditLog', auditLogSchema)

module.exports = AuditLog

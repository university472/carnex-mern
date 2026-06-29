// const FinanceApplication = require('../../models/FinanceApplication')
// const TradeInRequest = require('../../models/TradeInRequest')
// const TestDriveRequest = require('../../models/TestDriveRequest')
// const SourcingRequest = require('../../models/SourcingRequest')
// const ContactMessage = require('../../models/ContactMessage')
// const ApiError = require('../../utils/ApiError')
// const ApiResponse = require('../../utils/ApiResponse')
// const { getPaginationParams } = require('../../utils/pagination')

// // ── Model map ─────────────────────────────────────────────────
// const MODEL_MAP = {
//   finance: FinanceApplication,
//   'trade-in': TradeInRequest,
//   'test-drive': TestDriveRequest,
//   sourcing: SourcingRequest,
//   contact: ContactMessage
// }

// // ── Dashboard summary ─────────────────────────────────────────
// async function getLeadSummary(req, res, next) {
//   try {
//     const since = new Date()
//     since.setDate(since.getDate() - 7)

//     const [
//       totalFinance,
//       newFinance,
//       totalTradeIn,
//       newTradeIn,
//       totalTestDrive,
//       newTestDrive,
//       totalSourcing,
//       newSourcing,
//       totalContact,
//       newContact
//     ] = await Promise.all([
//       FinanceApplication.countDocuments({}),
//       FinanceApplication.countDocuments({ createdAt: { $gte: since } }),
//       TradeInRequest.countDocuments({}),
//       TradeInRequest.countDocuments({ createdAt: { $gte: since } }),
//       TestDriveRequest.countDocuments({}),
//       TestDriveRequest.countDocuments({ createdAt: { $gte: since } }),
//       SourcingRequest.countDocuments({}),
//       SourcingRequest.countDocuments({ createdAt: { $gte: since } }),
//       ContactMessage.countDocuments({}),
//       ContactMessage.countDocuments({ createdAt: { $gte: since } })
//     ])

//     return res.json(
//       new ApiResponse(
//         200,
//         {
//           finance: { total: totalFinance, last7Days: newFinance },
//           tradeIn: { total: totalTradeIn, last7Days: newTradeIn },
//           testDrive: { total: totalTestDrive, last7Days: newTestDrive },
//           sourcing: { total: totalSourcing, last7Days: newSourcing },
//           contact: { total: totalContact, last7Days: newContact }
//         },
//         'Lead summary fetched successfully'
//       )
//     )
//   } catch (err) {
//     return next(ApiError.internal(err.message))
//   }
// }

// // ── Generic paginated list ────────────────────────────────────
// async function listLeads(Model, req, res, next, options = {}) {
//   try {
//     const { page, limit, skip } = getPaginationParams(req.query, 20, 100)
//     const { status, search } = req.query

//     const query = {}
//     if (status) query.status = status
//     if (search) {
//       const regex = new RegExp(search, 'i')
//       query.$or = [
//         { name: regex },
//         { email: regex },
//         { phone: regex },
//         { firstName: regex },
//         { lastName: regex }
//       ]
//     }

//     const sortOption = options.sort || { createdAt: -1 }

//     const [items, totalItems] = await Promise.all([
//       Model.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
//       Model.countDocuments(query)
//     ])

//     const totalPages = Math.ceil(totalItems / limit) || 1

//     return res.json(
//       new ApiResponse(
//         200,
//         {
//           items,
//           pagination: {
//             page,
//             limit,
//             totalItems,
//             totalPages,
//             hasNextPage: page < totalPages
//           }
//         },
//         options.message || 'Leads fetched successfully'
//       )
//     )
//   } catch (err) {
//     return next(ApiError.internal(err.message))
//   }
// }

// // ── Get single lead by type + id ─────────────────────────────
// async function getLeadById(req, res, next) {
//   try {
//     const { type, id } = req.params
//     const Model = MODEL_MAP[type]

//     if (!Model) return next(ApiError.badRequest(`Unknown lead type: ${type}`))

//     const lead = await Model.findById(id).lean()
//     if (!lead) return next(ApiError.notFound('Lead not found'))

//     return res.json(new ApiResponse(200, lead, 'Lead fetched successfully'))
//   } catch (err) {
//     return next(ApiError.internal(err.message))
//   }
// }

// // ── Update lead status / notes ────────────────────────────────
// async function updateLead(req, res, next) {
//   try {
//     const { type, id } = req.params
//     const Model = MODEL_MAP[type]

//     if (!Model) return next(ApiError.badRequest(`Unknown lead type: ${type}`))

//     const allowedFields = ['status', 'notes']
//     const update = {}
//     for (const field of allowedFields) {
//       if (req.body[field] !== undefined) update[field] = req.body[field]
//     }

//     const updated = await Model.findByIdAndUpdate(id, update, {
//       new: true,
//       runValidators: false
//     }).lean()
//     if (!updated) return next(ApiError.notFound('Lead not found'))

//     return res.json(new ApiResponse(200, updated, 'Lead updated successfully'))
//   } catch (err) {
//     return next(ApiError.internal(err.message))
//   }
// }

// // ── Individual list handlers ──────────────────────────────────
// async function getFinanceLeads(req, res, next) {
//   return listLeads(FinanceApplication, req, res, next, {
//     message: 'Finance applications fetched successfully'
//   })
// }
// async function getTradeInLeads(req, res, next) {
//   return listLeads(TradeInRequest, req, res, next, {
//     message: 'Trade-in requests fetched successfully'
//   })
// }
// async function getTestDriveLeads(req, res, next) {
//   return listLeads(TestDriveRequest, req, res, next, {
//     message: 'Test drive requests fetched successfully'
//   })
// }
// async function getSourcingLeads(req, res, next) {
//   return listLeads(SourcingRequest, req, res, next, {
//     message: 'Sourcing requests fetched successfully'
//   })
// }
// async function getContactLeads(req, res, next) {
//   return listLeads(ContactMessage, req, res, next, {
//     message: 'Contact messages fetched successfully'
//   })
// }

// module.exports = {
//   getLeadSummary,
//   getLeadById,
//   updateLead,
//   getFinanceLeads,
//   getTradeInLeads,
//   getTestDriveLeads,
//   getSourcingLeads,
//   getContactLeads
// }

// server/src/controllers/admin/leadController.js
const FinanceApplication = require('../../models/FinanceApplication')
const TradeInRequest = require('../../models/TradeInRequest')
const TestDriveRequest = require('../../models/TestDriveRequest')
const SourcingRequest = require('../../models/SourcingRequest')
const ContactMessage = require('../../models/ContactMessage')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { getPaginationParams } = require('../../utils/pagination')
console.log('---------------- MODELS ----------------')
console.log('FinanceApplication:', typeof FinanceApplication)
console.log('TradeInRequest:', typeof TradeInRequest)
console.log('TestDriveRequest:', typeof TestDriveRequest)
console.log('SourcingRequest:', typeof SourcingRequest)
console.log('ContactMessage:', typeof ContactMessage)

console.log('Finance countDocuments:', typeof FinanceApplication.countDocuments)
console.log('Trade countDocuments:', typeof TradeInRequest.countDocuments)
console.log('TestDrive countDocuments:', typeof TestDriveRequest.countDocuments)
console.log('Sourcing countDocuments:', typeof SourcingRequest.countDocuments)
console.log('Contact countDocuments:', typeof ContactMessage.countDocuments)

// ── Model map — keys must match :type param in route ─────────
const MODEL_MAP = {
  finance: FinanceApplication,
  'trade-in': TradeInRequest,
  'test-drive': TestDriveRequest,
  sourcing: SourcingRequest,
  contact: ContactMessage
}

// ── Dashboard summary ─────────────────────────────────────────
async function getLeadSummary(req, res, next) {
  try {
    console.log('Finance')
    console.log(await FinanceApplication.countDocuments())

    console.log('Trade')
    console.log(await TradeInRequest.countDocuments())

    console.log('TestDrive')
    console.log(await TestDriveRequest.countDocuments())

    console.log('Sourcing')
    console.log(await SourcingRequest.countDocuments())

    console.log('Contact')
    console.log(await ContactMessage.countDocuments())

    const since = new Date()
    since.setDate(since.getDate() - 7)

    const [
      totalFinance,
      newFinance,
      totalTradeIn,
      newTradeIn,
      totalTestDrive,
      newTestDrive,
      totalSourcing,
      newSourcing,
      totalContact,
      newContact
    ] = await Promise.all([
      FinanceApplication.countDocuments({}),
      FinanceApplication.countDocuments({ createdAt: { $gte: since } }),
      TradeInRequest.countDocuments({}),
      TradeInRequest.countDocuments({ createdAt: { $gte: since } }),
      TestDriveRequest.countDocuments({}),
      TestDriveRequest.countDocuments({ createdAt: { $gte: since } }),
      SourcingRequest.countDocuments({}),
      SourcingRequest.countDocuments({ createdAt: { $gte: since } }),
      ContactMessage.countDocuments({}),
      ContactMessage.countDocuments({ createdAt: { $gte: since } })
    ])

    return res.json(
      new ApiResponse(
        200,
        {
          finance: { total: totalFinance, last7Days: newFinance },
          tradeIn: { total: totalTradeIn, last7Days: newTradeIn },
          testDrive: { total: totalTestDrive, last7Days: newTestDrive },
          sourcing: { total: totalSourcing, last7Days: newSourcing },
          contact: { total: totalContact, last7Days: newContact }
        },
        'Lead summary fetched successfully'
      )
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

// ── Generic paginated list ────────────────────────────────────
async function listLeads(Model, req, res, next, options = {}) {
  try {
    const { page, limit, skip } = getPaginationParams(req.query, 20, 100)
    const { status, search } = req.query

    const query = {}
    if (status) query.status = status
    if (search) {
      const regex = new RegExp(search, 'i')
      query.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { firstName: regex },
        { lastName: regex }
      ]
    }

    const sortOption = options.sort || { createdAt: -1 }

    const [items, totalItems] = await Promise.all([
      Model.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
      Model.countDocuments(query)
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
        options.message || 'Leads fetched successfully'
      )
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

// ── GET single lead by type + id ──────────────────────────────
async function getLeadById(req, res, next) {
  try {
    const { type, id } = req.params

    const Model = MODEL_MAP[type]
    if (!Model) {
      return next(
        ApiError.badRequest(
          `Unknown lead type: "${type}". Valid types: ${Object.keys(MODEL_MAP).join(', ')}`
        )
      )
    }

    if (!id || id.length !== 24) {
      return next(ApiError.badRequest('Invalid lead ID format'))
    }

    const lead = await Model.findById(id).lean()
    if (!lead) {
      return next(ApiError.notFound(`Lead not found with id: ${id}`))
    }

    return res.json(new ApiResponse(200, lead, 'Lead fetched successfully'))
  } catch (err) {
    if (err.name === 'CastError') {
      return next(ApiError.badRequest('Invalid lead ID'))
    }
    return next(ApiError.internal(err.message))
  }
}

// ── PATCH lead status / notes ─────────────────────────────────
async function updateLead(req, res, next) {
  try {
    const { type, id } = req.params

    const Model = MODEL_MAP[type]
    if (!Model) {
      return next(ApiError.badRequest(`Unknown lead type: "${type}"`))
    }

    const allowedFields = ['status', 'notes']
    const update = {}
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field]
      }
    }

    if (Object.keys(update).length === 0) {
      return next(ApiError.badRequest('No valid fields to update'))
    }

    const updated = await Model.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: false
    }).lean()

    if (!updated) {
      return next(ApiError.notFound('Lead not found'))
    }

    return res.json(new ApiResponse(200, updated, 'Lead updated successfully'))
  } catch (err) {
    if (err.name === 'CastError') {
      return next(ApiError.badRequest('Invalid lead ID'))
    }
    return next(ApiError.internal(err.message))
  }
}

// ── Individual list handlers ──────────────────────────────────
async function getFinanceLeads(req, res, next) {
  return listLeads(FinanceApplication, req, res, next, {
    message: 'Finance applications fetched successfully'
  })
}

async function getTradeInLeads(req, res, next) {
  return listLeads(TradeInRequest, req, res, next, {
    message: 'Trade-in requests fetched successfully'
  })
}

async function getTestDriveLeads(req, res, next) {
  return listLeads(TestDriveRequest, req, res, next, {
    message: 'Test drive requests fetched successfully'
  })
}

async function getSourcingLeads(req, res, next) {
  return listLeads(SourcingRequest, req, res, next, {
    message: 'Sourcing requests fetched successfully'
  })
}

async function getContactLeads(req, res, next) {
  return listLeads(ContactMessage, req, res, next, {
    message: 'Contact messages fetched successfully'
  })
}

module.exports = {
  getLeadSummary,
  getLeadById,
  updateLead,
  getFinanceLeads,
  getTradeInLeads,
  getTestDriveLeads,
  getSourcingLeads,
  getContactLeads
}

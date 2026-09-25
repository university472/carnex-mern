// server/src/controllers/admin/financeController.js
const escapeStringRegexp = require('escape-string-regexp')
const Vehicle = require('../../models/Vehicle')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { getPaginationParams } = require('../../utils/pagination')

function safeRegex(value) {
  return new RegExp(escapeStringRegexp(value), 'i')
}

function orZero(path) {
  return { $ifNull: [path, 0] }
}

function parseDate(value) {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function resolveDateRange(query) {
  const to = parseDate(query.to) || new Date()
  to.setHours(23, 59, 59, 999)

  let from = parseDate(query.from)
  if (!from) {
    from = new Date(to)
    from.setDate(from.getDate() - 30)
  }
  from.setHours(0, 0, 0, 0)

  return { from, to }
}

// GET /api/admin/finance/overview
async function adminGetFinanceOverview(req, res, next) {
  try {
    const { from, to } = resolveDateRange(req.query)

    const [inventorySnapshot, soldInRange] = await Promise.all([
      Vehicle.aggregate([
        { $match: { status: { $ne: 'sold' } } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalInvestment: { $sum: orZero('$finance.totals.totalInvestment') }
          }
        }
      ]),
      Vehicle.aggregate([
        {
          $match: {
            status: 'sold',
            soldAt: { $gte: from, $lte: to }
          }
        },
        {
          $group: {
            _id: null,
            vehiclesSold: { $sum: 1 },
            // Vehicles sold before finance tracking existed have no totals —
            // fall back to soldPrice so they still count toward revenue.
            revenue: {
              $sum: {
                $ifNull: ['$finance.totals.grossSaleAmount', orZero('$soldPrice')]
              }
            },
            totalInvestment: { $sum: orZero('$finance.totals.totalInvestment') },
            totalExpenses: { $sum: orZero('$finance.totals.totalExpenses') },
            totalTaxes: { $sum: orZero('$finance.totals.totalTaxes') },
            taxCollectedFromCustomers: { $sum: orZero('$finance.customerSalesTax') },
            taxRemittedByCompany: {
              $sum: {
                $add: [
                  orZero('$finance.taxRemittedByCompany'),
                  orZero('$finance.otherTaxesFees')
                ]
              }
            },
            grossProfit: { $sum: orZero('$finance.totals.grossProfit') },
            netProfit: { $sum: orZero('$finance.totals.netProfit') }
          }
        }
      ])
    ])

    const inventory = inventorySnapshot[0] || { count: 0, totalInvestment: 0 }
    const sold = soldInRange[0] || {
      vehiclesSold: 0,
      revenue: 0,
      totalInvestment: 0,
      totalExpenses: 0,
      totalTaxes: 0,
      taxCollectedFromCustomers: 0,
      taxRemittedByCompany: 0,
      grossProfit: 0,
      netProfit: 0
    }

    return res.json(
      new ApiResponse(
        200,
        {
          range: { from, to },
          inventory: {
            vehicleCount: inventory.count || 0,
            totalInvestment: inventory.totalInvestment || 0
          },
          period: {
            vehiclesSold: sold.vehiclesSold || 0,
            revenue: sold.revenue || 0,
            totalInvestment: sold.totalInvestment || 0,
            totalExpenses: sold.totalExpenses || 0,
            totalTaxes: sold.totalTaxes || 0,
            taxCollectedFromCustomers: sold.taxCollectedFromCustomers || 0,
            taxRemittedByCompany: sold.taxRemittedByCompany || 0,
            grossProfit: sold.grossProfit || 0,
            netProfit: sold.netProfit || 0,
            avgNetProfitPerVehicle: sold.vehiclesSold
              ? sold.netProfit / sold.vehiclesSold
              : 0
          }
        },
        'Finance overview fetched successfully'
      )
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

// GET /api/admin/finance/vehicles
async function adminGetFinanceVehicles(req, res, next) {
  try {
    const { page, limit, skip } = getPaginationParams(req.query, 20, 100)
    const { status, from, to, search, sort = 'soldAt-desc' } = req.query

    const query = {}
    if (typeof status === 'string' && status) query.status = status

    const fromDate = parseDate(from)
    const toDate = parseDate(to)
    if (fromDate || toDate) {
      query.soldAt = {}
      if (fromDate) {
        fromDate.setHours(0, 0, 0, 0)
        query.soldAt.$gte = fromDate
      }
      if (toDate) {
        toDate.setHours(23, 59, 59, 999)
        query.soldAt.$lte = toDate
      }
    }

    if (typeof search === 'string' && search) {
      const regex = safeRegex(search)
      query.$or = [
        { title: regex },
        { make: regex },
        { model: regex },
        { vin: regex },
        { stockNumber: regex }
      ]
    }

    let sortOption = { soldAt: -1 }
    if (sort === 'soldAt-asc') sortOption = { soldAt: 1 }
    if (sort === 'netProfit-desc') sortOption = { 'finance.totals.netProfit': -1 }
    if (sort === 'netProfit-asc') sortOption = { 'finance.totals.netProfit': 1 }

    const [items, totalItems] = await Promise.all([
      Vehicle.find(query)
        .select(
          'title year make model vin stockNumber status price soldPrice soldAt finance'
        )
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Vehicle.countDocuments(query)
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
        'Vehicle profit report fetched successfully'
      )
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

module.exports = {
  adminGetFinanceOverview,
  adminGetFinanceVehicles
}

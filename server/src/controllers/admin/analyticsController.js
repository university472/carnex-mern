// server/src/controllers/admin/analyticsController.js
const PageView = require('../../models/PageView')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')

/**
 * GET /api/admin/analytics/summary
 * Returns visitor summary stats for the dashboard.
 */
async function getAnalyticsSummary(req, res, next) {
  try {
    const now = new Date()

    const today = new Date(now)
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const last7Days = new Date(today)
    last7Days.setDate(last7Days.getDate() - 7)
    const last30Days = new Date(today)
    last30Days.setDate(last30Days.getDate() - 30)

    const [
      totalViews,
      todayViews,
      yesterdayViews,
      last7DaysViews,
      last30DaysViews,

      // Unique visitors (by ipHash) in last 30 days
      uniqueVisitors30,

      // Top pages in last 30 days
      topPages,

      // Device breakdown in last 30 days
      deviceBreakdown,

      // Browser breakdown in last 30 days
      browserBreakdown,

      // Hourly visits today (for chart)
      hourlyToday,

      // Daily visits last 30 days (for chart)
      dailyLast30
    ] = await Promise.all([
      // Total all time
      PageView.countDocuments({}),

      // Today
      PageView.countDocuments({ createdAt: { $gte: today } }),

      // Yesterday
      PageView.countDocuments({
        createdAt: { $gte: yesterday, $lt: today }
      }),

      // Last 7 days
      PageView.countDocuments({ createdAt: { $gte: last7Days } }),

      // Last 30 days
      PageView.countDocuments({ createdAt: { $gte: last30Days } }),

      // Unique IPs last 30 days
      PageView.distinct('ipHash', {
        createdAt: { $gte: last30Days }
      }).then((arr) => arr.length),

      // Top pages last 30 days
      PageView.aggregate([
        { $match: { createdAt: { $gte: last30Days } } },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 }
      ]),

      // Device breakdown last 30 days
      PageView.aggregate([
        { $match: { createdAt: { $gte: last30Days } } },
        { $group: { _id: '$device', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      // Browser breakdown last 30 days
      PageView.aggregate([
        { $match: { createdAt: { $gte: last30Days } } },
        { $group: { _id: '$browser', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 }
      ]),

      // Hourly visits today (0–23)
      PageView.aggregate([
        { $match: { createdAt: { $gte: today } } },
        {
          $group: {
            _id: { $hour: '$createdAt' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Daily visits last 30 days
      PageView.aggregate([
        { $match: { createdAt: { $gte: last30Days } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ])
    ])

    // Format hourly data — fill gaps with 0
    const hourlyMap = {}
    hourlyToday.forEach(({ _id, count }) => {
      hourlyMap[_id] = count
    })
    const hourlyData = Array.from({ length: 24 }, (_, h) => ({
      hour: `${String(h).padStart(2, '0')}:00`,
      views: hourlyMap[h] || 0
    }))

    // Format daily data
    const dailyData = dailyLast30.map(({ _id, count }) => ({
      date: `${_id.year}-${String(_id.month).padStart(2, '0')}-${String(_id.day).padStart(2, '0')}`,
      views: count
    }))

    // Percentage change vs yesterday
    const changeVsYesterday =
      yesterdayViews > 0
        ? Math.round(((todayViews - yesterdayViews) / yesterdayViews) * 100)
        : todayViews > 0
          ? 100
          : 0

    return res.json(
      new ApiResponse(
        200,
        {
          overview: {
            totalViews,
            todayViews,
            yesterdayViews,
            last7DaysViews,
            last30DaysViews,
            uniqueVisitors30,
            changeVsYesterday
          },
          topPages: topPages.map((p) => ({
            page: p._id || 'Unknown',
            views: p.count
          })),
          deviceBreakdown: deviceBreakdown.map((d) => ({
            device: d._id || 'unknown',
            count: d.count
          })),
          browserBreakdown: browserBreakdown.map((b) => ({
            browser: b._id || 'unknown',
            count: b.count
          })),
          hourlyToday: hourlyData,
          dailyLast30: dailyData
        },
        'Analytics summary fetched successfully'
      )
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

/**
 * GET /api/admin/analytics/recent
 * Returns the last 50 page views for the live feed.
 */
async function getRecentVisits(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100)

    const visits = await PageView.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    return res.json(
      new ApiResponse(200, { visits }, 'Recent visits fetched successfully')
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

module.exports = { getAnalyticsSummary, getRecentVisits }

// server/src/controllers/public/googleReviewController.js
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { fetchGoogleReviews } = require('../../services/googleReviewService')

/**
 * GET /api/google-reviews
 * Public: real reviews pulled from the business's Google Business Profile.
 */
async function getGoogleReviews(req, res, next) {
  try {
    const data = await fetchGoogleReviews()

    if (!data) {
      return res.json(
        new ApiResponse(200, null, 'Google reviews are not configured yet')
      )
    }

    return res.json(
      new ApiResponse(200, data, 'Google reviews fetched successfully')
    )
  } catch (err) {
    console.error('========== GOOGLE REVIEWS ERROR ==========')
    console.error(err.message)
    return next(ApiError.internal('Failed to fetch Google reviews'))
  }
}

module.exports = { getGoogleReviews }

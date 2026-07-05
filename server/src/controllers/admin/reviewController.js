const Review = require('../../models/Review')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { getPaginationParams } = require('../../utils/pagination')

exports.getReviews = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query, 20, 100)
    const { status } = req.query
    const filter = {}
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status
    }

    const [items, totalItems] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter)
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
        'Reviews fetched'
      )
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

exports.approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    )
    if (!review) return next(ApiError.notFound('Review not found'))
    return res.json(new ApiResponse(200, review, 'Review approved'))
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

exports.rejectReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    )
    if (!review) return next(ApiError.notFound('Review not found'))
    return res.json(new ApiResponse(200, review, 'Review rejected'))
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

exports.toggleVerified = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return next(ApiError.notFound('Review not found'))

    review.isVerifiedBuyer = !review.isVerifiedBuyer
    await review.save()
    return res.json(new ApiResponse(200, review, 'Verification toggled'))
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return next(ApiError.notFound('Review not found'))

    // Delete images from Cloudinary
    const deleteFromCloudinary = (() => {
      try {
        return require('../../middleware/upload').deleteFromCloudinary
      } catch {
        return null
      }
    })()

    if (review.images.length && deleteFromCloudinary) {
      await Promise.all(
        review.images.map((img) => deleteFromCloudinary(img.publicId))
      )
    }

    await review.deleteOne()
    return res.json(new ApiResponse(200, null, 'Review deleted'))
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

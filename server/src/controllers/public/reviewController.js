const { validationResult } = require('express-validator')
const Review = require('../../models/Review')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
let uploadToCloudinary
try {
  const uploadModule = require('../../middleware/upload')
  uploadToCloudinary = uploadModule.uploadToCloudinary
} catch {
  uploadToCloudinary = null
}

async function processUploadedFiles(files) {
  if (!files || !files.length || !uploadToCloudinary) return []
  const results = await Promise.all(
    files.map((f) => uploadToCloudinary(f.buffer, 'carnex/reviews'))
  )
  return results.map(({ url, publicId }) => ({ url, publicId }))
}

exports.submitReview = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return next(ApiError.badRequest('Validation failed', errors.array()))

    const {
      customerName,
      email,
      location,
      purchasedVehicle,
      rating,
      reviewText
    } = req.body
    const uploadedImages = await processUploadedFiles(req.files)

    const review = await Review.create({
      customerName,
      email,
      location,
      purchasedVehicle,
      rating: Number(rating),
      reviewText,
      images: uploadedImages,
      status: 'pending'
    })

    return res
      .status(201)
      .json(
        new ApiResponse(201, review, 'Review submitted and pending approval')
      )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

exports.getApprovedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()

    return res.json(new ApiResponse(200, reviews, 'Approved reviews fetched'))
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

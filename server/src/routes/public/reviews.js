const express = require('express')
const router = express.Router()
const {
  submitReview,
  getApprovedReviews
} = require('../../controllers/public/reviewController')
const { reviewValidator } = require('../../validators/reviewValidators')

// Multer upload (same config, max 6 images)
let uploadMiddleware
try {
  const { upload } = require('../../middleware/upload')
  uploadMiddleware = upload.array('images', 6)
} catch {
  uploadMiddleware = (req, res, next) => next()
}

// Public: submit a review (with images)
router.post('/', uploadMiddleware, reviewValidator, submitReview)

// Public: get approved reviews for homepage
router.get('/', getApprovedReviews)

module.exports = router

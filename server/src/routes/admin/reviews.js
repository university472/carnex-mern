const express = require('express')
const auth = require('../../middleware/auth')
const authorize = require('../../middleware/authorize')
const {
  getReviews,
  approveReview,
  rejectReview,
  toggleVerified,
  deleteReview
} = require('../../controllers/admin/reviewController')

const router = express.Router()

router.use(auth(true))

// All admin roles can manage reviews
router.get(
  '/',
  authorize('super-admin', 'admin', 'sales', 'viewer'),
  getReviews
)
router.patch('/:id/approve', authorize('super-admin', 'admin'), approveReview)
router.patch('/:id/reject', authorize('super-admin', 'admin'), rejectReview)
router.patch(
  '/:id/toggle-verify',
  authorize('super-admin', 'admin'),
  toggleVerified
)
router.delete('/:id', authorize('super-admin', 'admin'), deleteReview)

module.exports = router

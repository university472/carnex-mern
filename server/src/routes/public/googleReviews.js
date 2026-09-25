// server/src/routes/public/googleReviews.js
const express = require('express')
const router = express.Router()
const { getGoogleReviews } = require('../../controllers/public/googleReviewController')

router.get('/', getGoogleReviews)

module.exports = router

const express = require('express')
const Notification = require('../../models/Notification')
const auth = require('../../middleware/auth')
const ApiResponse = require('../../utils/ApiResponse')

const router = express.Router()

// GET notifications
router.get('/', auth(), async (req, res, next) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20)

    res.json(new ApiResponse(200, notifications, 'Notifications fetched'))
  } catch (err) {
    next(err)
  }
})

// unread count
router.get('/count', auth(), async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      isRead: false
    })

    res.json(new ApiResponse(200, { count }, 'Unread count'))
  } catch (err) {
    next(err)
  }
})

// mark as read
router.patch('/:id/read', auth(), async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true
    })

    res.json(new ApiResponse(200, null, 'Notification marked read'))
  } catch (err) {
    next(err)
  }
})

module.exports = router

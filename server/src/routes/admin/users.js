// server/src/routes/admin/users.js
const express = require('express')
const auth = require('../../middleware/auth')
const authorize = require('../../middleware/authorize')
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../../controllers/admin/userController')

const router = express.Router()

router.use(auth(true), authorize('super-admin'))

// GET  /api/admin/users
router.get('/', getUsers)

// POST /api/admin/users
router.post('/', createUser)

// PATCH /api/admin/users/:id
router.patch('/:id', updateUser)

// DELETE /api/admin/users/:id
router.delete('/:id', deleteUser)

module.exports = router

// server/src/controllers/admin/userController.js
const User = require('../../models/User')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { logAction } = require('../../services/auditService')

async function getUsers(req, res, next) {
  try {
    const users = await User.find({})
      .select('-password -mfaSecret')
      .sort({ createdAt: -1 })
      .lean()

    return res.json(new ApiResponse(200, users, 'Users fetched successfully'))
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

async function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return next(ApiError.badRequest('Name, email, and password are required'))
    }

    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) {
      return next(ApiError.badRequest('A user with this email already exists'))
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'admin'
    })

    await logAction(req.admin, 'USER_CREATED', 'user', user._id, { email }, req)

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { id: user._id, name: user.name, email: user.email, role: user.role },
          'User created successfully'
        )
      )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params
    const { name, role, isActive } = req.body

    const user = await User.findById(id)
    if (!user) return next(ApiError.notFound('User not found'))

    if (user.role === 'super-admin' && req.admin.id.toString() !== id) {
      return next(ApiError.forbidden('Cannot modify another super-admin'))
    }

    if (name) user.name = name
    if (role) user.role = role
    if (typeof isActive === 'boolean') user.isActive = isActive

    await user.save({ validateBeforeSave: false })

    await logAction(
      req.admin,
      'USER_UPDATED',
      'user',
      user._id,
      { name, role, isActive },
      req
    )

    return res.json(
      new ApiResponse(
        200,
        { id: user._id, name: user.name, email: user.email, role: user.role },
        'User updated'
      )
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params

    const user = await User.findById(id)
    if (!user) return next(ApiError.notFound('User not found'))

    if (user.role === 'super-admin') {
      return next(ApiError.forbidden('Cannot delete a super-admin account'))
    }

    await User.findByIdAndDelete(id)

    await logAction(
      req.admin,
      'USER_DELETED',
      'user',
      id,
      { email: user.email },
      req
    )

    return res.json(new ApiResponse(200, null, 'User deleted successfully'))
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

module.exports = { getUsers, createUser, updateUser, deleteUser }

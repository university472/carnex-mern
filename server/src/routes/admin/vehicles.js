// server/src/routes/admin/vehicles.js
const express = require('express')
const auth = require('../../middleware/auth')
const parseVehicleData = require('../../middleware/parseVehicleData')
const authorize = require('../../middleware/authorize')
const {
  adminGetVehicles,
  adminGetVehicleById,
  adminCreateVehicle,
  adminUpdateVehicle,
  adminUpdateVehicleStatus,
  adminSoftDeleteVehicle
} = require('../../controllers/admin/vehicleController')
const {
  createVehicleValidator,
  updateVehicleValidator
} = require('../../validators/vehicleValidators')

// Upload middleware (optional — gracefully skipped if multer not configured)
let uploadMiddleware
try {
  const { upload } = require('../../middleware/upload')
  uploadMiddleware = upload.array('images', 10)
} catch {
  uploadMiddleware = (req, _res, next) => next()
}

const router = express.Router()

router.use(auth(true))

router.get(
  '/',
  authorize('super-admin', 'admin', 'sales', 'viewer'),
  adminGetVehicles
)

router.get(
  '/:id',
  authorize('super-admin', 'admin', 'sales', 'viewer'),
  adminGetVehicleById
)

// router.post(
//   '/',
//   authorize('super-admin', 'admin'),
//   uploadMiddleware,
//   createVehicleValidator,
//   adminCreateVehicle
// )

router.post(
  '/',
  authorize('super-admin', 'admin'),
  uploadMiddleware,
  parseVehicleData,
  createVehicleValidator,
  adminCreateVehicle
)

// router.patch(
//   '/:id',
//   authorize('super-admin', 'admin'),
//   uploadMiddleware,
//   updateVehicleValidator,
//   adminUpdateVehicle
// )

router.patch(
  '/:id',
  authorize('super-admin', 'admin'),
  uploadMiddleware,
  parseVehicleData,
  updateVehicleValidator,
  adminUpdateVehicle
)
router.patch(
  '/:id/status',
  authorize('super-admin', 'admin'),
  adminUpdateVehicleStatus
)

router.delete('/:id', authorize('super-admin', 'admin'), adminSoftDeleteVehicle)

module.exports = router

// // server/src/routes/admin/vehicles.js
// const express = require('express')
// const auth = require('../../middleware/auth')
// const authorize = require('../../middleware/authorize')
// const {
//   adminGetVehicles,
//   adminGetVehicleById,
//   adminCreateVehicle,
//   adminUpdateVehicle,
//   adminUpdateVehicleStatus,
//   adminSoftDeleteVehicle
// } = require('../../controllers/admin/vehicleController')
// const {
//   createVehicleValidator,
//   updateVehicleValidator
// } = require('../../validators/vehicleValidators')

// const router = express.Router()

// // All vehicle admin routes require authentication
// router.use(auth(true))

// // Read access for all admin roles
// router.get(
//   '/',
//   authorize('super-admin', 'admin', 'sales', 'viewer'),
//   adminGetVehicles
// )

// router.get(
//   '/:id',
//   authorize('super-admin', 'admin', 'sales', 'viewer'),
//   adminGetVehicleById
// )

// // Write access only for admins
// router.post(
//   '/',
//   authorize('super-admin', 'admin'),
//   createVehicleValidator,
//   adminCreateVehicle
// )

// router.patch(
//   '/:id',
//   authorize('super-admin', 'admin'),
//   updateVehicleValidator,
//   adminUpdateVehicle
// )

// router.patch(
//   '/:id/status',
//   authorize('super-admin', 'admin'),
//   adminUpdateVehicleStatus
// )

// router.delete('/:id', authorize('super-admin', 'admin'), adminSoftDeleteVehicle)

// module.exports = router

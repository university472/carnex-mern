// server/src/controllers/admin/vehicleController.js
const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const escapeStringRegexp = require('escape-string-regexp')
const Vehicle = require('../../models/Vehicle')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { decodeVin } = require('../../services/vinService')
const { getPaginationParams } = require('../../utils/pagination')

let uploadToCloudinary, deleteFromCloudinary
try {
  const uploadModule = require('../../middleware/upload')
  uploadToCloudinary = uploadModule.uploadToCloudinary
  deleteFromCloudinary = uploadModule.deleteFromCloudinary
} catch {
  uploadToCloudinary = null
  deleteFromCloudinary = null
}

async function processUploadedFiles(files) {
  if (!files || !files.length || !uploadToCloudinary) return []
  const results = await Promise.all(
    files.map((f) => uploadToCloudinary(f.buffer, 'carnex/vehicles'))
  )
  return results.map(({ url, publicId }) => ({ url, publicId }))
}

function parseBody(req) {
  if (req.body.data) {
    try {
      const parsed = JSON.parse(req.body.data)
      return { ...parsed, ...req.body }
    } catch {
      return req.body
    }
  }
  return req.body
}
function validateObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

function safeRegex(value) {
  return new RegExp(escapeStringRegexp(value), 'i')
}
// GET /api/admin/vehicles
async function adminGetVehicles(req, res, next) {
  try {
    const { page, limit, skip } = getPaginationParams(req.query, 20, 100)
    const {
      status,
      make,
      model,
      bodyType,
      fuelType,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      search,
      sort = 'newest'
    } = req.query

    const query = {}
    if (status) query.status = status
    if (make) query.make = safeRegex(make)
    if (model) query.model = safeRegex(model)
    if (bodyType) query.bodyType = safeRegex(bodyType)
    if (fuelType) query.fuelType = safeRegex(fuelType)
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }
    if (minYear || maxYear) {
      query.year = {}
      if (minYear) query.year.$gte = Number(minYear)
      if (maxYear) query.year.$lte = Number(maxYear)
    }
    if (search) {
      const regex = safeRegex(search)
      query.$or = [
        { title: regex },
        { make: regex },
        { model: regex },
        { vin: regex },
        { stockNumber: regex }
      ]
    }

    let sortOption = { createdAt: -1 }
    if (sort === 'price-asc') sortOption = { price: 1 }
    if (sort === 'price-desc') sortOption = { price: -1 }
    if (sort === 'year-desc') sortOption = { year: -1 }
    if (sort === 'year-asc') sortOption = { year: 1 }

    const [items, totalItems] = await Promise.all([
      Vehicle.find(query)
        .populate('soldBy', 'name email')
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Vehicle.countDocuments(query)
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
        'Vehicles fetched successfully'
      )
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

// GET /api/admin/vehicles/:id
async function adminGetVehicleById(req, res, next) {
  try {
    if (!validateObjectId(req.params.id)) {
      return next(ApiError.badRequest('Invalid vehicle id'))
    }

    const vehicle = await Vehicle.findById(req.params.id).lean()

    if (!vehicle) {
      return next(ApiError.notFound('Vehicle not found'))
    }

    return res.json(
      new ApiResponse(200, vehicle, 'Vehicle fetched successfully')
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

// POST /api/admin/vehicles
async function adminCreateVehicle(req, res, next) {
  let uploadedImages = []

  try {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return next(ApiError.badRequest('Validation failed', errors.array()))

    const body = parseBody(req)
    uploadedImages = await processUploadedFiles(req.files)

    const payload = {
      ...body
    }

    if (body.year !== undefined && body.year !== '') {
      payload.year = Number(body.year)
    }

    if (body.price !== undefined && body.price !== '') {
      payload.price = Number(body.price)
    }

    if (body.mileage !== undefined && body.mileage !== '') {
      payload.mileage = Number(body.mileage)
    }

    // auto generate title
    if (!payload.title) {
      const parts = [
        payload.year,
        payload.make,
        payload.model,
        payload.specs?.trim
      ].filter(Boolean)

      payload.title = parts.join(' ')
    }

    // Keep existing images from body + newly uploaded ones
    const existingImages = body.images || []
    payload.images = [...existingImages, ...uploadedImages]

    delete payload.data

    const vehicle = await Vehicle.create(payload)
    return res
      .status(201)
      .json(new ApiResponse(201, vehicle, 'Vehicle created successfully'))
  } catch (err) {
    if (uploadedImages.length && deleteFromCloudinary) {
      await Promise.all(
        uploadedImages.map((img) => deleteFromCloudinary(img.publicId))
      )
    }

    if (err.code === 11000) {
      return next(
        ApiError.badRequest('Duplicate VIN or stock number', [
          { msg: 'Duplicate key', param: Object.keys(err.keyPattern)[0] }
        ])
      )
    }
    return next(ApiError.internal(err.message))
  }
}

// PATCH /api/admin/vehicles/:id
async function adminUpdateVehicle(req, res, next) {
  let uploadedImages = []
  try {
    if (!validateObjectId(req.params.id)) {
      return next(ApiError.badRequest('Invalid vehicle id'))
    }
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return next(ApiError.badRequest('Validation failed', errors.array()))

    const body = parseBody(req)
    uploadedImages = await processUploadedFiles(req.files)
    const existingVehicle = await Vehicle.findById(req.params.id).lean()

    if (!existingVehicle) {
      return next(ApiError.notFound('Vehicle not found'))
    }

    const payload = { ...body }
    if (body.year !== undefined && body.year !== '') {
      payload.year = Number(body.year)
    }

    if (body.price !== undefined && body.price !== '') {
      payload.price = Number(body.price)
    }

    if (body.mileage !== undefined && body.mileage !== '') {
      payload.mileage = Number(body.mileage)
    }

    // Merge: keep existing images that weren't removed + add newly uploaded ones
    const existingImages = body.images || []
    payload.images = [...existingImages, ...uploadedImages]

    const remainingPublicIds = payload.images.map((img) => img.publicId)

    const removedImages = existingVehicle.images.filter(
      (oldImg) => !remainingPublicIds.includes(oldImg.publicId)
    )

    delete payload.data

    const updated = await Vehicle.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    })
    if (!updated) return next(ApiError.notFound('Vehicle not found'))
    // delete removed images only after DB update success
    if (removedImages.length && deleteFromCloudinary) {
      await Promise.all(
        removedImages.map((img) => deleteFromCloudinary(img.publicId))
      )
    }

    return res.json(
      new ApiResponse(200, updated, 'Vehicle updated successfully')
    )
  } catch (err) {
    if (err.code === 11000) {
      return next(
        ApiError.badRequest('Duplicate VIN or stock number', [
          { msg: 'Duplicate key', param: Object.keys(err.keyPattern)[0] }
        ])
      )
    }
    return next(ApiError.internal(err.message))
  }
}

// PATCH /api/admin/vehicles/:id/status
async function adminUpdateVehicleStatus(req, res, next) {
  try {
    if (!validateObjectId(req.params.id)) {
      return next(ApiError.badRequest('Invalid vehicle id'))
    }

    const { status, soldPrice, buyer } = req.body

    if (!['available', 'reserved', 'sold', 'hidden'].includes(status)) {
      return next(ApiError.badRequest('Invalid status value'))
    }

    const updateData = {
      status
    }

    // when vehicle sold
    if (status === 'sold') {
      updateData.soldAt = new Date()

      updateData.soldBy = req.admin.id

      if (soldPrice) {
        updateData.soldPrice = Number(soldPrice)
      }

      if (buyer) {
        updateData.buyer = {
          name: buyer.name,
          phone: buyer.phone,
          email: buyer.email
        }
      }
    }

    // restore vehicle
    if (status !== 'sold') {
      updateData.soldAt = null

      updateData.soldBy = null

      updateData.soldPrice = null

      updateData.buyer = null
    }

    const updated = await Vehicle.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    })

    if (!updated) {
      return next(ApiError.notFound('Vehicle not found'))
    }

    return res.json(
      new ApiResponse(200, updated, 'Vehicle status updated successfully')
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

// DELETE /api/admin/vehicles/:id (soft delete)
async function adminSoftDeleteVehicle(req, res, next) {
  try {
    if (!validateObjectId(req.params.id)) {
      return next(ApiError.badRequest('Invalid vehicle id'))
    }
    const updated = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status: 'hidden' },
      { new: true }
    )
    if (!updated) return next(ApiError.notFound('Vehicle not found'))
    return res.json(
      new ApiResponse(200, updated, 'Vehicle hidden successfully')
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

async function adminSoldVehicles(req, res, next) {
  try {
    const vehicles = await Vehicle.find({
      status: 'sold'
    })
      .populate('soldBy', 'name email')
      .sort({
        soldAt: -1
      })
      .lean()

    return res.json(new ApiResponse(200, vehicles, 'Sold vehicles fetched'))
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

async function adminDecodeVin(req, res, next) {
  try {
    const { vin } = req.params

    if (!vin || vin.length !== 17) {
      return next(ApiError.badRequest('Invalid VIN number'))
    }

    const vehicleData = await decodeVin(vin)

    return res.json(
      new ApiResponse(200, vehicleData, 'VIN decoded successfully')
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

module.exports = {
  adminGetVehicles,
  adminGetVehicleById,
  adminCreateVehicle,
  adminUpdateVehicle,
  adminUpdateVehicleStatus,
  adminSoftDeleteVehicle,
  adminSoldVehicles,
  adminDecodeVin
}

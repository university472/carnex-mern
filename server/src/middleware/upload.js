// // server/src/middleware/upload.js
// const multer = require('multer')
// const path = require('path')
// const ApiError = require('../utils/ApiError')

// const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
// const MAX_SIZE_MB = 5

// const storage = multer.memoryStorage() // keep in buffer for Cloudinary streaming

// const fileFilter = (_req, file, cb) => {
//   if (ALLOWED_TYPES.includes(file.mimetype)) {
//     cb(null, true)
//   } else {
//     cb(
//       new ApiError(400, `Only ${ALLOWED_TYPES.join(', ')} files are allowed`),
//       false
//     )
//   }
// }

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 }
// })

// module.exports = upload

// server/src/middleware/upload.js
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const ApiError = require('../utils/ApiError')

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

// Store files in memory — streamed to Cloudinary
const storage = multer.memoryStorage()

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new ApiError(400, 'Only JPEG, PNG, WEBP, and GIF images are allowed'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  }
})

/**
 * Upload a buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {string} folder
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadToCloudinary = (buffer, folder = 'carnex/vehicles') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      },
      (error, result) => {
        if (error) return reject(new ApiError(500, 'Image upload failed'))
        resolve({ url: result.secure_url, publicId: result.public_id })
      }
    )
    stream.end(buffer)
  })
}

/**
 * Delete an image from Cloudinary by public ID.
 * @param {string} publicId
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.error('Cloudinary delete error:', err.message)
  }
}

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary }

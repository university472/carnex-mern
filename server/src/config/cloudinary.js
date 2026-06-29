// // server/src/config/cloudinary.js
// import { v2 as cloudinary } from 'cloudinary'

// if (!process.env.CLOUDINARY_CLOUD_NAME) {
//   console.warn('Cloudinary env vars not set — image uploads will fail.')
// }

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true
// })

// export default cloudinary

// server/src/config/cloudinary.js
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

module.exports = cloudinary

const required = [
  'JWT_SECRET',
  'MONGODB_URI',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
]

module.exports = () => {
  const missing = required.filter((key) => !process.env[key])

  if (missing.length) {
    console.error(`Missing ENV: ${missing.join(', ')}`)

    process.exit(1)
  }
}

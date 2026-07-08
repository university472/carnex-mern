const required = [
  'NODE_ENV',
  'JWT_SECRET',
  'MONGODB_URI',

  // Cloudinary
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',

  // SMTP
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS'
]

module.exports = () => {
  const missing = required.filter((key) => !process.env[key])

  if (missing.length) {
    console.error(`Missing ENV variables: ${missing.join(', ')}`)

    process.exit(1)
  }

  console.log('Environment variables verified')
}

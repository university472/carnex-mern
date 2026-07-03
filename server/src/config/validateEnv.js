const required = ['JWT_SECRET', 'MONGODB_URI']

module.exports = () => {
  const missing = required.filter((key) => !process.env[key])

  if (missing.length) {
    console.error(`Missing ENV: ${missing.join(', ')}`)

    process.exit(1)
  }
}

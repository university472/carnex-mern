// server/src/utils/generateToken.js
const jwt = require('jsonwebtoken')

function generateToken(user, res) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  }

  const secret = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
  if (!secret) {
    throw new Error('JWT_SECRET missing')
  }
  const token = jwt.sign(payload, secret, {
    expiresIn,
    algorithm: 'HS256',
    issuer: 'carnex',
    audience: 'carnex-admin'
  })

  // Set httpOnly cookie for server-side flows
  if (res) {
    res.cookie('token', token, {
      httpOnly: true,

      secure: process.env.NODE_ENV === 'production',

      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',

      path: '/',

      maxAge: 7 * 24 * 60 * 60 * 1000
    })
  }

  return token
}

module.exports = generateToken

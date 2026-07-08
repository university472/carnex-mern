// server/src/utils/generateToken.js
const jwt = require('jsonwebtoken')

function generateToken(user, res) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  }

  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET missing')
  }

  const token = jwt.sign(payload, secret, {
    expiresIn: '2h',
    algorithm: 'HS256',
    issuer: 'carnex',
    audience: 'carnex-admin'
  })

  // Session cookie only
  // Browser close = cookie removed
  if (res) {
    res.cookie('token', token, {
      httpOnly: true,

      secure: process.env.NODE_ENV === 'production',

      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',

      path: '/'
    })
  }

  return token
}

module.exports = generateToken

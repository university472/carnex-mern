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

  const token = jwt.sign(payload, secret, { expiresIn })

  // Set httpOnly cookie for server-side flows
  if (res) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
  }

  return token
}

module.exports = generateToken

// server/scripts/bootstrap-admin.js
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve))

async function main() {
  const { connectDB } = require('../src/config/db')
  await connectDB()

  const User = require('../src/models/User')

  const existing = await User.findOne({ role: 'super-admin' }).lean()
  if (existing) {
    console.log('\nA super-admin already exists:', existing.email)
    console.log('Aborting. Delete it from MongoDB Atlas first to recreate.')
    rl.close()
    process.exit(0)
  }

  const name = (await ask('Admin name: ')).trim()
  const email = (await ask('Admin email: ')).trim().toLowerCase()
  const password = (await ask('Admin password: ')).trim()

  rl.close()

  if (!name || !email || !password) {
    console.error('All fields are required.')
    process.exit(1)
  }

  if (password.length < 8) {
    console.error('Password must be at least 8 characters.')
    process.exit(1)
  }

  // Build the document manually and call save()
  // The pre-save hook on User model will hash the password correctly
  // mongoose pre-save next() is a mongoose internal function — NOT Express next
  // This was working fine; the error was from a stale auth.js using ESM import
  const user = new User({
    name,
    email,
    password, // plain text — pre-save hook will hash it
    role: 'super-admin',
    isActive: true,
    mfaEnabled: false,
    loginAttempts: 0
  })

  await user.save()

  console.log('\n✓ Super-admin created successfully.')
  console.log('  Name  :', user.name)
  console.log('  Email :', user.email)
  console.log('  Role  :', user.role)
  console.log('\nNext: visit http://localhost:5173/admin/login')
  console.log(
    'On first login you will scan a QR code with Google Authenticator.\n'
  )
  process.exit(0)
}

main().catch((err) => {
  console.error('Bootstrap error:', err.message)
  rl.close()
  process.exit(1)
})

// // server/scripts/bootstrap-admin.js
// const readline = require('readline')
// // const dotenv = require('dotenv')
// // dotenv.config()

// const path = require('path')
// const dotenv = require('dotenv')

// dotenv.config({
//   path: path.resolve(__dirname, '../.env')
// })

// console.log('MONGODB_URI =', process.env.MONGODB_URI)

// const { connectDB } = require('../src/config/db')
// const User = require('../src/models/User')

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// })

// const ask = (question) =>
//   new Promise((resolve) => rl.question(question, resolve))

// ;(async () => {
//   try {
//     await connectDB()

//     const existing = await User.findOne({ role: 'super-admin' })
//     if (existing) {
//       console.log('A super-admin already exists:', existing.email)
//       console.log('Aborting to prevent duplicate.')
//       process.exit(0)
//     }

//     const name = (await ask('Admin name: ')).trim()
//     const email = (await ask('Admin email: ')).trim().toLowerCase()
//     const password = (await ask('Admin password: ')).trim()

//     if (!name || !email || !password) {
//       console.error('All fields are required.')
//       process.exit(1)
//     }

//     if (password.length < 8) {
//       console.error('Password must be at least 8 characters.')
//       process.exit(1)
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       role: 'super-admin'
//     })

//     console.log('\n✓ Super-admin created:', user.email)
//     console.log('You can now sign in at /admin/login')
//     console.log('You will be prompted to set up MFA on first login.\n')
//     process.exit(0)
//   } catch (err) {
//     console.error('Bootstrap error:', err.message)
//     process.exit(1)
//   } finally {
//     rl.close()
//   }
// })()

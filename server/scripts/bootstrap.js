// // server/scripts/bootstrap.js
// // Lightweight DB connectivity test + default settings seed.
// // Run: node server/scripts/bootstrap.js

// const dotenv = require('dotenv')
// dotenv.config()

// const { connectDB } = require('../src/config/db')

// ;(async () => {
//   try {
//     await connectDB()
//     console.log('✅ Database connection successful.')

//     // Attempt to seed default Settings document if missing
//     try {
//       const Settings = require('../src/models/Settings')
//       const existing = await Settings.findOne()
//       if (!existing) {
//         await Settings.create({
//           dealershipName: 'Carnex Auto Sales LLC',
//           phone: '(916) 534-0971',
//           email: 'info@carnexautos.com',
//           address: '8193 Elder Creek Road, Sacramento, CA 95824'
//         })
//         console.log('✅ Default settings seeded.')
//       } else {
//         console.log('ℹ️  Settings already exist. Skipping seed.')
//       }
//     } catch (e) {
//       console.warn(
//         'Settings model not available via CJS — skipping seed:',
//         e.message
//       )
//     }

//     process.exit(0)
//   } catch (err) {
//     console.error('❌ Bootstrap failed:', err.message)
//     process.exit(1)
//   }
// })()

/**
 * bootstrap.js
 * Seeds the database with initial required data.
 * Run: node server/scripts/bootstrap.js
 */
// require('dotenv').config()
const path = require('path')

require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
})

console.log('MONGODB_URI =', process.env.MONGODB_URI)

const { connectDB } = require('../src/config/db')

;(async () => {
  try {
    await connectDB()
    console.log('✅ Database connection successful.')

    // Try to load the Settings model (handles ESM default export)
    let Settings
    try {
      const settingsModule = require('../src/models/Settings')
      Settings = settingsModule.default || settingsModule
    } catch (e) {
      console.warn(
        '⚠️  Settings model not available — skipping seed:',
        e.message
      )
      process.exit(0) // no point continuing if we can't seed
    }

    const existing = await Settings.findOne()
    if (!existing) {
      await Settings.create({
        dealershipName: 'Carnex Auto Sales LLC',
        phone: '(916) 534-0971',
        email: 'info@carnexautos.com',
        address: '8193 Elder Creek Road, Sacramento, CA 95824',
        businessHours: [
          { day: 'Monday', open: '9:00 AM', close: '5:00 PM', closed: false },
          { day: 'Tuesday', open: '9:00 AM', close: '5:00 PM', closed: false },
          {
            day: 'Wednesday',
            open: '9:00 AM',
            close: '5:00 PM',
            closed: false
          },
          { day: 'Thursday', open: '9:00 AM', close: '5:00 PM', closed: false },
          { day: 'Friday', open: '9:00 AM', close: '5:00 PM', closed: false },
          { day: 'Saturday', open: '9:00 AM', close: '5:00 PM', closed: false },
          { day: 'Sunday', open: '', close: '', closed: true }
        ]
      })
      console.log('✅ Default settings seeded (with business hours).')
    } else {
      console.log('ℹ️  Settings document already exists. Skipping.')
    }

    console.log('🎉 Bootstrap complete.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Bootstrap failed:', err)
    process.exit(1)
  }
})()

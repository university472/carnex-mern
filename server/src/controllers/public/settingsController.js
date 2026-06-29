// // server/src/controllers/public/settingsController.js
// import Settings from '../../models/Settings.js'
// import ApiResponse from '../../utils/ApiResponse.js'

// export const getPublicSettings = async (req, res, next) => {
//   try {
//     const settings = await Settings.getOrCreate()

//     const payload = {
//       dealershipName: settings.dealershipName,
//       phone: settings.phone,
//       email: settings.email,
//       address: settings.address,
//       businessHours: settings.businessHours
//     }

//     return res.json(
//       new ApiResponse(200, payload, 'Public settings fetched successfully')
//     )
//   } catch (err) {
//     return next(err)
//   }
// }



// server/src/controllers/public/settingsController.js
const Settings = require('../../models/Settings')
const ApiResponse = require('../../utils/ApiResponse')

async function getPublicSettings(req, res, next) {
  try {
    const settings = await Settings.getOrCreate()

    const payload = {
      dealershipName: settings.dealershipName,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      businessHours: settings.businessHours
    }

    return res.json(
      new ApiResponse(200, payload, 'Public settings fetched successfully')
    )
  } catch (err) {
    return next(err)
  }
}

module.exports = { getPublicSettings }

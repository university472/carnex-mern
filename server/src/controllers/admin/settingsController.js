// server/src/controllers/admin/settingsController.js
const Settings = require('../../models/Settings')
const ApiResponse = require('../../utils/ApiResponse')
const ApiError = require('../../utils/ApiError')
const { logAction } = require('../../services/auditService')

async function getSettings(req, res, next) {
  try {
    const settings = await Settings.getOrCreate()
    return res.json(
      new ApiResponse(200, settings, 'Settings fetched successfully')
    )
  } catch (err) {
    return next(err)
  }
}

async function updateSettings(req, res, next) {
  try {
    const payload = req.body
    const settings = await Settings.getOrCreate()
    const before = settings.toObject()

    if (typeof payload.dealershipName === 'string')
      settings.dealershipName = payload.dealershipName.trim()
    if (typeof payload.phone === 'string') settings.phone = payload.phone.trim()
    if (typeof payload.email === 'string')
      settings.email = payload.email.trim().toLowerCase()
    if (typeof payload.address === 'string')
      settings.address = payload.address.trim()
    if (Array.isArray(payload.businessHours)) {
      settings.businessHours = payload.businessHours.map((h) => ({
        day: h.day,
        open: h.open || '',
        close: h.close || '',
        closed: !!h.closed
      }))
    }
    if (Array.isArray(payload.notificationEmails)) {
      settings.notificationEmails = payload.notificationEmails.map((e) =>
        e.trim().toLowerCase()
      )
    }
    if (typeof payload.maintenanceMode === 'boolean')
      settings.maintenanceMode = payload.maintenanceMode

    await settings.save()

    await logAction(
      req.admin,
      'SETTINGS_UPDATED',
      'settings',
      settings._id,
      { before, after: settings.toObject() },
      req
    )

    return res.json(
      new ApiResponse(200, settings, 'Settings updated successfully')
    )
  } catch (err) {
    return next(err)
  }
}


module.exports = { getSettings, updateSettings }

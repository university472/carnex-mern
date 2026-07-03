// middleware/parseVehicleData.js

module.exports = (req, res, next) => {
  if (req.body?.data) {
    try {
      const parsed = JSON.parse(req.body.data)

      req.body = {
        ...parsed,
        ...req.body
      }

      delete req.body.data
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle data JSON'
      })
    }
  }

  next()
}

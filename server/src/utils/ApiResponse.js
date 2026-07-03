// server/src/utils/ApiResponse.js
class ApiResponse {
  constructor(statusCode = 200, data = null, message = 'Success') {
    this.statusCode = statusCode
    this.success = statusCode >= 200 && statusCode < 300
    this.message = message
    this.data = data
  }
}

module.exports = ApiResponse

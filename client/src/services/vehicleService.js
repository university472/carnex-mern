// client/src/services/vehicleService.js
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const vehicleApi = axios.create({
  baseURL: BASE_URL
})

/**
 * Fetch paginated vehicle inventory with filters
 * @param {Object} params - query parameters
 * @returns {Promise<{vehicles: Array, pagination: Object}>}
 */
export async function fetchVehicles(params = {}) {
  const response = await vehicleApi.get('/vehicles', { params })
  const data = response.data?.data

  return {
    vehicles: data?.data || [],
    pagination: data?.pagination || {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 1
    }
  }
}

/**
 * Fetch a single vehicle by MongoDB _id
 * @param {string} id - MongoDB _id
 * @returns {Promise<Object>} vehicle document
 */
export async function fetchVehicleById(id) {
  const response = await vehicleApi.get(`/vehicles/${id}`)
  return response.data?.data || null
}

/**
 * Fetch featured vehicles
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function fetchFeaturedVehicles(limit = 3) {
  try {
    const response = await vehicleApi.get('/vehicles/featured', {
      params: { limit }
    })
    const data = response.data?.data
    return data?.data || data || []
  } catch {
    // Featured endpoint may not exist — fall back to latest
    const { vehicles } = await fetchVehicles({ limit, sort: 'newest' })
    return vehicles
  }
}

/**
 * Fetch latest vehicles
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function fetchLatestVehicles(limit = 3) {
  const { vehicles } = await fetchVehicles({ limit, sort: 'newest' })
  return vehicles
}
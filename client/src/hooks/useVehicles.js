// client/src/hooks/useVehicle.js
import { useState, useEffect, useCallback } from 'react'
import {
  fetchVehicles,
  fetchVehicleById,
  fetchFeaturedVehicles,
  fetchLatestVehicles
} from '../services/vehicleService'

/**
 * Fetch paginated vehicle list with filters/sort/search.
 * All params are passed directly to the backend API.
 */
export function useVehicles(params = {}) {
  const [vehicles, setVehicles] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const paramsKey = JSON.stringify(params)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchVehicles(params)
      setVehicles(result.vehicles)
      setPagination(result.pagination)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          'Failed to load vehicles'
      )
    } finally {
      setLoading(false)
    }
  }, [paramsKey])

  useEffect(() => {
    load()
  }, [load])

  return { vehicles, pagination, loading, error, reload: load }
}

/**
 * Fetch a single vehicle by MongoDB _id.
 */
export function useVehicleById(id) {
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchVehicleById(id)
        if (!cancelled) setVehicle(data)
      } catch (err) {
        if (!cancelled)
          setError(
            err?.response?.data?.message || 'Vehicle not found'
          )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  return { vehicle, loading, error }
}

/**
 * Fetch featured vehicles for homepage.
 */
export function useFeaturedVehicles(limit = 3) {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await fetchFeaturedVehicles(limit)
        if (!cancelled) setVehicles(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [limit])

  return { vehicles, loading, error }
}

/**
 * Fetch latest vehicles for homepage.
 */
export function useLatestVehicles(limit = 3) {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await fetchLatestVehicles(limit)
        if (!cancelled) setVehicles(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [limit])

  return { vehicles, loading, error }
}
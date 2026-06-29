// client/src/hooks/useLead.js
import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

// Map hook leadType key → backend API endpoint segment
const LEAD_ENDPOINTS = {
  finance: '/admin/leads/finance',
  tradeIn: '/admin/leads/trade-in',
  testDrive: '/admin/leads/test-drive',
  sourcing: '/admin/leads/sourcing',
  contact: '/admin/leads/contact'
}

/**
 * Fetch paginated leads by type.
 * @param {'finance'|'tradeIn'|'testDrive'|'sourcing'|'contact'} type
 * @param {Object} params - page, limit, status, search
 */
export function useLeads(type, params = {}) {
  const [leads, setLeads] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const endpoint = LEAD_ENDPOINTS[type]
  const paramsKey = JSON.stringify(params)

  const load = useCallback(async () => {
    if (!endpoint) {
      setError(`Unknown lead type: "${type}"`)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data } = await api.get(endpoint, { params })
      const payload = data?.data || data

      setLeads(payload?.items || [])
      setPagination(payload?.pagination || null)
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || 'Failed to load leads'
      )
    } finally {
      setLoading(false)
    }
  }, [endpoint, paramsKey])

  useEffect(() => {
    load()
  }, [load])

  return { leads, pagination, loading, error, reload: load }
}

/**
 * Fetch lead summary counts for the admin dashboard.
 */
export function useLeadSummary() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const { data } = await api.get('/admin/leads/summary')
        if (!cancelled) {
          setSummary(data?.data || data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              'Failed to load summary'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { summary, loading, error }
}

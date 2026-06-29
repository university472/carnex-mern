// client/src/pages/public/Inventory.jsx
import { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Pagination } from '../../components/ui/Pagination'
import { VehicleGrid } from '../../components/vehicles/VehicleGrid'
import { VehicleFilters } from '../../components/vehicles/VehicleFilters'
import { fetchVehicles } from '../../services/vehicleService'

const SORT_OPTIONS = [
  { label: 'Recommended', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Year: Newest First', value: 'year-desc' },
  { label: 'Mileage: Low to High', value: 'mileage-asc' }
]

const initialFilters = {
  make: '',
  model: '',
  priceMin: '',
  priceMax: '',
  yearMin: '',
  yearMax: '',
  bodyType: '',
  fuelType: '',
  transmission: '',
  maxMileage: ''
}

export function Inventory() {
  const location = useLocation()

  const [vehicles, setVehicles] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [sortBy, setSortBy] = useState('newest')
  const [view, setView] = useState('grid')
  const [page, setPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const PAGE_SIZE = 12

  // ── Read query params from Home quick search ───────────────
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setFilters((prev) => ({
      ...prev,
      make: params.get('make') || '',
      bodyType: params.get('bodyType') || '',
      priceMax: params.get('maxPrice') || '',
      yearMin: params.get('minYear') || ''
    }))
    setPage(1)
  }, [location.search])

  // ── Fetch from backend ─────────────────────────────────────
  const loadVehicles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        page,
        limit: PAGE_SIZE,
        sort: sortBy
      }

      if (searchQuery.trim()) params.search = searchQuery.trim()
      if (filters.make) params.make = filters.make
      if (filters.model) params.model = filters.model
      if (filters.priceMin) params.minPrice = filters.priceMin
      if (filters.priceMax) params.maxPrice = filters.priceMax
      if (filters.yearMin) params.minYear = filters.yearMin
      if (filters.yearMax) params.maxYear = filters.yearMax
      if (filters.bodyType) params.bodyType = filters.bodyType
      if (filters.fuelType) params.fuelType = filters.fuelType
      if (filters.transmission) params.transmission = filters.transmission
      if (filters.maxMileage) params.maxMileage = filters.maxMileage

      const result = await fetchVehicles(params)
      setVehicles(result.vehicles)
      setPagination(result.pagination)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Failed to load inventory. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }, [page, sortBy, searchQuery, filters])

  useEffect(() => {
    loadVehicles()
  }, [loadVehicles])

  const handleFiltersChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setPage(1)
  }

  const handleResetFilters = () => {
    setFilters(initialFilters)
    setSearchQuery('')
    setPage(1)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setPage(1)
  }

  return (
    <section className="page-content">
      <header className="mb-6 space-y-2">
        <h1 className="text-page-title">Inventory</h1>
        <p className="text-body-muted max-w-2xl">
          Browse our curated selection of pre-owned vehicles. Use filters to
          narrow down by make, price, year, body type, fuel type, transmission,
          and mileage.
        </p>
      </header>

      {/* ── Top controls bar ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="mb-4 flex flex-col gap-3 rounded-card border border-brand-border
                   bg-brand-surface p-3 shadow-card sm:flex-row sm:items-center
                   sm:justify-between"
      >
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              id="inv-search"
              label="Search inventory"
              placeholder="Make, model, keyword…"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex items-center gap-2 sm:ml-3">
            <Select
              id="inv-sort"
              label="Sort by"
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setPage(1)
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 sm:w-auto">
          <div className="inline-flex rounded-md border border-brand-border bg-white">
            <Button
              size="sm"
              variant={view === 'grid' ? 'primary' : 'ghost'}
              className="rounded-none border-0"
              onClick={() => setView('grid')}
            >
              Grid
            </Button>
            <Button
              size="sm"
              variant={view === 'list' ? 'primary' : 'ghost'}
              className="rounded-none border-0"
              onClick={() => setView('list')}
            >
              List
            </Button>
          </div>

          <Button
            size="sm"
            variant="secondary"
            className="sm:hidden"
            onClick={() => setMobileFiltersOpen((o) => !o)}
          >
            {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[280px,minmax(0,1fr)]">
        {/* ── Desktop sidebar filters ────────────────────────── */}
        <div className="hidden lg:block">
          <div className="card-surface p-4">
            <VehicleFilters
              filters={filters}
              onChange={handleFiltersChange}
              onReset={handleResetFilters}
            />
          </div>
        </div>

        <div className="space-y-3">
          {/* ── Mobile filters ─────────────────────────────── */}
          {mobileFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="block lg:hidden card-surface p-4"
            >
              <VehicleFilters
                filters={filters}
                onChange={handleFiltersChange}
                onReset={handleResetFilters}
              />
            </motion.div>
          )}

          {/* ── Result count / error ────────────────────────── */}
          {error ? (
            <div className="card-surface p-4 text-center space-y-3">
              <p className="text-sm text-red-600">{error}</p>
              <Button size="sm" onClick={loadVehicles}>
                Retry
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-brand-muted">
                {loading ? (
                  'Loading vehicles…'
                ) : (
                  <>
                    Showing{' '}
                    <span className="font-semibold text-brand-secondary">
                      {pagination.total}
                    </span>{' '}
                    vehicle{pagination.total !== 1 ? 's' : ''}
                    {searchQuery && (
                      <> matching &quot;{searchQuery}&quot;</>
                    )}
                  </>
                )}
              </p>
            </div>
          )}

          {/* ── Vehicle grid ────────────────────────────────── */}
          {!error && (
            <VehicleGrid
              vehicles={vehicles}
              view={view}
              loading={loading}
            />
          )}

          {/* ── Pagination ──────────────────────────────────── */}
          {!loading && !error && pagination.totalPages > 1 && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onChange={(p) => {
                setPage(p)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          )}
        </div>
      </div>
    </section>
  )
}
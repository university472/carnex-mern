// client/src/pages/public/SoldVehicles.jsx
import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Pagination } from '../../components/ui/Pagination'
import { VehicleGrid } from '../../components/vehicles/VehicleGrid'
import { fetchVehicles } from '../../services/vehicleService'

const SORT_OPTIONS = [
  { label: 'Recently Sold', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Year: Newest First', value: 'year-desc' }
]

export function SoldVehicles() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)

  const PAGE_SIZE = 12

  const loadVehicles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        page,
        limit: PAGE_SIZE,
        sort: sortBy,
        status: 'sold'
      }
      if (searchQuery.trim()) params.search = searchQuery.trim()

      const result = await fetchVehicles(params)
      setVehicles(result.vehicles)
      setPagination(result.pagination)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Failed to load sold vehicles. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }, [page, sortBy, searchQuery])

  useEffect(() => {
    loadVehicles()
  }, [loadVehicles])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setPage(1)
  }

  return (
    <section className="page-content">
      <header className="mb-6 space-y-2">
        <h1 className="text-page-title">Sold Vehicles</h1>
        <p className="text-body-muted max-w-2xl">
          A look at vehicles we&apos;ve recently sold. Interested in something
          similar? Contact us or browse our current inventory.
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="mb-4 flex flex-col gap-3 rounded-card border border-brand-border
                   bg-brand-surface p-3 shadow-card sm:flex-row sm:items-center
                   sm:justify-between"
      >
        <div className="flex-1">
          <Input
            id="sold-search"
            label="Search sold vehicles"
            placeholder="Make, model, keyword…"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="sm:ml-3">
          <Select
            id="sold-sort"
            label="Sort by"
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value)
              setPage(1)
            }}
          />
        </div>
      </motion.div>

      {error ? (
        <div className="card-surface p-4 text-center space-y-3">
          <p className="text-sm text-red-600">{error}</p>
          <Button size="sm" onClick={loadVehicles}>
            Retry
          </Button>
        </div>
      ) : (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-brand-muted">
            {loading ? (
              'Loading sold vehicles…'
            ) : (
              <>
                Showing{' '}
                <span className="font-semibold text-brand-secondary">
                  {pagination.total}
                </span>{' '}
                sold vehicle{pagination.total !== 1 ? 's' : ''}
                {searchQuery && <> matching &quot;{searchQuery}&quot;</>}
              </>
            )}
          </p>
        </div>
      )}

      {!error && (
        <VehicleGrid vehicles={vehicles} view="grid" loading={loading} />
      )}

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
    </section>
  )
}

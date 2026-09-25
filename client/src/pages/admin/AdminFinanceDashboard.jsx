// client/src/pages/admin/AdminFinanceDashboard.jsx
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { Pagination } from '../../components/ui/Pagination'
import { formatPrice, formatDate } from '../../utils/formatters'

const RANGE_PRESETS = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: 'YTD', value: 'ytd' },
  { label: 'All Time', value: 'all' }
]

function toIsoDate(date) {
  return date.toISOString().slice(0, 10)
}

function resolvePreset(preset) {
  const now = new Date()
  const to = toIsoDate(now)
  let from

  if (preset === '7d') {
    const d = new Date(now)
    d.setDate(d.getDate() - 7)
    from = toIsoDate(d)
  } else if (preset === '30d') {
    const d = new Date(now)
    d.setDate(d.getDate() - 30)
    from = toIsoDate(d)
  } else if (preset === '90d') {
    const d = new Date(now)
    d.setDate(d.getDate() - 90)
    from = toIsoDate(d)
  } else if (preset === 'ytd') {
    from = toIsoDate(new Date(now.getFullYear(), 0, 1))
  } else {
    from = toIsoDate(new Date(2000, 0, 1))
  }

  return { from, to }
}

function StatTile({ label, value, sub, color = 'text-brand-secondary' }) {
  return (
    <div className="card-surface p-4 space-y-1">
      <p className="text-xs text-brand-muted">{label}</p>
      <p className={`text-2xl font-semibold ${color}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-brand-muted">{sub}</p>}
    </div>
  )
}

export function AdminFinanceDashboard() {
  const [preset, setPreset] = useState('30d')
  const [customRange, setCustomRange] = useState(resolvePreset('30d'))
  const [overview, setOverview] = useState(null)
  const [loadingOverview, setLoadingOverview] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const [vehicles, setVehicles] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [loadingVehicles, setLoadingVehicles] = useState(true)

  const range = preset === 'custom' ? customRange : resolvePreset(preset)

  const loadOverview = useCallback(async () => {
    setLoadingOverview(true)
    try {
      const { data } = await api.get('/admin/finance/overview', {
        params: { from: range.from, to: range.to }
      })
      setOverview(data?.data || data)
      setLoadError(null)
    } catch (err) {
      setOverview(null)
      setLoadError(err?.response?.data?.message || 'Failed to load financial data')
    } finally {
      setLoadingOverview(false)
    }
  }, [range.from, range.to])

  const loadVehicles = useCallback(async () => {
    setLoadingVehicles(true)
    try {
      const { data } = await api.get('/admin/finance/vehicles', {
        params: {
          status: 'sold',
          from: range.from,
          to: range.to,
          page,
          limit: 20,
          sort: 'soldAt-desc'
        }
      })
      const payload = data?.data || data
      setVehicles(payload?.items || [])
      setPagination(payload?.pagination || null)
    } catch (err) {
      setVehicles([])
      setPagination(null)
      setLoadError(err?.response?.data?.message || 'Failed to load financial data')
    } finally {
      setLoadingVehicles(false)
    }
  }, [range.from, range.to, page])

  useEffect(() => {
    loadOverview()
  }, [loadOverview])

  useEffect(() => {
    loadVehicles()
  }, [loadVehicles])

  const inv = overview?.inventory || {}
  const per = overview?.period || {}

  return (
    <section className="page-content space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-page-title">Financial Dashboard</h1>
          <p className="text-body-muted text-sm">
            Dealership-wide profit tracking: investment, revenue, expenses, taxes, and
            profit.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {RANGE_PRESETS.map((p) => (
            <Button
              key={p.value}
              size="sm"
              variant={preset === p.value ? 'primary' : 'ghost'}
              onClick={() => {
                setPreset(p.value)
                setPage(1)
              }}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2 text-xs text-brand-muted">
        <label className="flex items-center gap-1.5">
          From
          <input
            type="date"
            className="border border-brand-border rounded px-2 py-1"
            value={range.from}
            onChange={(e) => {
              setPreset('custom')
              setCustomRange((prev) => ({ ...prev, from: e.target.value }))
              setPage(1)
            }}
          />
        </label>
        <label className="flex items-center gap-1.5">
          To
          <input
            type="date"
            className="border border-brand-border rounded px-2 py-1"
            value={range.to}
            onChange={(e) => {
              setPreset('custom')
              setCustomRange((prev) => ({ ...prev, to: e.target.value }))
              setPage(1)
            }}
          />
        </label>
      </div>

      {loadError && (
        <p className="card-surface p-3 text-sm text-red-600">{loadError}</p>
      )}

      {/* KPI cards */}
      {loadingOverview ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile
            label="Total Inventory Investment"
            value={formatPrice(inv.totalInvestment)}
            sub={`${inv.vehicleCount ?? 0} vehicles in stock — as of today`}
          />
          <StatTile
            label="Vehicles Sold"
            value={per.vehiclesSold ?? 0}
            sub="selected period"
          />
          <StatTile label="Revenue" value={formatPrice(per.revenue)} sub="gross sale amount" />
          <StatTile label="Total Expenses" value={formatPrice(per.totalExpenses)} />
          <StatTile
            label="Tax Collected From Customers"
            value={formatPrice(per.taxCollectedFromCustomers)}
          />
          <StatTile
            label="Tax Remitted / Paid by Company"
            value={formatPrice(per.taxRemittedByCompany)}
          />
          <StatTile
            label="Gross Profit"
            value={formatPrice(per.grossProfit)}
            color={per.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}
          />
          <StatTile
            label="Net Profit"
            value={formatPrice(per.netProfit)}
            sub={
              per.vehiclesSold
                ? `avg ${formatPrice(per.avgNetProfitPerVehicle)} / vehicle`
                : undefined
            }
            color={per.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}
          />
        </div>
      )}

      {/* Vehicle profit report */}
      <div className="card-surface p-5 space-y-4">
        <h2 className="text-sm font-semibold text-brand-secondary">
          Vehicle Profit Report — Sold Vehicles
        </h2>

        {loadingVehicles ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <p className="text-sm text-brand-muted py-6 text-center">
            No sold vehicles in this period.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-brand-border text-left text-brand-muted">
                    <th className="py-2 pr-3 font-medium">Vehicle</th>
                    <th className="py-2 pr-3 font-medium">Sold Date</th>
                    <th className="py-2 pr-3 font-medium">Purchase Price</th>
                    <th className="py-2 pr-3 font-medium">Total Investment</th>
                    <th className="py-2 pr-3 font-medium">Sale Price</th>
                    <th className="py-2 pr-3 font-medium">Expenses</th>
                    <th className="py-2 pr-3 font-medium">Taxes</th>
                    <th className="py-2 font-medium">Net Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => {
                    const t = v.finance?.totals || {}
                    return (
                      <tr
                        key={v._id}
                        className="border-b border-brand-border/60 hover:bg-brand-surface/40 transition-colors"
                      >
                        <td className="py-2 pr-3 font-medium text-brand-secondary">
                          <Link
                            to={`/dealer-panel/vehicles/${v._id}/finance`}
                            className="hover:underline"
                          >
                            {v.year} {v.make} {v.model}
                          </Link>
                        </td>
                        <td className="py-2 pr-3 text-brand-muted">
                          {formatDate(v.soldAt)}
                        </td>
                        <td className="py-2 pr-3 text-brand-muted">
                          {formatPrice(v.finance?.purchasePrice)}
                        </td>
                        <td className="py-2 pr-3 text-brand-muted">
                          {formatPrice(t.totalInvestment)}
                        </td>
                        <td className="py-2 pr-3 text-brand-muted">
                          {formatPrice(v.soldPrice)}
                        </td>
                        <td className="py-2 pr-3 text-brand-muted">
                          {formatPrice(t.totalExpenses)}
                        </td>
                        <td className="py-2 pr-3 text-brand-muted">
                          {formatPrice(t.totalTaxes)}
                        </td>
                        <td
                          className={`py-2 font-semibold ${
                            t.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {formatPrice(t.netProfit)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {pagination && (
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </section>
  )
}

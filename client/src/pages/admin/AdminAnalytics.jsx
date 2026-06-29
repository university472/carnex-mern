// client/src/pages/admin/AdminAnalytics.jsx
import { useState, useEffect, useCallback } from 'react'
import api from '../../services/api'
import { Skeleton } from '../../components/ui/Skeleton'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { formatDateTime } from '../../utils/formatters'

// Simple bar — width as % of max
function Bar({ value, max, color = 'bg-red-500' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-brand-secondary w-8 text-right">
        {value}
      </span>
    </div>
  )
}

// Mini KPI tile
function StatTile({ label, value, sub, color = 'text-brand-secondary' }) {
  return (
    <div className="card-surface p-4 space-y-1">
      <p className="text-xs text-brand-muted">{label}</p>
      <p className={`text-2xl font-semibold ${color}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-brand-muted">{sub}</p>}
    </div>
  )
}

// Device icon
function DeviceIcon({ device }) {
  if (device === 'mobile') {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <rect width="12" height="20" x="6" y="2" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </svg>
    )
  }
  if (device === 'tablet') {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </svg>
    )
  }
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

export function AdminAnalytics() {
  const [summary, setSummary] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [summaryRes, recentRes] = await Promise.all([
        api.get('/admin/analytics/summary'),
        api.get('/admin/analytics/recent', { params: { limit: 30 } })
      ])
      setSummary(summaryRes.data?.data || summaryRes.data)
      setRecent(recentRes.data?.data?.visits || [])
      setError(null)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Auto-refresh every 30 seconds when enabled
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [autoRefresh, loadData])

  const ov = summary?.overview || {}
  const topPages = summary?.topPages || []
  const deviceBreakdown = summary?.deviceBreakdown || []
  const browserBreakdown = summary?.browserBreakdown || []
  const hourlyToday = summary?.hourlyToday || []
  const dailyLast30 = summary?.dailyLast30 || []

  const maxHourly = Math.max(...hourlyToday.map((h) => h.views), 1)
  const maxDaily = Math.max(...dailyLast30.map((d) => d.views), 1)
  const maxPage = Math.max(...topPages.map((p) => p.views), 1)
  const maxDevice = Math.max(...deviceBreakdown.map((d) => d.count), 1)
  const maxBrowser = Math.max(...browserBreakdown.map((b) => b.count), 1)

  const deviceColors = {
    desktop: 'bg-blue-500',
    mobile: 'bg-red-500',
    tablet: 'bg-amber-500',
    unknown: 'bg-gray-400'
  }

  return (
    <section className="page-content space-y-6">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-page-title">Visitor Analytics</h1>
          <p className="text-body-muted text-sm">
            Real-time visitor tracking for the public website. All data is
            privacy-safe — IPs are hashed, no personal data stored.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label
            className="flex items-center gap-2 text-xs text-brand-muted
                            cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            Auto-refresh (30s)
          </label>
          <Button size="sm" variant="ghost" onClick={loadData}>
            Refresh
          </Button>
        </div>
      </header>

      {error && (
        <div className="card-surface p-4 text-center space-y-2">
          <p className="text-sm text-red-600">{error}</p>
          <Button size="sm" onClick={loadData}>
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      ) : (
        <>
          {/* ── Overview KPIs ──────────────────────────────── */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile
              label="Today's Visits"
              value={ov.todayViews?.toLocaleString()}
              sub={
                ov.changeVsYesterday !== undefined
                  ? `${ov.changeVsYesterday >= 0 ? '+' : ''}${ov.changeVsYesterday}% vs yesterday`
                  : undefined
              }
              color={
                ov.changeVsYesterday >= 0 ? 'text-green-600' : 'text-red-600'
              }
            />
            <StatTile
              label="Last 7 Days"
              value={ov.last7DaysViews?.toLocaleString()}
              sub="page views"
            />
            <StatTile
              label="Last 30 Days"
              value={ov.last30DaysViews?.toLocaleString()}
              sub="page views"
            />
            <StatTile
              label="Unique Visitors (30d)"
              value={ov.uniqueVisitors30?.toLocaleString()}
              sub="by IP hash"
              color="text-blue-600"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* ── Hourly chart today ──────────────────────── */}
            <div className="card-surface p-5 space-y-3">
              <h2 className="text-sm font-semibold text-brand-secondary">
                Visits Today — Hourly
              </h2>
              {hourlyToday.every((h) => h.views === 0) ? (
                <p className="text-xs text-brand-muted py-4 text-center">
                  No visits recorded yet today.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {hourlyToday
                    .filter((h) => {
                      const currentHour = new Date().getHours()
                      return parseInt(h.hour) <= currentHour
                    })
                    .map((h) => (
                      <div key={h.hour} className="flex items-center gap-2">
                        <span className="text-[11px] text-brand-muted w-12 flex-shrink-0">
                          {h.hour}
                        </span>
                        <Bar
                          value={h.views}
                          max={maxHourly}
                          color="bg-red-500"
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* ── Top pages ───────────────────────────────── */}
            <div className="card-surface p-5 space-y-3">
              <h2 className="text-sm font-semibold text-brand-secondary">
                Top Pages — Last 30 Days
              </h2>
              {topPages.length === 0 ? (
                <p className="text-xs text-brand-muted py-4 text-center">
                  No page view data yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {topPages.map((p) => (
                    <div key={p.page}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-brand-secondary font-medium">
                          {p.page}
                        </span>
                        <span className="text-xs text-brand-muted">
                          {p.views} views
                        </span>
                      </div>
                      <Bar value={p.views} max={maxPage} color="bg-blue-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Daily chart + Device + Browser ─────────────── */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Daily last 30 */}
            <div className="card-surface p-5 space-y-3 lg:col-span-1">
              <h2 className="text-sm font-semibold text-brand-secondary">
                Daily Visits — Last 30 Days
              </h2>
              {dailyLast30.length === 0 ? (
                <p className="text-xs text-brand-muted py-4 text-center">
                  No data yet.
                </p>
              ) : (
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {[...dailyLast30].reverse().map((d) => (
                    <div key={d.date} className="flex items-center gap-2">
                      <span className="text-[10px] text-brand-muted w-20 flex-shrink-0">
                        {new Date(d.date + 'T00:00:00').toLocaleDateString(
                          'en-US',
                          { month: 'short', day: 'numeric' }
                        )}
                      </span>
                      <Bar
                        value={d.views}
                        max={maxDaily}
                        color="bg-purple-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Device breakdown */}
            <div className="card-surface p-5 space-y-3">
              <h2 className="text-sm font-semibold text-brand-secondary">
                Devices — Last 30 Days
              </h2>
              {deviceBreakdown.length === 0 ? (
                <p className="text-xs text-brand-muted py-4 text-center">
                  No data yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {deviceBreakdown.map((d) => (
                    <div key={d.device}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-brand-muted">
                          <DeviceIcon device={d.device} />
                        </span>
                        <span className="text-xs text-brand-secondary font-medium capitalize">
                          {d.device}
                        </span>
                      </div>
                      <Bar
                        value={d.count}
                        max={maxDevice}
                        color={deviceColors[d.device] || 'bg-gray-400'}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Browser breakdown */}
            <div className="card-surface p-5 space-y-3">
              <h2 className="text-sm font-semibold text-brand-secondary">
                Browsers — Last 30 Days
              </h2>
              {browserBreakdown.length === 0 ? (
                <p className="text-xs text-brand-muted py-4 text-center">
                  No data yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {browserBreakdown.map((b) => (
                    <div key={b.browser}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-brand-secondary font-medium">
                          {b.browser}
                        </span>
                      </div>
                      <Bar
                        value={b.count}
                        max={maxBrowser}
                        color="bg-green-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Recent visits live feed ──────────────────────── */}
          <div className="card-surface p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-brand-secondary">
                Recent Visits — Live Feed
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-brand-muted">
                  {autoRefresh ? 'Live' : 'Manual refresh'}
                </span>
              </div>
            </div>

            {recent.length === 0 ? (
              <p className="text-xs text-brand-muted py-6 text-center">
                No visits recorded yet. Visits will appear here once users
                browse the public website.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border-collapse">
                  <thead>
                    <tr
                      className="border-b border-brand-border text-left
                                   text-brand-muted"
                    >
                      <th className="py-2 pr-4 font-medium">Page</th>
                      <th className="py-2 pr-4 font-medium">Path</th>
                      <th className="py-2 pr-4 font-medium">Device</th>
                      <th className="py-2 pr-4 font-medium">Browser</th>
                      <th className="py-2 pr-4 font-medium">Referrer</th>
                      <th className="py-2 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((visit) => (
                      <tr
                        key={visit._id}
                        className="border-b border-brand-border/50
                                   hover:bg-brand-surface/40 transition-colors"
                      >
                        <td className="py-2 pr-4">
                          <Badge variant="default">{visit.page}</Badge>
                        </td>
                        <td
                          className="py-2 pr-4 text-brand-muted font-mono
                                       max-w-[180px] truncate"
                        >
                          {visit.path || '/'}
                        </td>
                        <td className="py-2 pr-4 text-brand-muted capitalize">
                          <span className="flex items-center gap-1.5">
                            <DeviceIcon device={visit.device} />
                            {visit.device}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-brand-muted">
                          {visit.browser}
                        </td>
                        <td
                          className="py-2 pr-4 text-brand-muted
                                       max-w-[160px] truncate"
                        >
                          {visit.referrer === 'direct' ? (
                            <span className="italic">Direct</span>
                          ) : (
                            visit.referrer
                          )}
                        </td>
                        <td className="py-2 text-brand-muted whitespace-nowrap">
                          {formatDateTime(visit.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}

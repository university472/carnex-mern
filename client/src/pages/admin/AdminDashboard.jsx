// client/src/pages/admin/AdminDashboard.jsx
import { Link } from 'react-router-dom'
import { KPICard } from '../../components/admin/KPICard'
import { useLeadSummary } from '../../hooks/useLeads'
import { useVehicles } from '../../hooks/useVehicles'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { formatPrice, formatMileage, formatDate } from '../../utils/formatters'

export function AdminDashboard() {
  const { summary, loading: summaryLoading } = useLeadSummary()
  const { vehicles, loading: vehiclesLoading } = useVehicles({
    limit: 5,
    sort: 'newest'
  })

  const recentVehicles = vehicles.slice(0, 5)

  return (
    <section className="page-content space-y-6">
      <header className="space-y-1">
        <h1 className="text-page-title">Dashboard</h1>
        <p className="text-body-muted text-sm">
          Overview of leads and inventory for Carnex Auto Sales.
        </p>
      </header>

      {/* ── Lead KPI cards ──────────────────────────────────── */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-secondary">
          Lead Summary — Last 7 Days
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KPICard
            label="Financing"
            total={summary?.finance?.total}
            last7Days={summary?.finance?.last7Days}
            color="red"
            loading={summaryLoading}
          />
          <KPICard
            label="Trade-Ins"
            total={summary?.tradeIn?.total}
            last7Days={summary?.tradeIn?.last7Days}
            color="amber"
            loading={summaryLoading}
          />
          <KPICard
            label="Test Drives"
            total={summary?.testDrive?.total}
            last7Days={summary?.testDrive?.last7Days}
            color="blue"
            loading={summaryLoading}
          />
          <KPICard
            label="Sourcing"
            total={summary?.sourcing?.total}
            last7Days={summary?.sourcing?.last7Days}
            color="purple"
            loading={summaryLoading}
          />
          <KPICard
            label="Contact"
            total={summary?.contact?.total}
            last7Days={summary?.contact?.last7Days}
            color="green"
            loading={summaryLoading}
          />
        </div>
      </div>

      {/* ── Quick actions (4 cards) ──────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Inventory */}
        <div className="card-surface p-4 space-y-2">
          <p className="text-xs font-medium text-brand-muted uppercase tracking-wide">
            Inventory
          </p>
          <Link to="/dealer-panel/vehicles">
            <Button size="sm" className="w-full" variant="secondary">
              Manage Vehicles
            </Button>
          </Link>
          <Link to="/dealer-panel/vehicles/new">
            <Button size="sm" variant="ghost" className="w-full">
              Add New Vehicle
            </Button>
          </Link>
        </div>

        {/* Leads */}
        <div className="card-surface p-4 space-y-2">
          <p className="text-xs font-medium text-brand-muted uppercase tracking-wide">
            Leads
          </p>
          <Link to="/dealer-panel/finance-leads">
            <Button size="sm" variant="secondary" className="w-full">
              Financing Leads
            </Button>
          </Link>
          <Link to="/dealer-panel/contact-leads">
            <Button size="sm" variant="ghost" className="w-full">
              Contact Messages
            </Button>
          </Link>
        </div>

        {/* Reviews */}
        <div className="card-surface p-4 space-y-2">
          <p className="text-xs font-medium text-brand-muted uppercase tracking-wide">
            Reviews
          </p>
          <Link to="/dealer-panel/reviews">
            <Button size="sm" variant="secondary" className="w-full">
              Manage Customer Reviews
            </Button>
          </Link>
          {/* Optional: link to pending reviews directly */}
          <Link to="/dealer-panel/reviews">
            <Button size="sm" variant="ghost" className="w-full">
              Pending Approval
            </Button>
          </Link>
        </div>

        {/* Admin */}
        <div className="card-surface p-4 space-y-2">
          <p className="text-xs font-medium text-brand-muted uppercase tracking-wide">
            Admin
          </p>
          <Link to="/dealer-panel/users">
            <Button size="sm" variant="secondary" className="w-full">
              Manage Users
            </Button>
          </Link>
          <Link to="/dealer-panel/audit-logs">
            <Button size="sm" variant="ghost" className="w-full">
              View Audit Logs
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Recent vehicles ──────────────────────────────────── */}
      <div className="card-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-brand-secondary">
            Recent Inventory
          </h2>
          <Link
            to="/dealer-panel/vehicles"
            className="text-xs text-brand-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {vehiclesLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : recentVehicles.length === 0 ? (
          <p className="text-sm text-brand-muted">
            No vehicles yet.{' '}
            <Link
              to="/dealer-panel/vehicles/new"
              className="text-brand-primary hover:underline"
            >
              Add your first listing.
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border-collapse">
              <thead>
                <tr
                  className="border-b border-brand-border text-left
                               text-brand-muted"
                >
                  <th className="py-2 pr-4 font-medium">Vehicle</th>
                  <th className="py-2 pr-4 font-medium">Price</th>
                  <th className="py-2 pr-4 font-medium">Mileage</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 font-medium">Added</th>
                </tr>
              </thead>
              <tbody>
                {recentVehicles.map((v) => (
                  <tr
                    key={v._id}
                    className="border-b border-brand-border/60
                               hover:bg-brand-surface/40 transition-colors"
                  >
                    <td className="py-2 pr-4 font-medium text-brand-secondary">
                      {v.year} {v.make} {v.model}
                    </td>
                    <td className="py-2 pr-4 text-brand-primary font-medium">
                      {formatPrice(v.price)}
                    </td>
                    <td className="py-2 pr-4 text-brand-muted">
                      {formatMileage(v.mileage)}
                    </td>
                    <td className="py-2 pr-4">
                      <Badge
                        variant={
                          v.status === 'available' ? 'success' : 'default'
                        }
                      >
                        {v.status}
                      </Badge>
                    </td>
                    <td className="py-2 text-brand-muted">
                      {formatDate(v.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

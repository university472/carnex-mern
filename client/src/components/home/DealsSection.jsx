import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { VehicleCard } from '../vehicles/VehicleCard'
import { SkeletonCard } from '../ui/Skeleton'
import { useVehicles, useFeaturedVehicles } from '../../hooks/useVehicles'

const DEALS_LIMIT = 8

/**
 * "Find the best deals" — Latest = newest available vehicles
 * (GET /vehicles?sort=newest); Featured = vehicles an admin flagged with the
 * existing "Featured vehicle" checkbox (GET /vehicles/featured).
 * The Featured tab is hidden when no vehicle is flagged.
 */
export function DealsSection() {
  const [tab, setTab] = useState('latest')

  const { vehicles: latestVehicles, loading: latestLoading } = useVehicles({
    limit: DEALS_LIMIT,
    sort: 'newest'
  })
  const { vehicles: featuredVehicles, loading: featuredLoading } =
    useFeaturedVehicles(DEALS_LIMIT)

  const hasFeatured = !featuredLoading && featuredVehicles.length > 0
  const activeTab = tab === 'featured' && hasFeatured ? 'featured' : 'latest'

  const tabs = [
    { key: 'latest', label: 'Latest Vehicles' },
    ...(hasFeatured ? [{ key: 'featured', label: 'Featured' }] : [])
  ]

  const loading = activeTab === 'latest' ? latestLoading : featuredLoading
  const vehicles = activeTab === 'latest' ? latestVehicles : featuredVehicles

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Current Stock</p>
            <h2 className="section-heading mt-2">Find the Best Deals For You</h2>
          </div>

          <div
            role="tablist"
            aria-label="Vehicle deals"
            className="inline-flex self-start rounded-xl bg-mist p-1 sm:self-auto"
          >
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={activeTab === t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  activeTab === t.key
                    ? 'bg-ink-900 text-white shadow'
                    : 'text-slate-500 hover:text-ink-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} className="!rounded-2xl" />
            ))}
          </div>
        ) : (vehicles || []).length === 0 ? (
          <div className="public-card p-8 text-center">
            <p className="text-sm text-slate-500">
              No vehicles in inventory yet.{' '}
              <Link to="/contact" className="text-brand-primary hover:underline">
                Contact us
              </Link>{' '}
              to enquire about upcoming stock.
            </p>
          </div>
        ) : (
          <div
            key={activeTab}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in-up"
          >
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/inventory"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-ink-900 transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            View All Inventory
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/// client/src/components/vehicles/VehicleGrid.jsx
import { VehicleCard } from './VehicleCard'
import { SkeletonCard } from '../ui/Skeleton'

export function VehicleGrid({ vehicles, view = 'grid', loading = false }) {
  // Loading skeleton
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!vehicles?.length) {
    return (
      <div className="card-surface p-6 text-center">
        <h3 className="text-section-title mb-2">No vehicles found</h3>
        <p className="text-body-muted">
          Try adjusting your filters or search criteria to see more results.
        </p>
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  )
}
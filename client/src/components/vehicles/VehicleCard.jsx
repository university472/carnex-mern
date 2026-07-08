// client/src/components/vehicles/VehicleCard.jsx
import { Link } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

/**
 * Supports both MongoDB documents (_id) and legacy mock data (id).
 * Images: prefers images[0].url, falls back to imageUrl, then placeholder.
 */
export function VehicleCard({ vehicle }) {
  const {
    _id,
    id,
    title,
    price,
    mileage,
    year,
    bodyType,
    fuelType,
    transmission,
    imageUrl,
    images,
    location,
    status
  } = vehicle

  // Use MongoDB _id if available, fall back to legacy id field
  const vehicleId = _id || id
  const isSold = status === 'sold'

  // Resolve best available image
  const primaryImage =
    images?.[0]?.url ||
    imageUrl ||
    'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600'

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price || 0)

  const formattedMileage = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(mileage || 0)

  return (
    <article className="card-surface flex flex-col overflow-hidden">
      {/* <div className="relative">
        <img
          src={primaryImage}
          alt={title || 'Vehicle'}
          className="h-48 w-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600'
          }}
        />
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1 text-[11px]">
          {bodyType && <Badge variant="accent">{bodyType}</Badge>}
          {fuelType && <Badge>{fuelType}</Badge>}
        </div>
      </div> */}

      <Link
        to={`/vehicles/${vehicleId}`}
        className="relative block overflow-hidden group"
      >
        <img
          src={primaryImage}
          alt={title || 'Vehicle'}
          className="
      h-48 
      w-full 
      object-cover
      transition-transform
      duration-300
      group-hover:scale-105
      cursor-pointer
    "
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600'
          }}
        />
        {isSold && (
          <>
            {/* soft overlay */}
            <div className="absolute inset-0 bg-black/25" />

            {/* sold badge */}
            <div
              className="
        absolute
        top-3
        right-3
        bg-red-600
        text-white
        px-4
        py-1.5
        rounded-full
        text-xs
        font-black
        tracking-widest
        shadow-lg
      "
            >
              SOLD
            </div>
          </>
        )}

        <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1 text-[11px]">
          {bodyType && <Badge variant="accent">{bodyType}</Badge>}
          {fuelType && <Badge>{fuelType}</Badge>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <header className="space-y-1">
          <h3 className="text-card-title line-clamp-2">
            {title || `${year} ${vehicle.make} ${vehicle.model}`}
          </h3>
          <p className="text-xs text-brand-muted">
            {location || 'Sacramento, CA'}
          </p>
        </header>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-0.5">
            <p className="text-brand-muted">Price</p>
            <p className="font-semibold text-brand-primary">{formattedPrice}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-brand-muted">Mileage</p>
            <p className="font-medium text-brand-secondary">
              {formattedMileage} miles
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-brand-muted">Year</p>
            <p className="font-medium text-brand-secondary">{year || '—'}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-brand-muted">Transmission</p>
            <p className="font-medium text-brand-secondary">
              {transmission || '—'}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Link to={`/vehicles/${vehicleId}`} className="flex-1 min-w-[140px]">
            <Button size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          {!isSold ? (
            <Link
              to={`/financing?vehicle=${vehicleId}`}
              className="flex-1 min-w-[140px]"
            >
              <Button size="sm" variant="secondary" className="w-full">
                Start Financing
              </Button>
            </Link>
          ) : (
            <Button
              size="sm"
              disabled
              className="
    flex-1
    min-w-[140px]
    bg-slate-200
    text-slate-600
    cursor-not-allowed
  "
            >
              Sold Vehicle
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

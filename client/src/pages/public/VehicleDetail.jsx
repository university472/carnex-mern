// client/src/pages/public/VehicleDetail.jsx
import { useParams, Link } from 'react-router-dom'
import { useVehicleById, useLatestVehicles } from '../../hooks/useVehicles'
import { VehicleGallery } from '../../components/vehicles/VehicleGallery'
import { PaymentCalculator } from '../../components/vehicles/PaymentCalculator'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { VehicleGrid } from '../../components/vehicles/VehicleGrid'
import { Skeleton, SkeletonText } from '../../components/ui/Skeleton'

export function VehicleDetail() {
  const { id } = useParams()
  const { vehicle, loading, error } = useVehicleById(id)

  // Load related vehicles (same body type filtered client-side)
  const { vehicles: latestVehicles, loading: relatedLoading } =
    useLatestVehicles(6)

  // ── Loading skeleton ─────────────────────────────────────
  if (loading) {
    return (
      <section className="page-content space-y-6">
        <Skeleton className="h-8 w-2/3" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
          <div className="space-y-4">
            <Skeleton className="h-80 w-full rounded-card" />
            <Skeleton className="h-40 w-full rounded-card" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-card" />
            <Skeleton className="h-48 w-full rounded-card" />
          </div>
        </div>
      </section>
    )
  }

  // ── Error / not found ────────────────────────────────────
  if (error || !vehicle) {
    return (
      <section className="page-content">
        <div className="card-surface p-6 text-center space-y-3">
          <h1 className="text-page-title mb-2">Vehicle not found</h1>
          <p className="text-body-muted">
            {error ||
              'This vehicle might have been removed or is no longer available.'}
          </p>
          <Link
            to="/inventory"
            className="inline-flex items-center justify-center rounded-md
                       bg-brand-primary px-4 py-2 text-sm font-medium text-white
                       shadow-card transition hover:bg-brand-primaryHover"
          >
            Back to Inventory
          </Link>
        </div>
      </section>
    )
  }

  const {
    _id,
    title,
    price,
    mileage,
    year,
    bodyType,
    fuelType,
    transmission,
    location,
    images,
    imageUrl,
    highlight,
    specs,
    features,
    make,
    model,
    color,
    driveType,
    status
  } = vehicle

  const vehicleId = _id

  // Normalize images — backend returns [{url, publicId}]
  const galleryImages =
    images && images.length > 0
      ? images.map((img) => (typeof img === 'string' ? img : img.url))
      : imageUrl
        ? [imageUrl]
        : []

  // Related: same body type, exclude current vehicle
  const relatedVehicles = latestVehicles
    .filter((v) => v._id !== vehicleId && v.bodyType === bodyType)
    .slice(0, 3)

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price || 0)

  const formattedMileage = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(mileage || 0)

  return (
    <section className="page-content space-y-8">
      {/* ── Breadcrumb ──────────────────────────────────────── */}
      <header className="space-y-3">
        <p className="text-small">
          <Link
            to="/inventory"
            className="text-brand-muted hover:text-brand-primary"
          >
            Inventory
          </Link>{' '}
          / {make} {model} {year}
        </p>

        <h1 className="text-page-title">{title}</h1>

        <div className="flex flex-wrap gap-2 text-xs">
          {bodyType && <Badge>{bodyType}</Badge>}
          {fuelType && <Badge>{fuelType}</Badge>}
          {transmission && <Badge>{transmission}</Badge>}
          {year && <Badge variant="accent">{year}</Badge>}
          {status && status !== 'available' && (
            <Badge variant="default" className="capitalize">
              {status}
            </Badge>
          )}
        </div>

        {location && <p className="text-body-muted text-sm">{location}</p>}
      </header>

      {/* ── Summary stripe ──────────────────────────────────── */}
      <div className="card-surface flex flex-wrap items-center gap-3 p-3 text-xs text-brand-muted">
        <span className="font-semibold text-brand-secondary">
          {year} • {make} {model}
        </span>
        <span>• {formattedMileage} miles</span>
        {bodyType && <span>• {bodyType}</span>}
        {fuelType && <span>• {fuelType}</span>}
        {transmission && <span>• {transmission}</span>}
        {driveType && <span>• {driveType}</span>}
      </div>

      {/* ── Main layout ─────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
        {/* Left column */}
        <div className="space-y-5">
          <VehicleGallery
            images={galleryImages}
            title={title}
            bodyType={bodyType}
          />

          {/* Overview */}
          <section className="card-surface space-y-4 p-5">
            <h2 className="text-section-title text-base">Vehicle Overview</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-brand-muted">Make</dt>
                  <dd className="font-medium text-brand-secondary">
                    {make || '—'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-brand-muted">Model</dt>
                  <dd className="font-medium text-brand-secondary">
                    {model || '—'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-brand-muted">Year</dt>
                  <dd className="font-medium text-brand-secondary">
                    {year || '—'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-brand-muted">Body Type</dt>
                  <dd className="font-medium text-brand-secondary">
                    {bodyType || '—'}
                  </dd>
                </div>
                {color && (
                  <div className="flex justify-between">
                    <dt className="text-brand-muted">Color</dt>
                    <dd className="font-medium text-brand-secondary">
                      {color}
                    </dd>
                  </div>
                )}
              </dl>

              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-brand-muted">Fuel Type</dt>
                  <dd className="font-medium text-brand-secondary">
                    {fuelType || '—'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-brand-muted">Transmission</dt>
                  <dd className="font-medium text-brand-secondary">
                    {transmission || '—'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-brand-muted">Mileage</dt>
                  <dd className="font-medium text-brand-secondary">
                    {formattedMileage} miles
                  </dd>
                </div>
                {driveType && (
                  <div className="flex justify-between">
                    <dt className="text-brand-muted">Drive Type</dt>
                    <dd className="font-medium text-brand-secondary">
                      {driveType}
                    </dd>
                  </div>
                )}
                {specs?.engine && (
                  <div className="flex justify-between">
                    <dt className="text-brand-muted">Engine</dt>
                    <dd className="font-medium text-brand-secondary">
                      {specs.engine}
                    </dd>
                  </div>
                )}
                {specs?.vin && (
                  <div className="flex justify-between">
                    <dt className="text-brand-muted">VIN</dt>
                    <dd className="font-medium text-brand-secondary font-mono text-xs">
                      {specs.vin}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {highlight && (
              <p className="text-sm text-brand-muted border-t border-brand-border pt-3">
                {highlight}
              </p>
            )}
          </section>

          {/* Features */}
          {features && features.length > 0 && (
            <section className="card-surface space-y-3 p-5">
              <h2 className="text-section-title text-base">Key Features</h2>
              <p className="text-body-muted text-sm">
                This vehicle comes equipped with the following notable features
                and comfort options.
              </p>
              <ul className="grid gap-2 sm:grid-cols-2 text-sm">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Price + CTAs */}
          <section className="card-surface space-y-4 p-5">
            <div className="space-y-1">
              <p className="text-sm text-brand-muted">Asking Price</p>
              <p className="text-2xl font-semibold text-brand-primary">
                {formattedPrice}
              </p>
              <p className="text-xs text-brand-muted">
                Taxes, registration, and documentation fees are not included.
                Final out‑the‑door price will reflect California rates.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to={`/financing?vehicle=${vehicleId}`}
                className="flex-1 min-w-[140px]"
              >
                <Button size="md" className="w-full">
                  Start Financing Application
                </Button>
              </Link>
              <Link
                to={`/test-drive?vehicle=${vehicleId}`}
                className="flex-1 min-w-[140px]"
              >
                <Button size="md" variant="secondary" className="w-full">
                  Book Test Drive
                </Button>
              </Link>
              <Link
                to={`/contact?vehicle=${vehicleId}`}
                className="flex-1 min-w-[140px]"
              >
                <Button size="md" variant="ghost" className="w-full">
                  Contact Dealership
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 text-xs text-brand-muted">
              <Badge variant="default">No haggle pricing</Badge>
              <Badge variant="default">Inspected &amp; detailed</Badge>
            </div>
          </section>

          {/* Payment calculator */}
          <PaymentCalculator price={price || 0} />

          {/* Quick links */}
          <section className="card-surface space-y-2 p-4 text-xs text-brand-muted">
            <p>
              Want to trade in your current vehicle?{' '}
              <Link
                to={`/trade-in?vehicle=${vehicleId}`}
                className="text-brand-primary hover:underline"
              >
                Request a trade‑in valuation
              </Link>
              .
            </p>
            <p>
              Prefer to see this vehicle in person first?{' '}
              <Link
                to={`/test-drive?vehicle=${vehicleId}`}
                className="text-brand-primary hover:underline"
              >
                Schedule a test drive
              </Link>
              .
            </p>
          </section>
        </div>
      </div>

      {/* ── Related vehicles ──────────────────────────────────── */}
      {!relatedLoading && relatedVehicles.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-section-title">You might also like</h2>
          <p className="text-body-muted text-sm">
            Similar vehicles based on body style — perfect if you&apos;re still
            deciding between options.
          </p>
          <VehicleGrid vehicles={relatedVehicles} view="grid" />
        </section>
      )}
    </section>
  )
}

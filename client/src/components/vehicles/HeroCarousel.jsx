// client/src/components/vehicles/HeroCarousel.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200'

const AUTOPLAY_MS = 5000
const SWIPE_THRESHOLD = 50

function resolveImage(vehicle) {
  return vehicle?.images?.[0]?.url || vehicle?.imageUrl || FALLBACK_IMAGE
}

function formatPrice(price) {
  if (price === null || price === undefined) return null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price)
}

export function HeroCarousel({ vehicles = [], loading = false }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(null)
  const touchDeltaX = useRef(0)
  const timerRef = useRef(null)

  const count = vehicles.length

  const goTo = useCallback(
    (i) => {
      if (!count) return
      setIndex(((i % count) + count) % count)
    },
    [count]
  )

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  // Autoplay
  useEffect(() => {
    if (paused || count <= 1) return
    timerRef.current = setInterval(() => {
      setIndex((prevIdx) => (prevIdx + 1) % count)
    }, AUTOPLAY_MS)
    return () => clearInterval(timerRef.current)
  }, [paused, count])

  // Clamp index if the vehicle list shrinks/reloads
  useEffect(() => {
    if (index >= count && count > 0) setIndex(0)
  }, [count, index])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
    setPaused(true)
  }

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current
  }

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > SWIPE_THRESHOLD) {
      if (touchDeltaX.current < 0) next()
      else prev()
    }
    touchStartX.current = null
    touchDeltaX.current = 0
    setPaused(false)
  }

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 animate-pulse">
        <span className="text-gray-500 text-sm">Loading vehicles…</span>
      </div>
    )
  }

  if (!count) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
        <span className="text-gray-400 text-sm">
          No vehicles available yet.
        </span>
      </div>
    )
  }

  const vehicle = vehicles[index]
  const vehicleId = vehicle._id || vehicle.id
  const price = formatPrice(vehicle.price)
  const title =
    vehicle.title ||
    `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}`.trim()

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          key={vehicleId}
          src={resolveImage(vehicle)}
          alt={title || 'Vehicle'}
          className="h-full w-full object-cover transition-opacity duration-700 ease-out"
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent" />
      </div>

      {/* Clickable vehicle info -> real vehicle detail page */}
      <Link
        to={`/vehicles/${vehicleId}`}
        className="absolute inset-x-4 bottom-16 sm:inset-x-10 sm:bottom-20 z-20 max-w-md group"
      >
        <div className="inline-block rounded-lg bg-black/60 backdrop-blur-sm px-4 py-3 group-hover:bg-black/75 transition-colors">
          <p className="text-white font-semibold text-sm sm:text-base line-clamp-1">
            {title || 'View Vehicle'}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs sm:text-sm text-gray-200">
            {vehicle.year && <span>{vehicle.year}</span>}
            {price && (
              <span className="text-brand-accent font-bold">{price}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Prev / Next arrows */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              prev()
            }}
            aria-label="Previous vehicle"
            className="hidden sm:flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 z-20
                       w-9 h-9 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              next()
            }}
            aria-label="Next vehicle"
            className="hidden sm:flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 z-20
                       w-9 h-9 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {vehicles.map((v, i) => (
            <button
              key={v._id || v.id || i}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                goTo(i)
              }}
              aria-label={`Go to vehicle ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? 'w-6 bg-brand-accent'
                  : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

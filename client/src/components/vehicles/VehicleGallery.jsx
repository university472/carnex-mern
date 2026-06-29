// client/src/components/vehicles/VehicleGallery.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '../ui/Badge'

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'

export function VehicleGallery({ images = [], title, bodyType }) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Normalize: accepts both string[] and {url, publicId}[]
  const normalized = images
    .map((img) => (typeof img === 'string' ? img : img?.url))
    .filter(Boolean)

  const displayImages = normalized.length > 0 ? normalized : [FALLBACK_IMAGE]
  const hasMultiple = displayImages.length > 1

  return (
    <section className="card-surface space-y-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-brand-secondary">Photos</h2>
        {bodyType && (
          <Badge variant="accent" className="text-xs">
            {bodyType}
          </Badge>
        )}
      </div>

      <div className="relative overflow-hidden rounded-md bg-black/5">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={displayImages[activeIndex]}
            alt={`${title || 'Vehicle'} — photo ${activeIndex + 1}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="h-64 w-full object-cover sm:h-80 lg:h-[420px]"
            loading="lazy"
            onError={(e) => {
              e.target.src = FALLBACK_IMAGE
            }}
          />
        </AnimatePresence>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((i) =>
                  i === 0 ? displayImages.length - 1 : i - 1
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40
                         p-2 text-white hover:bg-black/60 transition-colors"
              aria-label="Previous photo"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((i) =>
                  i === displayImages.length - 1 ? 0 : i + 1
                )
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40
                         p-2 text-white hover:bg-black/60 transition-colors"
              aria-label="Next photo"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {displayImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIndex
                      ? 'w-4 bg-white'
                      : 'w-1.5 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((src, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border
                         transition-all ${
                           activeIndex === index
                             ? 'border-brand-primary ring-1 ring-brand-primary'
                             : 'border-brand-border hover:border-brand-primary/60'
                         }`}
              aria-label={`View photo ${index + 1}`}
            >
              <img
                src={src}
                alt={`${title || 'Vehicle'} photo ${index + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.src = FALLBACK_IMAGE
                }}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

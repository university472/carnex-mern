import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'

import { Badge } from '../ui/Badge'

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'

export function VehicleGallery({
  images = [],
  title,
  bodyType,
  layout = 'carousel'
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [loading, setLoading] = useState(true)

  const displayImages = useMemo(() => {
    const normalized = images
      .map((img) => (typeof img === 'string' ? img : img?.url))
      .filter(Boolean)

    return normalized.length ? normalized : [FALLBACK_IMAGE]
  }, [images])

  const hasMultiple = displayImages.length > 1

  useEffect(() => {
    setLoading(true)
  }, [activeIndex])

  const nextImage = () => {
    setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
  }

  // ---------- Touch swipe handling ----------
  const touchStartX = useRef(null)

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) prevImage()
      else nextImage()
    }
    touchStartX.current = null
  }

  // ---------- Keyboard support ----------
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!fullscreen) return

      if (e.key === 'Escape') {
        setFullscreen(false)
      }

      if (e.key === 'ArrowRight') {
        nextImage()
      }

      if (e.key === 'ArrowLeft') {
        prevImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [fullscreen, displayImages.length])

  // ---------- Fullscreen modal ----------
  const FullscreenViewer = () => (
    <AnimatePresence>
      {fullscreen && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setFullscreen(false)}
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute top-5 right-5 text-white text-3xl"
            aria-label="Close fullscreen"
          >
            ✕
          </button>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-6 text-white text-4xl"
                aria-label="Previous image"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-6 text-white text-4xl"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          <motion.img
            key={activeIndex}
            src={displayImages[activeIndex]}
            alt={title || 'Vehicle'}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )

  // ---------- Main gallery ----------
  return (
    <>
      <FullscreenViewer />

      <section className="card-surface space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-brand-secondary">Photos</h2>

          {bodyType && <Badge variant="accent">{bodyType}</Badge>}
        </div>

        <div
          className="relative overflow-hidden rounded-lg bg-gray-100"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {loading && (
            <div className="absolute inset-0 animate-pulse bg-gray-200" />
          )}

          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={displayImages[activeIndex]}
              alt={`${title || 'Vehicle'} image ${activeIndex + 1}`}
              loading="lazy"
              className="h-72 w-full cursor-pointer object-cover sm:h-96 lg:h-[520px]"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onLoad={() => setLoading(false)}
              onClick={() => setFullscreen(true)}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE
              }}
            />
          </AnimatePresence>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70"
                aria-label="Previous image"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          {/* Image Counter */}
          {hasMultiple && (
            <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-xs text-white">
              {activeIndex + 1} / {displayImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {hasMultiple && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {displayImages.map((src, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={clsx(
                  'relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-md border transition-all',
                  activeIndex === idx
                    ? 'border-brand-primary ring-2 ring-brand-primary'
                    : 'border-brand-border hover:border-brand-primary/60'
                )}
                aria-label={`View image ${idx + 1}`}
              >
                <img
                  src={src}
                  alt={`${title || 'Vehicle'} thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE
                  }}
                />

                {activeIndex === idx && (
                  <div className="absolute inset-0 bg-black/10" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Dot Indicators */}
        {hasMultiple && (
          <div className="flex justify-center gap-2">
            {displayImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to image ${idx + 1}`}
                onClick={() => setActiveIndex(idx)}
                className={clsx(
                  'h-2 rounded-full transition-all',
                  activeIndex === idx
                    ? 'w-6 bg-brand-primary'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                )}
              />
            ))}
          </div>
        )}

        {/* Mosaic Preview */}
        {layout === 'mosaic' && hasMultiple && (
          <div className="grid grid-cols-4 gap-2">
            {displayImages.slice(0, 4).map((src, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveIndex(idx)
                  setFullscreen(true)
                }}
                className="relative overflow-hidden rounded-md"
                aria-label={`Open image ${idx + 1} in fullscreen`}
              >
                <img
                  src={src}
                  alt={`${title || 'Vehicle'} preview ${idx + 1}`}
                  className="h-24 w-full object-cover transition hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE
                  }}
                />

                {idx === 3 && displayImages.length > 4 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-lg font-bold text-white">
                    +{displayImages.length - 4}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

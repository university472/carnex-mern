// client/src/pages/public/VehicleDetail.jsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useVehicleById, useLatestVehicles } from '../../hooks/useVehicles'
import { PaymentCalculator } from '../../components/vehicles/PaymentCalculator'
import { Button } from '../../components/ui/Button'
import { VehicleGrid } from '../../components/vehicles/VehicleGrid'
import { Skeleton } from '../../components/ui/Skeleton'
import { StoreStatusBadge } from '../../components/ui/StoreStatusBadge'
import { QuoteForm } from '../../components/vehicles/QuoteForm'

// ── Formatting helpers ───────────────────────────────
const fmtCur = (val) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val)
const fmtNum = (val) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val)

// ── Small inline icons (no external icon dependency) ─
const Icon = {
  check: (p) => (
    <svg viewBox="0 0 20 20" fill="none" className={p.className}>
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.12" />
      <path
        d="M6 10.5l2.5 2.5L14 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}>
      <path
        d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  bolt: (p) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}>
      <path
        d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  doc: (p) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}>
      <path
        d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v5h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  gauge: (p) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}>
      <path
        d="M12 21a9 9 0 100-18 9 9 0 000 18z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 12l4-4M5 12h1M18 12h1M12 5v1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}>
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  fullscreen: (p) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}>
      <path
        d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  chevronLeft: (p) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  chevronRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── Fullscreen Lightbox Modal with Touch Swipe & Pinch-to-Zoom ────────
function FullscreenGallery({ images, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isZoomed, setIsZoomed] = useState(false)

  const touchStartX = useRef(null)
  const touchStartY = useRef(null)
  const pinchStartDist = useRef(null)
  const pinchStartScale = useRef(1)
  const lastPanPoint = useRef(null)
  const swipeOffset = useRef(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeX, setSwipeX] = useState(0)

  const total = images.length

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Reset zoom on image change
  useEffect(() => {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
    setIsZoomed(false)
    setSwipeX(0)
  }, [currentIndex])

  const goTo = useCallback((index) => {
    setCurrentIndex(index)
  }, [])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1))
  }, [total])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1))
  }, [total])

  // Preload neighbors
  useEffect(() => {
    if (total <= 1) return
    const nextIdx = currentIndex === total - 1 ? 0 : currentIndex + 1
    const prevIdx = currentIndex === 0 ? total - 1 : currentIndex - 1
    ;[nextIdx, prevIdx].forEach((idx) => {
      const img = new Image()
      img.src = images[idx]
    })
  }, [currentIndex, images, total])

  const getDistance = (touches) => {
    const [a, b] = touches
    return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)
  }

  const clampTranslate = (t, s) => {
    // Limit panning when zoomed
    const maxX = (s - 1) * 150
    const maxY = (s - 1) * 100
    return {
      x: Math.max(-maxX, Math.min(maxX, t.x)),
      y: Math.max(-maxY, Math.min(maxY, t.y))
    }
  }

  // Touch handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      pinchStartDist.current = getDistance(e.touches)
      pinchStartScale.current = scale
      return
    }

    if (isZoomed) {
      lastPanPoint.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      }
      return
    }

    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    setIsSwiping(true)
    swipeOffset.current = 0
  }

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      if (pinchStartDist.current == null) return
      const newDist = getDistance(e.touches)
      const ratio = newDist / pinchStartDist.current
      const newScale = Math.min(4, Math.max(1, pinchStartScale.current * ratio))
      setScale(newScale)
      setIsZoomed(newScale > 1.05)
      return
    }

    if (isZoomed && lastPanPoint.current) {
      e.preventDefault()
      const dx = e.touches[0].clientX - lastPanPoint.current.x
      const dy = e.touches[0].clientY - lastPanPoint.current.y
      lastPanPoint.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      }
      setTranslate((prev) =>
        clampTranslate({ x: prev.x + dx, y: prev.y + dy }, scale)
      )
      return
    }

    if (!isSwiping || touchStartX.current === null || isZoomed) return

    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const diffX = currentX - touchStartX.current
    const diffY = currentY - touchStartY.current

    if (Math.abs(diffX) > Math.abs(diffY)) {
      e.preventDefault()
      const resistance = 0.6
      if (
        (currentIndex === 0 && diffX > 0) ||
        (currentIndex === total - 1 && diffX < 0)
      ) {
        swipeOffset.current = diffX * resistance * 0.25
      } else {
        swipeOffset.current = diffX * resistance
      }
      setSwipeX(swipeOffset.current)
    }
  }

  const handleTouchEnd = (e) => {
    if (pinchStartDist.current != null && e.touches.length < 2) {
      pinchStartDist.current = null
      if (scale < 1.05) {
        setScale(1)
        setTranslate({ x: 0, y: 0 })
        setIsZoomed(false)
      }
      return
    }

    if (isZoomed) {
      lastPanPoint.current = null
      return
    }

    if (touchStartX.current === null) return

    const diffX = e.changedTouches[0].clientX - touchStartX.current
    const diffY = e.changedTouches[0].clientY - touchStartY.current

    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 120) {
      onClose()
    } else if (Math.abs(diffX) > 50) {
      if (diffX > 0) goToPrev()
      else goToNext()
    }

    setIsSwiping(false)
    setSwipeX(0)
    touchStartX.current = null
    touchStartY.current = null
  }

  // Double-tap to zoom
  const lastTapRef = useRef(0)
  const handleImageDoubleTap = (e) => {
    e.stopPropagation()
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      if (isZoomed) {
        setScale(1)
        setTranslate({ x: 0, y: 0 })
        setIsZoomed(false)
      } else {
        setScale(2.5)
        setIsZoomed(true)
      }
    }
    lastTapRef.current = now
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          if (!isZoomed) goToPrev()
          break
        case 'ArrowRight':
          if (!isZoomed) goToNext()
          break
        case '+':
        case '=':
          setScale((s) => Math.min(4, s + 0.5))
          setIsZoomed(true)
          break
        case '-':
          setScale((s) => {
            const ns = Math.max(1, s - 0.5)
            if (ns <= 1.05) setIsZoomed(false)
            return ns
          })
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, goToPrev, goToNext, isZoomed])

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/98 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      {/* Close button - IMPROVED VISIBILITY */}
      <button
        className="
    absolute top-4 right-4 z-10 
    w-12 h-12 
    rounded-full 
    bg-black/60 backdrop-blur-md 
    border-2 border-white/30
    text-white 
    text-2xl font-bold
    flex items-center justify-center
    hover:bg-black/80 hover:scale-110
    active:scale-95
    transition-all duration-200
    shadow-lg shadow-black/30
  "
        onClick={onClose}
        aria-label="Close"
      >
        <span className="leading-none">✕</span>
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 z-10 rounded-full bg-black/60 backdrop-blur-md px-4 py-2 text-white text-sm font-bold border border-white/20">
        {currentIndex + 1} / {total}
      </div>

      {/* Navigation arrows - hidden on mobile (swipe instead) */}
      {total > 1 && !isZoomed && (
        <>
          {/* Left Arrow - Previous */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToPrev()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-black/50 backdrop-blur hover:bg-black/70 transition-all text-white border border-white/20"
            aria-label="Previous"
          >
            <Icon.chevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow - Next */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-black/50 backdrop-blur hover:bg-black/70 transition-all text-white border border-white/20"
            aria-label="Next"
          >
            <Icon.chevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main image container */}
      <div
        className="w-full h-full flex items-center justify-center px-4 md:px-20"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="overflow-hidden"
          style={{
            transform: isSwiping ? `translateX(${swipeX}px)` : 'none',
            transition: isSwiping
              ? 'none'
              : 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <img
            src={images[currentIndex]}
            alt={`Vehicle image ${currentIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain select-none rounded-lg"
            draggable={false}
            onClick={handleImageDoubleTap}
            onError={(e) => {
              e.currentTarget.src =
                'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'
            }}
            style={{
              transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
              transition: pinchStartDist.current
                ? 'none'
                : 'transform 0.3s ease-out',
              cursor: isZoomed ? 'grab' : scale > 1 ? 'zoom-out' : 'zoom-in'
            }}
          />
        </div>
      </div>

      {/* Bottom indicators */}
      {total > 1 && !isZoomed && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation()
                goTo(idx)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Zoom indicator */}
      {isZoomed && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 
     rounded-full bg-black/60 backdrop-blur-md    ✅ Dark background
     px-4 py-2 text-white/90 text-xs z-10 
     border border-white/20"
        >
          {' '}
          ✅ Border for visibility Pinch to adjust zoom · Double-tap to reset
        </div>
      )}

      {/* Thumbnail strip at bottom */}
      {total > 4 && !isZoomed && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 overflow-x-auto max-w-[80vw] px-4 pb-2 z-10">
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation()
                goTo(idx)
              }}
              className={`flex-shrink-0 w-12 h-10 rounded-md overflow-hidden border-2 transition-all ${
                currentIndex === idx
                  ? 'border-white opacity-100'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Premium Vertical Gallery - All images in scrollable column ───────
function PremiumGallery({ images, title }) {
  const [fullscreenIndex, setFullscreenIndex] = useState(null)
  const [loadedImages, setLoadedImages] = useState({})
  const scrollContainerRef = useRef(null)

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }))
  }

  if (!images.length) {
    return (
      <div className="rounded-3xl overflow-hidden bg-slate-100 aspect-[16/9] flex items-center justify-center">
        <div className="text-center">
          <Icon.gauge className="h-10 w-10 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-500 text-sm font-medium">
            No images available
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-3xl overflow-hidden bg-white shadow-[0_8px_40px_rgba(15,23,42,0.08)] border border-slate-100">
        {/* Hero first image - takes full width with swipe hint */}
        <div
          className="relative overflow-hidden cursor-pointer group"
          onClick={() => setFullscreenIndex(0)}
        >
          <img
            src={images[0]}
            alt={`${title} - Main`}
            className="w-full aspect-[16/9] md:aspect-[16/8] object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'
            }}
            onLoad={() => handleImageLoad(0)}
          />

          {/* Fullscreen button overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm rounded-full p-3">
              <Icon.fullscreen className="h-6 w-6 text-white" />
            </span>
          </div>

          {/* Image counter badge */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-white text-xs font-bold">
              1 / {images.length}
            </div>
          )}

          {/* Swipe indicator - mobile only */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1.5 text-white/70 text-[10px] uppercase tracking-wider">
              <span>Swipe to see all</span>
              <Icon.chevronRight className="h-3 w-3" />
            </div>
          )}
        </div>

        {/* All images in a scrollable vertical grid */}
        <div
          ref={scrollContainerRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 p-3 max-h-[600px] overflow-y-auto scrollbar-thin"
        >
          {images.map((src, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${
                index === 0 ? 'hidden' : '' // Hide first image as it's shown above
              }`}
              onClick={() => setFullscreenIndex(index)}
            >
              {/* Skeleton loader */}
              {!loadedImages[index] && (
                <div className="absolute inset-0 bg-slate-200 animate-pulse" />
              )}

              <img
                src={src}
                alt={`${title} - ${index + 1}`}
                className="w-full aspect-[4/3] object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                loading="lazy"
                onLoad={() => handleImageLoad(index)}
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'
                }}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                <span className="text-white text-xs font-bold">
                  {index + 1}
                </span>
                <Icon.fullscreen className="h-4 w-4 text-white" />
              </div>

              {/* Active indicator ring */}
              <div className="absolute inset-0 ring-2 ring-inset ring-transparent group-hover:ring-white/30 rounded-xl transition-all duration-300" />
            </div>
          ))}
        </div>

        {/* View all photos button */}
        <div className="px-3 pb-3">
          <button
            onClick={() => setFullscreenIndex(0)}
            className="w-full py-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm font-bold text-slate-700 flex items-center justify-center gap-2 group"
          >
            <Icon.fullscreen className="h-4 w-4 group-hover:scale-110 transition-transform" />
            View all {images.length} photos
          </button>
        </div>
      </div>

      {/* Fullscreen lightbox */}
      {fullscreenIndex !== null && (
        <FullscreenGallery
          images={images}
          initialIndex={fullscreenIndex}
          onClose={() => setFullscreenIndex(null)}
        />
      )}
    </>
  )
}

// ── Premium spec tile grid ────────────────────────────
function SpecGrid({ columns }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {columns.map((col, idx) =>
        col
          .filter((item) => item.value || item.value === 0)
          .map((item, i) => (
            <div
              key={`${idx}-${i}`}
              className="group rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3.5 transition-all duration-200 hover:bg-white hover:border-red-100 hover:shadow-[0_4px_20px_rgba(220,38,38,0.08)]"
            >
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600 flex-shrink-0" />
                {item.label}
              </p>
              <p className="text-[15px] font-extrabold text-slate-900 tracking-tight">
                {item.value}
              </p>
            </div>
          ))
      )}
    </div>
  )
}

// ── Feature chips ─────────────────────────────────────
function FeatureList({ items }) {
  if (!items || items.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((f, i) => (
        <span
          key={i}
          className="group inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50/60 pl-2 pr-3.5 py-1.5 text-[13px] font-semibold text-slate-700 transition-all duration-200 hover:bg-red-600 hover:border-red-600 hover:text-white hover:shadow-md hover:-translate-y-0.5"
        >
          <Icon.check className="h-4 w-4 text-red-600 group-hover:text-white transition-colors" />
          {f}
        </span>
      ))}
    </div>
  )
}

// ── Premium section heading ───────────────────────────
const SectionHeading = ({ children, eyebrow, className = '' }) => (
  <div className={className}>
    {eyebrow && (
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-red-600 mb-1">
        {eyebrow}
      </p>
    )}
    <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
      <span className="h-5 w-1 rounded-full bg-gradient-to-b from-red-600 to-red-700 inline-block" />
      {children}
    </h3>
  </div>
)

const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white rounded-2xl shadow-[0_2px_16px_rgba(15,23,42,0.06)] border border-slate-100 ${className}`}
  >
    {children}
  </div>
)

// ── Main VehicleDetail Component ──────────────────────
export function VehicleDetail() {
  const { id } = useParams()
  const { vehicle, loading, error } = useVehicleById(id)
  const { vehicles: latestVehicles, loading: relatedLoading } =
    useLatestVehicles(6)

  // 🔼 Scroll to top when the detail page mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (loading) {
    return (
      <section className="page-content space-y-6">
        <Skeleton className="h-8 w-2/3" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
          <div className="space-y-4">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </section>
    )
  }

  if (error || !vehicle) {
    return (
      <section className="page-content">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-10 text-center space-y-4 max-w-lg mx-auto">
          <div className="mx-auto h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
            <Icon.gauge className="h-7 w-7 text-red-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Vehicle not found
          </h1>
          <p className="text-slate-600">
            {error ||
              'This vehicle might have been removed or is no longer available.'}
          </p>
          <Link
            to="/inventory"
            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-red-700 hover:shadow-lg"
          >
            Back to Inventory
          </Link>
        </div>
      </section>
    )
  }

  const {
    title,
    price,
    mileage,
    year,
    make,
    model,
    bodyType,
    fuelType,
    transmission,
    driveType,
    exteriorColor,
    interiorColor,
    condition,
    stockNumber,
    vin,
    description,
    dealerNotes,
    specs = {},
    features = {},
    badges = {},
    media = {},
    images,
    imageUrl
  } = vehicle

  const galleryImages =
    images && images.length > 0
      ? images.map((img) => (typeof img === 'string' ? img : img.url))
      : imageUrl
        ? [imageUrl]
        : []

  const relatedVehicles = latestVehicles
    .filter((v) => v._id !== vehicle._id && v.bodyType === bodyType)
    .slice(0, 3)

  const salePrice = badges.salePrice || vehicle.salePrice
  const showSale = salePrice && salePrice < price
  const isSold = vehicle.status === 'sold'

  // ── Build spec columns ────────
  const engineSpecs = specs.engine || {}
  const engineCols = [
    [
      { label: 'Bore', value: engineSpecs.bore },
      { label: 'Compression', value: engineSpecs.compressionRatio },
      { label: 'Displacement', value: engineSpecs.size },
      { label: 'Stroke', value: engineSpecs.stroke }
    ],
    [
      {
        label: 'Horsepower',
        value: engineSpecs.horsepower
          ? `${engineSpecs.horsepower} hp @ ${engineSpecs.horsepowerRpm || '—'} rpm`
          : null
      },
      {
        label: 'Torque',
        value: engineSpecs.torque
          ? `${engineSpecs.torque} ft-lb @ ${engineSpecs.torqueRpm || '—'} rpm`
          : null
      },
      { label: 'Cylinders', value: engineSpecs.cylinders },
      { label: 'RPM', value: engineSpecs.horsepowerRpm }
    ],
    [
      { label: 'Fuel System', value: engineSpecs.fuelSystem },
      { label: 'Valves', value: engineSpecs.valves },
      { label: 'Cam Type', value: engineSpecs.camType || engineSpecs.type },
      { label: 'Engine Brand', value: engineSpecs.type }
    ]
  ]

  const dims = specs.dimensions || {}
  const weight = specs.weight || {}
  const dimCols = [
    [
      { label: 'Length', value: dims.length },
      { label: 'Width', value: dims.width },
      { label: 'Height', value: dims.height },
      { label: 'Wheelbase', value: dims.wheelbase }
    ],
    [
      { label: 'Ground Clearance', value: dims.groundClearance },
      { label: 'Fuel Capacity', value: dims.fuelTankCapacity },
      { label: 'Payload', value: weight.payload },
      { label: 'Towing', value: weight.towingCapacity }
    ],
    [
      { label: 'Curb Weight', value: weight.curbWeight },
      { label: 'GVWR', value: weight.gvwr },
      { label: 'Cargo', value: dims.cargoCapacity },
      { label: 'Seating', value: specs.seating }
    ]
  ]

  const transSpecs = specs.transmission || {}
  const transCols = [
    [
      { label: 'Transmission', value: transmission },
      { label: 'Gears', value: transSpecs.gears },
      { label: 'Type', value: transSpecs.type }
    ],
    [
      { label: 'Drive Type', value: driveType },
      { label: 'Transfer Case', value: transSpecs.transferCase },
      { label: 'Differential', value: transSpecs.differential }
    ],
    [
      { label: 'Front Suspension', value: transSpecs.frontSuspension },
      { label: 'Rear Suspension', value: transSpecs.rearSuspension },
      { label: 'Brakes', value: transSpecs.brakes }
    ]
  ]

  // ── Feature categories ──────────────────────────────
  const featureCategories = [
    { key: 'comfort', label: 'Air Conditioning' },
    { key: 'convenience', label: 'Convenience' },
    { key: 'entertainment', label: 'Entertainment' },
    { key: 'interior', label: 'Interior' },
    { key: 'exterior', label: 'Exterior' },
    { key: 'technology', label: 'Technology' },
    { key: 'safety', label: 'Safety' },
    { key: 'driverAssistance', label: 'Driver Assistance' }
  ]

  const vehicleInfoRows = [
    ['Condition', condition],
    [
      'Engine',
      engineSpecs.size
        ? `${engineSpecs.size} ${engineSpecs.type || ''}`.trim()
        : undefined
    ],
    ['Transmission', transmission],
    ['Fuel Type', fuelType],
    ['Drivetrain', driveType],
    ['Trim', specs.trim],
    ['Exterior Color', exteriorColor],
    ['Interior Color', interiorColor],
    ['Stock #', stockNumber],
    ['VIN', vin]
  ].filter(([, val]) => val !== undefined && val !== null && val !== '')

  return (
    <section className="page-content space-y-8">
      {/* ── Hero header ──────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-6 py-7 sm:px-10 sm:py-9 shadow-[0_12px_50px_rgba(2,6,23,0.35)]">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-red-600/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-red-500 mb-2">
              {condition === 'new' ? 'New Arrival' : 'Certified Listing'} ·
              Stock&nbsp;{stockNumber || '—'}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {year} {make} {model}
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 font-medium">
              {specs.trim ? `${specs.trim} · ` : ''}
              {bodyType}
            </p>
          </div>
          {isSold ? (
            <span className="rounded-full bg-red-600 px-5 py-2 text-sm font-black text-white tracking-widest">
              SOLD
            </span>
          ) : (
            <StoreStatusBadge />
          )}
        </div>
      </div>

      {/* Main content + sidebar */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] items-start">
        {/* Left column */}
        <div className="space-y-8">
          {/* 🔥 NEW Premium Gallery */}
          <PremiumGallery images={galleryImages} title={title} />

          {media?.videoUrl && (
            <Card className="p-4">
              <SectionHeading eyebrow="Walkaround">
                Vehicle Video
              </SectionHeading>
              <div className="mt-4 aspect-video overflow-hidden rounded-xl">
                <iframe
                  src={
                    media.videoUrl.includes('watch?v=')
                      ? media.videoUrl.replace('watch?v=', 'embed/')
                      : media.videoUrl
                  }
                  title="Vehicle Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Card>
          )}

          {/* Price card */}
          <Card className="p-6 flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
            {showSale && (
              <span className="absolute top-0 left-0 bg-gradient-to-r from-red-600 to-red-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-br-xl">
                Special Offer
              </span>
            )}
            <div className={showSale ? 'mt-4' : ''}>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {year} {make} {model}
              </h2>
              <p className="text-slate-500 text-sm font-medium mt-0.5">
                {specs.trim || title}
              </p>
              {mileage > 0 ? (
                <span className="inline-flex items-center gap-1.5 mt-3 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                  <Icon.gauge className="h-3.5 w-3.5 text-red-600" />
                  {fmtNum(mileage)} miles
                </span>
              ) : condition === 'new' ? (
                <span className="inline-flex items-center gap-1.5 mt-3 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  <Icon.check className="h-3.5 w-3.5" />
                  New Vehicle
                </span>
              ) : null}
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-500 uppercase tracking-[0.2em] font-bold mb-1">
                {showSale ? 'Sale Price' : 'Price'}
              </p>
              {showSale && (
                <p className="text-sm text-slate-400 mb-0.5">
                  Was <span className="line-through">{fmtCur(price)}</span>
                </p>
              )}
              <span className="text-5xl font-black text-slate-900 tracking-tight">
                {fmtCur(showSale ? salePrice : price)}
              </span>
            </div>
          </Card>

          {/* ─── Vehicle Info + Description ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Vehicle Info */}
            <Card className="p-6">
              <SectionHeading eyebrow="At a glance" className="mb-4">
                Vehicle Info
              </SectionHeading>
              <dl className="divide-y divide-slate-100">
                {vehicleInfoRows.map(([label, val]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2.5 group"
                  >
                    <dt className="text-slate-500 font-semibold text-[13px] uppercase tracking-wide">
                      {label}
                    </dt>
                    <dd className="text-slate-900 font-extrabold text-sm text-right">
                      {val}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>

            {/* Right: Description + Features */}
            <Card className="p-6">
              {description && (
                <>
                  <SectionHeading eyebrow="Overview" className="mb-4">
                    Description
                  </SectionHeading>
                  <p className="text-slate-600 leading-relaxed text-[15px] mb-4">
                    {description}
                  </p>
                  {dealerNotes && (
                    <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 mb-4">
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Dealer Notes
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {dealerNotes}
                      </p>
                    </div>
                  )}
                </>
              )}

              {featureCategories.some(
                ({ key }) => features[key]?.length > 0
              ) && (
                <>
                  <SectionHeading eyebrow="Equipped with" className="mb-4 mt-2">
                    Features
                  </SectionHeading>
                  <div className="space-y-4">
                    {featureCategories.map(({ key, label }) => {
                      const list = features[key]
                      if (!list || list.length === 0) return null
                      return (
                        <div key={key}>
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            {label}
                          </h4>
                          <FeatureList items={list} />
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Financing / CARFAX bar */}
          {!isSold && (
            <Card className="p-6 flex flex-wrap items-center justify-between gap-6 bg-gradient-to-r from-white to-slate-50">
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex h-12 w-12 rounded-xl bg-red-50 items-center justify-center flex-shrink-0">
                  <Icon.bolt className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-900 font-bold">
                    Financing Available
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    All credit types welcome · Fast approval
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <Link to={`/financing?vehicle=${vehicle._id}`}>
                    Apply Now
                  </Link>
                </Button>
                {media.carfaxUrl ? (
                  <a
                    href={media.carfaxUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-slate-900 shadow border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <Icon.doc className="h-4 w-4 text-slate-500" />
                    SHOW ME THE <span className="text-blue-600">CARFAX</span>
                  </a>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    CARFAX not available
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* ─── Standard Specifications ─── */}
          <Card className="p-6 sm:p-7 space-y-7">
            <SectionHeading eyebrow="Full breakdown">
              Standard Specifications
            </SectionHeading>

            {Object.values(engineSpecs).filter(Boolean).length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Icon.bolt className="h-3.5 w-3.5 text-red-600" />
                  Engine Details
                </h4>
                <SpecGrid columns={engineCols} />
              </div>
            )}

            {(Object.values(dims).filter(Boolean).length > 0 ||
              Object.values(weight).filter(Boolean).length > 0) && (
              <>
                <div className="border-t border-slate-100" />
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Icon.gauge className="h-3.5 w-3.5 text-red-600" />
                    Measurements & Capacity
                  </h4>
                  <SpecGrid columns={dimCols} />
                </div>
              </>
            )}

            {Object.values(transSpecs).filter(Boolean).length > 0 && (
              <>
                <div className="border-t border-slate-100" />
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Icon.shield className="h-3.5 w-3.5 text-red-600" />
                    Transmission & Drivetrain
                  </h4>
                  <SpecGrid columns={transCols} />
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6 lg:sticky lg:top-24">
          {isSold ? (
            <Card className="p-6 text-center">
              <h3 className="text-xl font-black text-red-600">SOLD VEHICLE</h3>
              <p className="mt-2 text-sm text-slate-600">
                This vehicle has been sold. Please check our latest inventory.
              </p>
              <Link to="/inventory">
                <Button className="mt-4 w-full">View Available Cars</Button>
              </Link>
            </Card>
          ) : (
            <>
              <Card className="p-5" id="quote-form">
                <QuoteForm vehicle={vehicle} />
              </Card>
              <Card className="p-5">
                <PaymentCalculator price={salePrice || price} />
              </Card>
            </>
          )}

          <div className="rounded-2xl bg-slate-900 px-5 py-4 flex items-center gap-3">
            <Icon.shield className="h-6 w-6 text-red-500 flex-shrink-0" />
            <p className="text-xs text-slate-300 leading-snug">
              Every Carnex vehicle is carefully inspected by our dealership
              team, so you can shop with confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Similar vehicles */}
      {!relatedLoading && relatedVehicles.length > 0 && (
        <section className="space-y-4 pt-2">
          <SectionHeading eyebrow="You may also like">
            Similar Vehicles
          </SectionHeading>
          <VehicleGrid vehicles={relatedVehicles} view="grid" />
        </section>
      )}
    </section>
  )
}

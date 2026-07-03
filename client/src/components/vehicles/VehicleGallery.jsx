// // client/src/components/vehicles/VehicleGallery.jsx
// import { useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Badge } from '../ui/Badge'

// const FALLBACK_IMAGE =
//   'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'

// export function VehicleGallery({ images = [], title, bodyType }) {
//   const [activeIndex, setActiveIndex] = useState(0)

//   // Normalize: accepts both string[] and {url, publicId}[]
//   const normalized = images
//     .map((img) => (typeof img === 'string' ? img : img?.url))
//     .filter(Boolean)

//   const displayImages = normalized.length > 0 ? normalized : [FALLBACK_IMAGE]
//   const hasMultiple = displayImages.length > 1

//   return (
//     <section className="card-surface space-y-3 p-4">
//       <div className="flex items-center justify-between gap-3">
//         <h2 className="text-sm font-semibold text-brand-secondary">Photos</h2>
//         {bodyType && (
//           <Badge variant="accent" className="text-xs">
//             {bodyType}
//           </Badge>
//         )}
//       </div>

//       <div className="relative overflow-hidden rounded-md bg-black/5">
//         <AnimatePresence mode="wait">
//           <motion.img
//             key={activeIndex}
//             src={displayImages[activeIndex]}
//             alt={`${title || 'Vehicle'} — photo ${activeIndex + 1}`}
//             initial={{ opacity: 0, scale: 1.02 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.98 }}
//             transition={{ duration: 0.25, ease: 'easeOut' }}
//             className="h-64 w-full object-cover sm:h-80 lg:h-[420px]"
//             loading="lazy"
//             onError={(e) => {
//               e.target.src = FALLBACK_IMAGE
//             }}
//           />
//         </AnimatePresence>

//         {hasMultiple && (
//           <>
//             <button
//               type="button"
//               onClick={() =>
//                 setActiveIndex((i) =>
//                   i === 0 ? displayImages.length - 1 : i - 1
//                 )
//               }
//               className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40
//                          p-2 text-white hover:bg-black/60 transition-colors"
//               aria-label="Previous photo"
//             >
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//               >
//                 <path d="m15 18-6-6 6-6" />
//               </svg>
//             </button>
//             <button
//               type="button"
//               onClick={() =>
//                 setActiveIndex((i) =>
//                   i === displayImages.length - 1 ? 0 : i + 1
//                 )
//               }
//               className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40
//                          p-2 text-white hover:bg-black/60 transition-colors"
//               aria-label="Next photo"
//             >
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//               >
//                 <path d="m9 18 6-6-6-6" />
//               </svg>
//             </button>

//             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
//               {displayImages.map((_, i) => (
//                 <button
//                   key={i}
//                   type="button"
//                   onClick={() => setActiveIndex(i)}
//                   className={`h-1.5 rounded-full transition-all ${
//                     i === activeIndex
//                       ? 'w-4 bg-white'
//                       : 'w-1.5 bg-white/50 hover:bg-white/75'
//                   }`}
//                   aria-label={`Go to photo ${i + 1}`}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {hasMultiple && (
//         <div className="flex gap-2 overflow-x-auto pb-1">
//           {displayImages.map((src, index) => (
//             <button
//               key={index}
//               type="button"
//               onClick={() => setActiveIndex(index)}
//               className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border
//                          transition-all ${
//                            activeIndex === index
//                              ? 'border-brand-primary ring-1 ring-brand-primary'
//                              : 'border-brand-border hover:border-brand-primary/60'
//                          }`}
//               aria-label={`View photo ${index + 1}`}
//             >
//               <img
//                 src={src}
//                 alt={`${title || 'Vehicle'} photo ${index + 1}`}
//                 className="h-full w-full object-cover"
//                 loading="lazy"
//                 onError={(e) => {
//                   e.target.src = FALLBACK_IMAGE
//                 }}
//               />
//             </button>
//           ))}
//         </div>
//       )}
//     </section>
//   )
// }

// client/src/components/vehicles/VehicleGallery.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '../ui/Badge'
import clsx from 'clsx'

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'

export function VehicleGallery({
  images = [],
  title,
  bodyType,
  layout = 'carousel'
}) {
  const [activeIndex, setActiveIndex] = useState(0)

  const normalized = images
    .map((img) => (typeof img === 'string' ? img : img?.url))
    .filter(Boolean)
  const displayImages = normalized.length > 0 ? normalized : [FALLBACK_IMAGE]
  const hasMultiple = displayImages.length > 1

  // Mosaic layout – large main + thumbnail column (as in HTML)
  if (layout === 'mosaic' && hasMultiple) {
    const thumbnails = displayImages.slice(0, 3)
    const extraCount = displayImages.length - 3
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
        <div className="grid grid-cols-[2fr_1fr] gap-2">
          <div className="overflow-hidden rounded-md bg-black/5">
            <img
              src={displayImages[activeIndex]}
              alt={`${title || 'Vehicle'} — main`}
              className="h-64 w-full object-cover sm:h-80 lg:h-[420px] cursor-pointer"
              loading="lazy"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE
              }}
              onClick={() => {
                // Optional: open a fullscreen view – but we keep the mosaic interactivity simple
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            {thumbnails.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={clsx(
                  'relative h-[calc((100%-2*4px)/3)] overflow-hidden rounded-md border transition-all',
                  activeIndex === i
                    ? 'border-brand-primary ring-1 ring-brand-primary'
                    : 'border-brand-border hover:border-brand-primary/60'
                )}
              >
                <img
                  src={src}
                  alt={`${title || 'Vehicle'} thumb ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = FALLBACK_IMAGE
                  }}
                />
              </button>
            ))}
            {extraCount > 0 && (
              <div className="relative overflow-hidden rounded-md border border-brand-border bg-black/20 flex-1">
                <img
                  src={displayImages[3]}
                  className="absolute inset-0 h-full w-full object-cover opacity-40"
                  alt=""
                />
                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white bg-black/50">
                  +{extraCount}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Default carousel layout (unchanged)
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
            transition={{ duration: 0.25 }}
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
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
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
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
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
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border transition-all ${activeIndex === idx ? 'border-brand-primary ring-1 ring-brand-primary' : 'border-brand-border hover:border-brand-primary/60'}`}
            >
              <img
                src={src}
                alt={`${title || 'Vehicle'} thumb ${idx + 1}`}
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

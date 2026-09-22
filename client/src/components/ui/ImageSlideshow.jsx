// client/src/components/ui/ImageSlideshow.jsx
import { useState, useEffect } from 'react'

export function ImageSlideshow({ images, interval = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!images || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images, interval])

  // Agar koi image nahi hai to fallback dikhao
  if (!images || images.length === 0) {
    return (
      <img
        src="https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1200"
        alt="Carnex Auto Sales lot in Sacramento"
        className="h-64 w-full object-cover sm:h-72 lg:h-80"
        loading="lazy"
      />
    )
  }

  return (
    <div className="relative h-64 w-full sm:h-72 lg:h-80 overflow-hidden">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Vehicle ${index + 1}`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />
      ))}

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

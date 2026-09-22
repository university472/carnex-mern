// client/src/components/ui/StoreStatusBadge.jsx
import { useState, useEffect } from 'react'
import { useStoreStatus } from '../../hooks/useStoreStatus'

export function StoreStatusBadge() {
  const isOpen = useStoreStatus()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until client-side hydration is complete
  // This prevents SSR/static generation mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-300" />
        <span className="text-gray-400">Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      {/* Status indicator dot */}
      <span
        className={`relative inline-flex h-3 w-3 ${
          isOpen ? 'animate-pulse' : ''
        }`}
      >
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOpen ? 'bg-green-500' : 'bg-red-500'
          } ${isOpen ? 'animate-ping' : ''}`}
        />
        <span
          className={`relative inline-flex h-3 w-3 rounded-full ${
            isOpen ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
      </span>

      {/* Open/Closed text */}
      <span
        className={`font-semibold ${
          isOpen ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {isOpen ? 'Open Now' : 'Closed'}
      </span>

      {/* Hours display */}
      <span className="text-gray-500">| 9:00 am – 5:00 pm</span>
    </div>
  )
}

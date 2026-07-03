// client/src/components/ui/StoreStatusBadge.jsx
import { useStoreStatus } from '../../hooks/useStoreStatus'

export function StoreStatusBadge() {
  const isOpen = useStoreStatus()

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${
          isOpen ? 'bg-success-500' : 'bg-red-500'
        }`}
      />
      <span className={isOpen ? 'text-success-600' : 'text-red-500'}>
        {isOpen ? 'Open' : 'Open'}
      </span>
      <span className="text-brand-muted">| 9:00 am – 5:00 pm</span>
    </div>
  )
}

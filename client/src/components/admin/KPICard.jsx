// client/src/components/admin/KPICard.jsx
import clsx from 'clsx'

export function KPICard({ label, total, last7Days, color = 'red', loading }) {
  const colorMap = {
    red: 'text-red-600 bg-red-50',
    green: 'text-green-600 bg-green-50',
    amber: 'text-amber-600 bg-amber-50',
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50'
  }

  if (loading) {
    return (
      <div className="card-surface p-4 space-y-2 animate-pulse">
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-7 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    )
  }

  return (
    <div className="card-surface p-4 space-y-2">
      <p className="text-xs text-brand-muted">{label}</p>
      <p className="text-2xl font-semibold text-brand-secondary">
        {total ?? '—'}
      </p>
      {last7Days != null && (
        <p
          className={clsx(
            'text-xs font-medium px-2 py-0.5 rounded-full inline-block',
            colorMap[color]
          )}
        >
          +{last7Days} this week
        </p>
      )}
    </div>
  )
}

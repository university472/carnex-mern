// client/src/components/admin/LeadStatusBadge.jsx
import clsx from 'clsx'
import { capitalize } from '../../utils/formatters'

const STATUS_STYLES = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  'in-review': 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  responded: 'bg-green-50 text-green-700 border-green-200',
  closed: 'bg-gray-100 text-gray-600 border-gray-200',
  archived: 'bg-gray-50 text-gray-400 border-gray-100',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-purple-50 text-purple-700 border-purple-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  searching: 'bg-amber-50 text-amber-700 border-amber-200',
  matched: 'bg-green-50 text-green-700 border-green-200',
  contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  appraised: 'bg-purple-50 text-purple-700 border-purple-200'
}

export function LeadStatusBadge({ status }) {
  const style =
    STATUS_STYLES[status] || 'bg-gray-100 text-gray-500 border-gray-200'

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border',
        style
      )}
    >
      {capitalize(status?.replace(/-/g, ' ') || 'unknown')}
    </span>
  )
}

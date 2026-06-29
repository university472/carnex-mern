// client/src/utils/formatters.js

/** Format a price: 29500 → "$29,500" (default USD) */
export function formatPrice(value, currency = 'USD') {
  if (value == null || isNaN(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(Number(value))
}

/** Format mileage: 42000 → "42,000 mi" */
export function formatMileage(value, unit = 'mi') {
  if (value == null || isNaN(value)) return '—'
  return `${new Intl.NumberFormat('en-US').format(Number(value))} ${unit}`
}

/** Format a date: "2024-03-15" → "Mar 15, 2024" */
export function formatDate(value, opts = {}) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...opts
  }).format(new Date(value))
}

/** Format datetime with time: "2024-03-15T14:30:00" → "Mar 15, 2024, 02:30 PM" */
export function formatDateTime(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

/** Truncate a string with ellipsis */
export function truncate(str, maxLen = 60) {
  if (!str) return ''
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str
}

/** Capitalize first letter */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

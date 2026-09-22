// client/src/components/ui/Select.jsx
import clsx from 'clsx'

export function Select({
  label,
  id,
  options,
  placeholder = 'Select…',
  className,
  error, // 🔥 NEW
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className={clsx(
            'text-xs font-medium',
            error ? 'text-red-600' : 'text-brand-secondary'
          )}
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={clsx(
          'block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:ring-1',
          error
            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
            : 'border-brand-border text-brand-text focus:border-brand-primary focus:ring-brand-primary',
          className
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options?.map((opt) => {
          if (typeof opt === 'string') {
            return (
              <option key={opt} value={opt}>
                {opt}
              </option>
            )
          }
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        })}
      </select>
      {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
    </div>
  )
}

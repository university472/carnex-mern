// client/src/components/ui/Select.jsx
import clsx from 'clsx'

export function Select({
  label,
  id,
  options,
  placeholder = 'Select…',
  className,
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium text-brand-secondary"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={clsx(
          'block w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm text-brand-text shadow-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary',
          className
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {/* {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))} */}
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
    </div>
  )
}

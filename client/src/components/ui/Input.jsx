// client/src/components/ui/Input.jsx
import clsx from 'clsx'

export function Input({
  id,
  label,
  name,
  type = 'text',
  className,
  helperText,
  error, // 🔥 NEW: error prop
  textarea = false,
  ...props
}) {
  const inputId = id || name || label?.replace(/\s+/g, '-').toLowerCase()
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className={clsx(
            'text-xs font-medium',
            error ? 'text-red-600' : 'text-brand-secondary'
          )}
        >
          {label}
        </label>
      )}

      {textarea ? (
        <textarea
          id={inputId}
          name={name}
          rows={4}
          className={clsx(
            'block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-brand-muted focus:ring-1 resize-y',
            error
              ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
              : 'border-brand-border text-brand-text focus:border-brand-primary focus:ring-brand-primary',
            className
          )}
          {...props}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          className={clsx(
            'block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-brand-muted focus:ring-1',
            error
              ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
              : 'border-brand-border text-brand-text focus:border-brand-primary focus:ring-brand-primary',
            className
          )}
          {...props}
        />
      )}

      {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-brand-muted">{helperText}</p>
      )}
    </div>
  )
}

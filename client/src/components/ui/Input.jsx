import clsx from 'clsx'

export function Input({
  id,
  label,
  name,
  type = 'text',
  className,
  helperText,
  textarea = false,
  ...props
}) {
  const inputId = id || name || label?.replace(/\s+/g, '-').toLowerCase()
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-brand-secondary"
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
            'block w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm text-brand-text shadow-sm placeholder:text-brand-muted focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-y',
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
            'block w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm text-brand-text shadow-sm placeholder:text-brand-muted focus:border-brand-primary focus:ring-1 focus:ring-brand-primary',
            className
          )}
          {...props}
        />
      )}

      {helperText && <p className="text-xs text-brand-muted">{helperText}</p>}
    </div>
  )
}

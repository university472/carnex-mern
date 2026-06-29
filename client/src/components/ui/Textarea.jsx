// client/src/components/ui/Textarea.jsx
import clsx from 'clsx'

export function Textarea({
  label,
  name,
  className,
  helperText,
  rows = 4,
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-medium text-brand-secondary"
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={clsx(
          'block w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm text-brand-text shadow-sm placeholder:text-brand-muted focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none',
          className
        )}
        {...props}
      />
      {helperText && <p className="text-xs text-brand-muted">{helperText}</p>}
    </div>
  )
}

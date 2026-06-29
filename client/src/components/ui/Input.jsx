// client/src/components/ui/Input.jsx
import clsx from 'clsx'

export function Input({
  label,
  name,
  type = 'text',
  className,
  helperText,
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
      <input
        id={name}
        name={name}
        type={type}
        className={clsx(
          'block w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm text-brand-text shadow-sm placeholder:text-brand-muted focus:border-brand-primary focus:ring-1 focus:ring-brand-primary',
          className
        )}
        {...props}
      />
      {helperText && <p className="text-xs text-brand-muted">{helperText}</p>}
    </div>
  )
}

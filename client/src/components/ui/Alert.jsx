// client/src/components/ui/Alert.jsx
import clsx from 'clsx'

const variants = {
  success: 'border border-green-100 bg-green-50 text-green-800',
  error: 'border border-red-100 bg-red-50 text-red-800',
  info: 'border border-brand-border bg-brand-bg text-brand-secondary'
}

export function Alert({ variant = 'info', title, children, className }) {
  return (
    <div
      className={clsx(
        'flex gap-2 rounded-md px-3 py-2 text-xs',
        variants[variant],
        className
      )}
    >
      <div className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-current/10" />
      <div className="space-y-0.5">
        {title && <p className="font-medium">{title}</p>}
        {children && <p className="text-xs">{children}</p>}
      </div>
    </div>
  )
}

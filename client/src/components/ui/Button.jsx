// client/src/components/ui/Button.jsx
import clsx from 'clsx'

const baseClasses =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-bg disabled:opacity-60 disabled:cursor-not-allowed'

const variantClasses = {
  primary:
    'bg-brand-primary text-white hover:bg-brand-primaryHover shadow-card',
  secondary: 'bg-brand-secondary text-gray-100 hover:bg-black/80 shadow-card',
  ghost:
    'bg-transparent text-brand-secondary hover:bg-brand-border/30 border border-brand-border',
  accent: 'bg-brand-accent text-brand-secondary hover:bg-[#d97706] shadow-card'
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <button
      type={props.type ?? 'button'}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// client/src/components/ui/Card.jsx
import clsx from 'clsx'

export function Card({ className, children, ...props }) {
  return (
    <div className={clsx('card-surface', className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return (
    <div
      className={clsx('px-5 pt-5 pb-3 border-b border-brand-border', className)}
    >
      {children}
    </div>
  )
}

export function CardBody({ className, children }) {
  return <div className={clsx('px-5 py-4', className)}>{children}</div>
}

export function CardFooter({ className, children }) {
  return (
    <div
      className={clsx('px-5 pb-5 pt-3 border-t border-brand-border', className)}
    >
      {children}
    </div>
  )
}

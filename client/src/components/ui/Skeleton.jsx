// client/src/components/ui/Skeleton.jsx
import clsx from 'clsx'

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={clsx('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  )
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={clsx('h-3', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }) {
  return (
    <div className={clsx('card-surface p-4 space-y-3', className)}>
      <Skeleton className="h-40 w-full" />
      <SkeletonText lines={2} />
      <Skeleton className="h-8 w-1/2" />
    </div>
  )
}

// client/src/components/ui/Badge.jsx
import clsx from 'clsx';

const baseClasses =
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium';

const variantClasses = {
  default:
    'border-brand-border bg-brand-surface text-brand-muted',
  accent:
    'border-brand-accent/60 bg-brand-accent/10 text-brand-accent',
  success:
    'border-brand-success/60 bg-brand-success/10 text-brand-success',
};

export function Badge({ variant = 'default', className, children }) {
  return (
    <span className={clsx(baseClasses, variantClasses[variant], className)}>
      {children}
    </span>
  );
}
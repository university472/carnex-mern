// client/src/components/ui/Pagination.jsx
import { Button } from './Button'

export function Pagination({ page = 1, totalPages = 1, onChange }) {
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div className="mt-6 flex items-center justify-between border-t border-brand-border pt-4">
      <p className="text-xs text-brand-muted">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={!canPrev}
          onClick={() => canPrev && onChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={!canNext}
          onClick={() => canNext && onChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

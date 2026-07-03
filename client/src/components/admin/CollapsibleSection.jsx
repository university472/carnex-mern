// client/src/components/admin/CollapsibleSection.jsx
import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

export function CollapsibleSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="card-surface p-4 space-y-3">
      <button
        type="button"
        className="flex items-center gap-2 text-sm font-semibold text-brand-secondary w-full text-left"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {title}
      </button>
      {open && <div>{children}</div>}
    </div>
  )
}

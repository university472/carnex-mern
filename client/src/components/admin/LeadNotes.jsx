// client/src/components/admin/LeadNotes.jsx
import { useState } from 'react'
import { Button } from '../ui/Button'
import { useToast } from '../../hooks/useToast'

/**
 * Inline notes panel shown in lead detail modals / pages.
 * @param {Object} props
 * @param {string} props.notes - existing notes string
 * @param {function} props.onSave - async (notes: string) => void
 */
export function LeadNotes({ notes: initialNotes = '', onSave }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initialNotes)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  const handleSave = async () => {
    setSaving(true)
    try {
      if (onSave) await onSave(value)
      toast.success('Notes saved')
      setEditing(false)
    } catch {
      toast.error('Failed to save notes')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setValue(initialNotes)
    setEditing(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-brand-secondary">
          Internal notes
        </p>
        {!editing && (
          <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
            {initialNotes ? 'Edit' : 'Add note'}
          </Button>
        )}
      </div>

      {editing ? (
        <>
          <textarea
            rows={4}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="block w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm text-brand-text
                       shadow-sm placeholder:text-brand-muted focus:border-brand-primary focus:ring-1
                       focus:ring-brand-primary resize-none"
            placeholder="Add notes about this lead…"
          />
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </>
      ) : (
        <p className="text-xs text-brand-muted whitespace-pre-wrap min-h-[2rem]">
          {value || 'No notes yet.'}
        </p>
      )}
    </div>
  )
}

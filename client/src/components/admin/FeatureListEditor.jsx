// client/src/components/admin/FeatureListEditor.jsx
import { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { X } from 'lucide-react'

export function FeatureListEditor({ label, items = [], onChange }) {
  const [newItem, setNewItem] = useState('')

  const addItem = () => {
    if (!newItem.trim()) return
    onChange([...items, newItem.trim()])
    setNewItem('')
  }

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div>
      <p className="text-xs font-medium text-brand-muted mb-1">{label}</p>
      <div className="flex gap-2 mb-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add feature"
          className="flex-1"
        />
        <Button type="button" size="sm" onClick={addItem}>
          Add
        </Button>
      </div>
      {items.length > 0 && (
        <ul className="space-y-1">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between text-sm bg-brand-surface rounded px-2 py-1"
            >
              <span>{item}</span>
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => removeItem(idx)}
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

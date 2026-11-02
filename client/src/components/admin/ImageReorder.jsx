// client/src/components/admin/ImageReorder.jsx
import { useState } from 'react'
import clsx from 'clsx'
import { GripVertical, X } from 'lucide-react'

// Moves the item at `from` into position `to`, shifting the others along.
// e.g. [1,2,3,4] moving index 3 to index 1 -> [1,4,2,3]
function moveItem(list, from, to) {
  const arr = [...list]
  const [item] = arr.splice(from, 1)
  arr.splice(to, 0, item)
  return arr
}

export function ImageReorder({ images, onReorder, onRemove }) {
  const [dragIndex, setDragIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)

  const resetDrag = () => {
    setDragIndex(null)
    setOverIndex(null)
  }

  const handleDragStart = (e, idx) => {
    setDragIndex(idx)
    e.dataTransfer.effectAllowed = 'move'
    // Firefox won't start a drag without data
    e.dataTransfer.setData('text/plain', String(idx))
  }

  const handleDragOver = (e, idx) => {
    if (dragIndex === null) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (overIndex !== idx) setOverIndex(idx)
  }

  const handleDrop = (e, idx) => {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== idx) {
      onReorder(moveItem(images, dragIndex, idx))
    }
    resetDrag()
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {images.map((img, idx) => (
        <div
          key={idx}
          draggable
          onDragStart={(e) => handleDragStart(e, idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDragLeave={() => overIndex === idx && setOverIndex(null)}
          onDrop={(e) => handleDrop(e, idx)}
          onDragEnd={resetDrag}
          className={clsx(
            'relative border rounded-md overflow-hidden group cursor-grab active:cursor-grabbing select-none transition',
            dragIndex === idx && 'opacity-40',
            overIndex === idx && dragIndex !== idx
              ? 'border-brand-primary ring-2 ring-brand-primary'
              : 'border-brand-border'
          )}
        >
          <img
            src={typeof img === 'string' ? img : img.url}
            alt={`vehicle ${idx + 1}`}
            draggable={false}
            className="w-full h-24 object-cover pointer-events-none"
          />
          <span className="absolute top-1 left-1 flex items-center gap-0.5 rounded bg-white/90 px-1 text-[11px] font-medium text-gray-700 shadow">
            <GripVertical size={12} />
            {idx === 0 ? 'Cover' : idx + 1}
          </span>
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition">
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="bg-white rounded p-0.5 shadow text-red-500 hover:text-red-700"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

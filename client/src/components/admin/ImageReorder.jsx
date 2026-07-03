// client/src/components/admin/ImageReorder.jsx
import { ArrowUp, ArrowDown, X } from 'lucide-react'

export function ImageReorder({ images, onReorder, onRemove }) {
  const moveUp = (index) => {
    if (index === 0) return
    const arr = [...images]
    ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
    onReorder(arr)
  }

  const moveDown = (index) => {
    if (index === images.length - 1) return
    const arr = [...images]
    ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
    onReorder(arr)
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {images.map((img, idx) => (
        <div
          key={idx}
          className="relative border border-brand-border rounded-md overflow-hidden group"
        >
          <img
            src={typeof img === 'string' ? img : img.url}
            alt={`vehicle ${idx + 1}`}
            className="w-full h-24 object-cover"
          />
          <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition">
            <button
              type="button"
              onClick={() => moveUp(idx)}
              className="bg-white rounded p-0.5 shadow text-gray-600 hover:text-black"
            >
              <ArrowUp size={14} />
            </button>
            <button
              type="button"
              onClick={() => moveDown(idx)}
              className="bg-white rounded p-0.5 shadow text-gray-600 hover:text-black"
            >
              <ArrowDown size={14} />
            </button>
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

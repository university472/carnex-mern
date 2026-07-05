// client/src/components/reviews/ReviewForm.jsx
import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { StarRating } from '../ui/StarRating'
import { useToast } from '../../hooks/useToast'
import { submitReview } from '../../services/reviewService'

export function ReviewForm({ onSuccess }) {
  const toast = useToast()
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    location: '',
    purchasedVehicle: '',
    rating: 0,
    reviewText: ''
  })
  const [images, setImages] = useState([]) // File objects
  const [previews, setPreviews] = useState([]) // Object URLs for display
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleRating = (value) => {
    setForm({ ...form, rating: value })
  }

  // ✅ FIX: accumulate images instead of replacing them
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files)
    if (newFiles.length === 0) return

    // Append new files to existing array, keeping the first 6
    setImages((prev) => {
      const combined = [...prev, ...newFiles].slice(0, 6)
      return combined
    })

    setPreviews((prev) => {
      const newPreviews = newFiles.map((f) => URL.createObjectURL(f))
      const combined = [...prev, ...newPreviews].slice(0, 6)
      return combined
    })

    // Reset input so the same file can be chosen again
    e.target.value = ''
  }

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => {
      // Revoke the removed preview URL to free memory
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.rating === 0) {
      toast.error('Please select a rating')
      return
    }
    if (images.length > 6) {
      toast.error('Maximum 6 images allowed')
      return
    }
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('customerName', form.customerName)
      fd.append('email', form.email)
      fd.append('location', form.location)
      fd.append('purchasedVehicle', form.purchasedVehicle)
      fd.append('rating', form.rating.toString())
      fd.append('reviewText', form.reviewText)
      images.forEach((img) => fd.append('images', img))

      await submitReview(fd)
      toast.success('Review submitted! It will appear after approval.')
      // Reset form
      setForm({
        customerName: '',
        email: '',
        location: '',
        purchasedVehicle: '',
        rating: 0,
        reviewText: ''
      })
      // Clean up all previews
      previews.forEach((url) => URL.revokeObjectURL(url))
      setImages([])
      setPreviews([])
      if (onSuccess) onSuccess()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Your Name *"
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          required
        />
        <Input
          label="Email *"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="City / Location"
          name="location"
          value={form.location}
          onChange={handleChange}
        />
        <Input
          label="Purchased Vehicle"
          name="purchasedVehicle"
          value={form.purchasedVehicle}
          onChange={handleChange}
        />
      </div>

      {/* ═══ Star Rating ═══ */}
      <div>
        <label className="block text-sm font-medium text-brand-secondary mb-1">
          Rating *
        </label>
        <StarRating rating={form.rating} onRate={handleRating} />
        {form.rating > 0 && (
          <span className="text-xs text-brand-muted ml-2">
            {form.rating} / 5
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-secondary mb-1">
          Review *
        </label>
        <textarea
          name="reviewText"
          rows={4}
          value={form.reviewText}
          onChange={handleChange}
          required
          className="w-full border border-brand-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
          placeholder="Share your experience..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-secondary mb-1">
          Photos (max 6)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm"
        />
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {previews.map((src, i) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded overflow-hidden border"
              >
                <img
                  src={src}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-0 right-0 bg-black/60 text-white text-xs w-5 h-5 flex items-center justify-center rounded-bl"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {images.length >= 6 && (
          <p className="text-xs text-brand-muted mt-1">
            Maximum 6 photos selected.
          </p>
        )}
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  )
}

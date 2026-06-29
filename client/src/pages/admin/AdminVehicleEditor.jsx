// client/src/pages/admin/AdminVehicleEditor.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { FileUpload } from '../../components/ui/FileUpload'
import { useToast } from '../../hooks/useToast'

const bodyTypeOptions = [
  { label: 'Sedan', value: 'Sedan' },
  { label: 'SUV', value: 'SUV' },
  { label: 'Truck', value: 'Truck' },
  { label: 'Hatchback', value: 'Hatchback' },
  { label: 'Coupe', value: 'Coupe' }
]

const fuelOptions = [
  { label: 'Petrol', value: 'Petrol' },
  { label: 'Diesel', value: 'Diesel' },
  { label: 'Hybrid', value: 'Hybrid' },
  { label: 'Electric', value: 'Electric' }
]

const transmissionOptions = [
  { label: 'Automatic', value: 'Automatic' },
  { label: 'Manual', value: 'Manual' },
  { label: 'CVT', value: 'CVT' }
]

const statusOptions = [
  { label: 'Available', value: 'available' },
  { label: 'Reserved', value: 'reserved' },
  { label: 'Sold', value: 'sold' },
  { label: 'Hidden', value: 'hidden' }
]

const empty = {
  title: '',
  make: '',
  model: '',
  year: '',
  price: '',
  mileage: '',
  bodyType: '',
  fuelType: '',
  transmission: '',
  color: '',
  location: '',
  status: 'available',
  imageUrl: ''
}

export function AdminVehicleEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(empty)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    const load = async () => {
      try {
        const { data } = await api.get(`/admin/vehicles/${id}`)
        const v = data?.data || data
        setForm({
          title: v.title || '',
          make: v.make || '',
          model: v.model || '',
          year: v.year || '',
          price: v.price || '',
          mileage: v.mileage || '',
          bodyType: v.bodyType || '',
          fuelType: v.fuelType || '',
          transmission: v.transmission || '',
          color: v.color || '',
          location: v.location || '',
          status: v.status || 'available',
          imageUrl: v.imageUrl || v.images?.[0]?.url || ''
        })
      } catch {
        toast.error('Failed to load vehicle')
        navigate('/admin/vehicles')
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [id])

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }))

  const handleFiles = (accepted) => {
    setFiles(accepted)
    setPreviews(accepted.map((f) => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        price: Number(form.price),
        mileage: Number(form.mileage)
      }

      if (files.length > 0) {
        const fd = new FormData()
        files.forEach((f) => fd.append('images', f))
        Object.entries(payload).forEach(([k, v]) => fd.append(k, v))
        if (isEdit) {
          await api.patch(`/admin/vehicles/${id}`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        } else {
          await api.post('/admin/vehicles', fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        }
      } else {
        if (isEdit) {
          await api.patch(`/admin/vehicles/${id}`, payload)
        } else {
          await api.post('/admin/vehicles', payload)
        }
      }

      toast.success(isEdit ? 'Vehicle updated' : 'Vehicle created')
      navigate('/admin/vehicles')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save vehicle')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <section className="page-content">
        <p className="text-brand-muted">Loading…</p>
      </section>
    )
  }

  return (
    <section className="page-content space-y-6">
      <header className="space-y-1">
        <h1 className="text-page-title">
          {isEdit ? 'Edit vehicle' : 'Add new vehicle'}
        </h1>
        <p className="text-body-muted text-sm">
          {isEdit
            ? 'Update vehicle details and images.'
            : 'Fill in details to create a new vehicle listing.'}
        </p>
      </header>

      <form
        className="card-surface p-5 space-y-5"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="v-title"
            label="Title"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            className="sm:col-span-3"
          />
          <Input
            id="v-make"
            label="Make"
            value={form.make}
            onChange={(e) => update('make', e.target.value)}
          />
          <Input
            id="v-model"
            label="Model"
            value={form.model}
            onChange={(e) => update('model', e.target.value)}
          />
          <Input
            id="v-year"
            label="Year"
            type="number"
            value={form.year}
            onChange={(e) => update('year', e.target.value)}
          />
          <Input
            id="v-price"
            label="Price (USD)"
            type="number"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
          />
          <Input
            id="v-mileage"
            label="Mileage"
            type="number"
            value={form.mileage}
            onChange={(e) => update('mileage', e.target.value)}
          />
          <Input
            id="v-color"
            label="Color"
            value={form.color}
            onChange={(e) => update('color', e.target.value)}
          />
          <Select
            id="v-bodyType"
            label="Body type"
            options={bodyTypeOptions}
            value={form.bodyType}
            onChange={(e) => update('bodyType', e.target.value)}
          />
          <Select
            id="v-fuelType"
            label="Fuel type"
            options={fuelOptions}
            value={form.fuelType}
            onChange={(e) => update('fuelType', e.target.value)}
          />
          <Select
            id="v-transmission"
            label="Transmission"
            options={transmissionOptions}
            value={form.transmission}
            onChange={(e) => update('transmission', e.target.value)}
          />
          <Select
            id="v-status"
            label="Status"
            options={statusOptions}
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
          />
          <Input
            id="v-location"
            label="Location"
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
          />
        </div>

        <Input
          id="v-imageUrl"
          label="Image URL (optional if uploading files)"
          value={form.imageUrl}
          onChange={(e) => update('imageUrl', e.target.value)}
          helperText="Direct URL to main image. Leave blank if uploading files below."
        />

        <FileUpload
          label="Upload vehicle images (optional)"
          onFiles={handleFiles}
          maxFiles={10}
        />

        {previews.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`preview ${i + 1}`}
                className="h-20 w-28 object-cover rounded-md border border-brand-border"
              />
            ))}
          </div>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/admin/vehicles')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : isEdit ? 'Update vehicle' : 'Create vehicle'}
          </Button>
        </div>
      </form>
    </section>
  )
}

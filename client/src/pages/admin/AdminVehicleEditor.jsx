// client/src/pages/admin/AdminVehicleEditor.jsx
import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { FileUpload } from '../../components/ui/FileUpload'
import { CollapsibleSection } from '../../components/admin/CollapsibleSection'
import { FeatureListEditor } from '../../components/admin/FeatureListEditor'
import { ImageReorder } from '../../components/admin/ImageReorder'
import { useToast } from '../../hooks/useToast'

const bodyTypeOptions = [
  { label: 'Sedan', value: 'Sedan' },
  { label: 'SUV', value: 'SUV' },
  { label: 'Coupe', value: 'Coupe' },
  { label: 'Convertible', value: 'Convertible' },
  { label: 'Hatchback', value: 'Hatchback' },
  { label: 'Wagon', value: 'Wagon' },
  { label: 'Pickup Truck', value: 'Pickup Truck' },
  { label: 'Van', value: 'Van' },
  { label: 'Minivan', value: 'Minivan' },
  { label: 'Crossover', value: 'Crossover' },
  { label: 'Luxury', value: 'Luxury' },
  { label: 'Sports Car', value: 'Sports Car' },
  { label: 'Electric', value: 'Electric' },
  { label: 'Hybrid', value: 'Hybrid' },
  { label: 'Diesel', value: 'Diesel' },
  { label: 'Other', value: 'Other' }
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

const initialForm = {
  title: '',
  make: '',
  model: '',
  year: '',
  price: '',
  mileage: '',
  condition: 'used',
  bodyType: '',
  fuelType: '',
  transmission: '',
  driveType: '',
  exteriorColor: '',
  interiorColor: '',
  location: '',
  stockNumber: '',
  vin: '',
  description: '',
  dealerNotes: '',
  warranty: '',
  status: 'available',
  isFeatured: false,
  badges: {
    salePrice: '',
    discountPrice: ''
  },
  media: {
    videoUrl: '',
    view360Url: '',
    carfaxUrl: ''
  },
  specs: {
    engine: {
      size: '',
      type: '',
      horsepower: '',
      horsepowerRpm: '',
      torque: '',
      torqueRpm: '',
      cylinders: '',
      valves: '',
      compressionRatio: '',
      fuelSystem: ''
    },
    transmission: {
      type: '',
      gears: '',
      description: ''
    },
    fuelEconomy: {
      cityMpg: '',
      highwayMpg: '',
      combinedMpg: ''
    },
    dimensions: {
      length: '',
      width: '',
      height: '',
      wheelbase: '',
      groundClearance: '',
      cargoCapacity: '',
      fuelTankCapacity: ''
    },
    weight: {
      curbWeight: '',
      gvwr: '',
      payload: '',
      towingCapacity: ''
    },
    performance: {
      zeroToSixty: '',
      topSpeed: ''
    },
    doors: '',
    seating: '',
    trim: ''
  },
  features: {
    comfort: [],
    convenience: [],
    entertainment: [],
    interior: [],
    exterior: [],
    technology: [],
    safety: [],
    driverAssistance: []
  },
  images: [],
  imageUrl: ''
}

const setNestedValue = (obj, path, value) => {
  const keys = path.split('.')
  const newObj = { ...obj }
  let current = newObj
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {}
    current[keys[i]] = { ...current[keys[i]] }
    current = current[keys[i]]
  }
  current[keys[keys.length - 1]] = value
  return newObj
}

export function AdminVehicleEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(initialForm)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  // Load existing vehicle for editing
  useEffect(() => {
    if (!isEdit) return
    const load = async () => {
      try {
        const { data } = await api.get(`/admin/vehicles/${id}`)
        const v = data?.data || data

        // Merge fetched data with initialForm to fill new nested fields
        setForm((prev) => ({
          ...prev,
          ...v,
          badges: { ...prev.badges, ...(v.badges || {}) },
          media: { ...prev.media, ...(v.media || {}) },
          specs: {
            ...prev.specs,
            ...(v.specs || {}),
            engine: { ...prev.specs.engine, ...(v.specs?.engine || {}) },
            transmission: {
              ...prev.specs.transmission,
              ...(v.specs?.transmission || {})
            },
            fuelEconomy: {
              ...prev.specs.fuelEconomy,
              ...(v.specs?.fuelEconomy || {})
            },
            dimensions: {
              ...prev.specs.dimensions,
              ...(v.specs?.dimensions || {})
            },
            weight: { ...prev.specs.weight, ...(v.specs?.weight || {}) },
            performance: {
              ...prev.specs.performance,
              ...(v.specs?.performance || {})
            }
          },
          features: { ...prev.features, ...(v.features || {}) },
          images: v.images || [],
          imageUrl: v.imageUrl || ''
        }))
      } catch {
        toast.error('Failed to load vehicle')
        navigate('/dealer-panel/vehicles')
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [id, isEdit, navigate, toast])

  const updateField = useCallback((field, value) => {
    setForm((prev) => {
      if (field.includes('.')) {
        return setNestedValue(prev, field, value)
      }
      return { ...prev, [field]: value }
    })
  }, [])

  const handleFiles = (accepted) => {
    setFiles((prev) => {
      const all = [...prev, ...accepted]
      return all.slice(0, 10)
    })
  }

  const handleRemoveImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleReorderImages = (newOrder) => {
    setForm((prev) => ({ ...prev, images: newOrder }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('==================================')
    console.log('SUBMIT CLICKED')

    console.log('YEAR:', form.year)
    console.log('CONDITION:', form.condition)
    console.log('==================================')
    setLoading(true)
    if (
      form.condition !== 'new' &&
      (!form.mileage || Number(form.mileage) < 1)
    ) {
      toast.error('Mileage is required for used and certified vehicles.')
      setLoading(false)
      return
    }
    if (!form.bodyType) {
      toast.error('Please select a Body Type.')
      setLoading(false)
      return
    }
    if (form.vin && form.vin.trim().length !== 17) {
      toast.error('VIN must be exactly 17 characters')
      setLoading(false)
      return
    }
    try {
      // Prepare payload – convert empty strings to undefined if needed, but numbers must be numbers
      const payload = { ...form }
      console.log('===================================')
      console.log('FORM')
      console.log(form)

      console.log('PAYLOAD')
      console.log(payload)

      console.log('YEAR :', payload.year)
      console.log('CONDITION :', payload.condition)

      console.log('JSON')
      console.log(JSON.stringify(payload, null, 2))
      console.log('===================================')
      // Convert numeric fields
      // ---------- Convert numeric fields ----------

      // Basic Information
      payload.year = form.year ? Number(form.year) : undefined
      payload.price = form.price ? Number(form.price) : undefined
      if (payload.condition === 'new') {
        payload.mileage = form.mileage === '' ? 0 : Number(form.mileage)
      } else {
        payload.mileage = Number(form.mileage)
      }

      // Pricing
      payload.badges.salePrice = form.badges.salePrice
        ? Number(form.badges.salePrice)
        : undefined

      payload.badges.discountPrice = form.badges.discountPrice
        ? Number(form.badges.discountPrice)
        : undefined

      // Engine
      payload.specs.engine.horsepower = form.specs.engine.horsepower
        ? Number(form.specs.engine.horsepower)
        : undefined

      payload.specs.engine.horsepowerRpm = form.specs.engine.horsepowerRpm
        ? Number(form.specs.engine.horsepowerRpm)
        : undefined

      payload.specs.engine.torque = form.specs.engine.torque
        ? Number(form.specs.engine.torque)
        : undefined

      payload.specs.engine.torqueRpm = form.specs.engine.torqueRpm
        ? Number(form.specs.engine.torqueRpm)
        : undefined

      payload.specs.engine.cylinders = form.specs.engine.cylinders
        ? Number(form.specs.engine.cylinders)
        : undefined

      payload.specs.engine.valves = form.specs.engine.valves
        ? Number(form.specs.engine.valves)
        : undefined

      // Transmission
      payload.specs.transmission.gears = form.specs.transmission.gears
        ? Number(form.specs.transmission.gears)
        : undefined

      // Fuel Economy
      payload.specs.fuelEconomy.cityMpg = form.specs.fuelEconomy.cityMpg
        ? Number(form.specs.fuelEconomy.cityMpg)
        : undefined

      payload.specs.fuelEconomy.highwayMpg = form.specs.fuelEconomy.highwayMpg
        ? Number(form.specs.fuelEconomy.highwayMpg)
        : undefined

      payload.specs.fuelEconomy.combinedMpg = form.specs.fuelEconomy.combinedMpg
        ? Number(form.specs.fuelEconomy.combinedMpg)
        : undefined

      // Vehicle
      payload.specs.doors = form.specs.doors
        ? Number(form.specs.doors)
        : undefined

      payload.specs.seating = form.specs.seating
        ? Number(form.specs.seating)
        : undefined

      // If images were uploaded via FileUpload, they will be appended as files
      const fd = new FormData()
      files.forEach((f) => fd.append('images', f))

      // Append the rest of the data as a JSON string in a "data" field
      // Remove images array from payload because it will be replaced by uploaded files or kept as is
      const dataCopy = { ...payload }
      if (files.length > 0) {
        // If new files are uploaded, we want to replace images; send empty array to signal replacement.
        dataCopy.images = []
      }
      console.log('FINAL PAYLOAD')
      console.log(JSON.stringify(dataCopy, null, 2))
      fd.append('data', JSON.stringify(dataCopy))

      if (isEdit) {
        await api.patch(`/admin/vehicles/${id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/admin/vehicles', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      toast.success(isEdit ? 'Vehicle updated' : 'Vehicle created')
      navigate('/dealer-panel/vehicles')
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
            : 'Fill in all details to create a professional dealership listing.'}
        </p>
      </header>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {/* Basic Information */}
        <CollapsibleSection title="Basic Information" defaultOpen>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="sm:col-span-3"
            />
            <Input
              label="Make"
              value={form.make}
              onChange={(e) => updateField('make', e.target.value)}
            />
            <Input
              label="Model"
              value={form.model}
              onChange={(e) => updateField('model', e.target.value)}
            />
            <Input
              label="Year"
              type="number"
              value={form.year}
              onChange={(e) => updateField('year', e.target.value)}
            />
            {/* <Input
              label="Condition"
              value={form.condition}
              onChange={(e) => updateField('condition', e.target.value)}
            /> */}
            <Select
              label="Condition"
              value={form.condition}
              onChange={(e) => updateField('condition', e.target.value)}
              options={[
                { label: 'New', value: 'new' },
                { label: 'Used', value: 'used' },
                { label: 'Certified', value: 'certified' }
              ]}
            />
            <Input
              label={`Mileage${form.condition !== 'new' ? ' *' : ''}`}
              type="number"
              value={form.mileage}
              onChange={(e) => updateField('mileage', e.target.value)}
              required={form.condition !== 'new'}
              helperText={
                form.condition === 'new'
                  ? 'Optional for new vehicles.'
                  : 'Required for used and certified vehicles.'
              }
            />

            <Input
              label="Stock #"
              value={form.stockNumber}
              onChange={(e) => updateField('stockNumber', e.target.value)}
            />
            <Input
              label="VIN"
              value={form.vin}
              onChange={(e) => updateField('vin', e.target.value)}
            />
            <Input
              label="Exterior Color"
              value={form.exteriorColor}
              onChange={(e) => updateField('exteriorColor', e.target.value)}
            />
            <Input
              label="Interior Color"
              value={form.interiorColor}
              onChange={(e) => updateField('interiorColor', e.target.value)}
            />

            <Select
              label="Body Type *"
              value={form.bodyType}
              options={bodyTypeOptions}
              onChange={(e) => updateField('bodyType', e.target.value)}
            />
          </div>
        </CollapsibleSection>

        {/* Pricing */}
        <CollapsibleSection title="Pricing">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Price (USD)"
              type="number"
              value={form.price}
              onChange={(e) => updateField('price', e.target.value)}
            />
            <Input
              label="Sale Price (optional)"
              type="number"
              value={form.badges.salePrice}
              onChange={(e) => updateField('badges.salePrice', e.target.value)}
            />
            <Input
              label="Discount Price (optional)"
              type="number"
              value={form.badges.discountPrice}
              onChange={(e) =>
                updateField('badges.discountPrice', e.target.value)
              }
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={form.isFeatured}
                onChange={(e) => updateField('isFeatured', e.target.checked)}
              />
              <label
                htmlFor="isFeatured"
                className="text-sm text-brand-secondary"
              >
                Featured vehicle
              </label>
            </div>
          </div>
        </CollapsibleSection>

        {/* Specifications */}
        <CollapsibleSection title="Specifications">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Trim"
              value={form.specs.trim}
              onChange={(e) => updateField('specs.trim', e.target.value)}
            />
            <Input
              label="Doors"
              type="number"
              value={form.specs.doors}
              onChange={(e) => updateField('specs.doors', e.target.value)}
            />
            <Input
              label="Seating"
              type="number"
              value={form.specs.seating}
              onChange={(e) => updateField('specs.seating', e.target.value)}
            />
          </div>
        </CollapsibleSection>

        {/* Engine */}
        <CollapsibleSection title="Engine">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Engine Size"
              value={form.specs.engine.size}
              onChange={(e) => updateField('specs.engine.size', e.target.value)}
            />
            <Input
              label="Engine Type"
              value={form.specs.engine.type}
              onChange={(e) => updateField('specs.engine.type', e.target.value)}
            />
            <Input
              label="Horsepower"
              type="number"
              value={form.specs.engine.horsepower}
              onChange={(e) =>
                updateField('specs.engine.horsepower', e.target.value)
              }
            />
            <Input
              label="Horsepower RPM"
              type="number"
              value={form.specs.engine.horsepowerRpm}
              onChange={(e) =>
                updateField('specs.engine.horsepowerRpm', e.target.value)
              }
            />
            <Input
              label="Torque (ft-lb)"
              type="number"
              value={form.specs.engine.torque}
              onChange={(e) =>
                updateField('specs.engine.torque', e.target.value)
              }
            />
            <Input
              label="Torque RPM"
              type="number"
              value={form.specs.engine.torqueRpm}
              onChange={(e) =>
                updateField('specs.engine.torqueRpm', e.target.value)
              }
            />
            <Input
              label="Cylinders"
              type="number"
              value={form.specs.engine.cylinders}
              onChange={(e) =>
                updateField('specs.engine.cylinders', e.target.value)
              }
            />
            <Input
              label="Valves"
              type="number"
              value={form.specs.engine.valves}
              onChange={(e) =>
                updateField('specs.engine.valves', e.target.value)
              }
            />
            <Input
              label="Compression Ratio"
              value={form.specs.engine.compressionRatio}
              onChange={(e) =>
                updateField('specs.engine.compressionRatio', e.target.value)
              }
            />
            <Input
              label="Fuel System"
              value={form.specs.engine.fuelSystem}
              onChange={(e) =>
                updateField('specs.engine.fuelSystem', e.target.value)
              }
            />
          </div>
        </CollapsibleSection>

        {/* Transmission */}
        <CollapsibleSection title="Transmission">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Transmission Type"
              value={form.specs.transmission.type}
              onChange={(e) =>
                updateField('specs.transmission.type', e.target.value)
              }
            />
            <Input
              label="Gears"
              type="number"
              value={form.specs.transmission.gears}
              onChange={(e) =>
                updateField('specs.transmission.gears', e.target.value)
              }
            />
            <Input
              label="Description"
              value={form.specs.transmission.description}
              onChange={(e) =>
                updateField('specs.transmission.description', e.target.value)
              }
            />
          </div>
        </CollapsibleSection>

        {/* Fuel Economy */}
        <CollapsibleSection title="Fuel Economy">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="City MPG"
              type="number"
              value={form.specs.fuelEconomy.cityMpg}
              onChange={(e) =>
                updateField('specs.fuelEconomy.cityMpg', e.target.value)
              }
            />
            <Input
              label="Highway MPG"
              type="number"
              value={form.specs.fuelEconomy.highwayMpg}
              onChange={(e) =>
                updateField('specs.fuelEconomy.highwayMpg', e.target.value)
              }
            />
            <Input
              label="Combined MPG"
              type="number"
              value={form.specs.fuelEconomy.combinedMpg}
              onChange={(e) =>
                updateField('specs.fuelEconomy.combinedMpg', e.target.value)
              }
            />
          </div>
        </CollapsibleSection>

        {/* Dimensions */}
        <CollapsibleSection title="Dimensions">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Length"
              value={form.specs.dimensions.length}
              onChange={(e) =>
                updateField('specs.dimensions.length', e.target.value)
              }
            />
            <Input
              label="Width"
              value={form.specs.dimensions.width}
              onChange={(e) =>
                updateField('specs.dimensions.width', e.target.value)
              }
            />
            <Input
              label="Height"
              value={form.specs.dimensions.height}
              onChange={(e) =>
                updateField('specs.dimensions.height', e.target.value)
              }
            />
            <Input
              label="Wheelbase"
              value={form.specs.dimensions.wheelbase}
              onChange={(e) =>
                updateField('specs.dimensions.wheelbase', e.target.value)
              }
            />
            <Input
              label="Ground Clearance"
              value={form.specs.dimensions.groundClearance}
              onChange={(e) =>
                updateField('specs.dimensions.groundClearance', e.target.value)
              }
            />
            <Input
              label="Cargo Capacity"
              value={form.specs.dimensions.cargoCapacity}
              onChange={(e) =>
                updateField('specs.dimensions.cargoCapacity', e.target.value)
              }
            />
            <Input
              label="Fuel Tank Capacity"
              value={form.specs.dimensions.fuelTankCapacity}
              onChange={(e) =>
                updateField('specs.dimensions.fuelTankCapacity', e.target.value)
              }
            />
          </div>
        </CollapsibleSection>

        {/* Weight & Towing */}
        <CollapsibleSection title="Weight & Towing">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Curb Weight"
              value={form.specs.weight.curbWeight}
              onChange={(e) =>
                updateField('specs.weight.curbWeight', e.target.value)
              }
            />
            <Input
              label="GVWR"
              value={form.specs.weight.gvwr}
              onChange={(e) => updateField('specs.weight.gvwr', e.target.value)}
            />
            <Input
              label="Payload"
              value={form.specs.weight.payload}
              onChange={(e) =>
                updateField('specs.weight.payload', e.target.value)
              }
            />
            <Input
              label="Towing Capacity"
              value={form.specs.weight.towingCapacity}
              onChange={(e) =>
                updateField('specs.weight.towingCapacity', e.target.value)
              }
            />
          </div>
        </CollapsibleSection>

        {/* Performance */}
        <CollapsibleSection title="Performance">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="0-60 Time"
              value={form.specs.performance.zeroToSixty}
              onChange={(e) =>
                updateField('specs.performance.zeroToSixty', e.target.value)
              }
            />
            <Input
              label="Top Speed"
              value={form.specs.performance.topSpeed}
              onChange={(e) =>
                updateField('specs.performance.topSpeed', e.target.value)
              }
            />
          </div>
        </CollapsibleSection>

        {/* Features (all categories) */}
        <CollapsibleSection title="Features">
          <div className="space-y-4">
            <FeatureListEditor
              label="Comfort Features"
              items={form.features.comfort}
              onChange={(items) => updateField('features.comfort', items)}
            />
            <FeatureListEditor
              label="Convenience Features"
              items={form.features.convenience}
              onChange={(items) => updateField('features.convenience', items)}
            />
            <FeatureListEditor
              label="Entertainment Features"
              items={form.features.entertainment}
              onChange={(items) => updateField('features.entertainment', items)}
            />
            <FeatureListEditor
              label="Interior Features"
              items={form.features.interior}
              onChange={(items) => updateField('features.interior', items)}
            />
            <FeatureListEditor
              label="Exterior Features"
              items={form.features.exterior}
              onChange={(items) => updateField('features.exterior', items)}
            />
            <FeatureListEditor
              label="Technology Features"
              items={form.features.technology}
              onChange={(items) => updateField('features.technology', items)}
            />
            <FeatureListEditor
              label="Safety Features"
              items={form.features.safety}
              onChange={(items) => updateField('features.safety', items)}
            />
            <FeatureListEditor
              label="Driver Assistance Features"
              items={form.features.driverAssistance}
              onChange={(items) =>
                updateField('features.driverAssistance', items)
              }
            />
          </div>
        </CollapsibleSection>

        {/* Description, Notes, Warranty */}
        <CollapsibleSection title="Description & Notes">
          <div className="space-y-4">
            <Input
              label="Description"
              textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              helperText="Public description visible on the website."
            />
            <Input
              label="Dealer Notes"
              textarea
              value={form.dealerNotes}
              onChange={(e) => updateField('dealerNotes', e.target.value)}
              helperText="Internal notes (not shown to customers)."
            />
            <Input
              label="Warranty"
              value={form.warranty}
              onChange={(e) => updateField('warranty', e.target.value)}
            />
          </div>
        </CollapsibleSection>

        {/* Media URLs */}
        <CollapsibleSection title="Media Links">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Video URL"
              value={form.media.videoUrl}
              onChange={(e) => updateField('media.videoUrl', e.target.value)}
            />
            <Input
              label="360° View URL"
              value={form.media.view360Url}
              onChange={(e) => updateField('media.view360Url', e.target.value)}
            />
            <Input
              label="CARFAX URL"
              value={form.media.carfaxUrl}
              onChange={(e) => updateField('media.carfaxUrl', e.target.value)}
            />
          </div>
        </CollapsibleSection>

        {/* Images */}
        <CollapsibleSection title="Images">
          <FileUpload
            label="Upload vehicle images"
            onFiles={handleFiles}
            maxFiles={10}
          />

          {/* Preview of newly selected images */}
          {files.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-brand-muted mb-2">Selected Images</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {files.map((file, index) => (
                  <div key={index} className="border rounded overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {form.images.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-brand-muted mb-2">
                Current images (drag or use arrows to reorder):
              </p>
              <ImageReorder
                images={form.images}
                onReorder={handleReorderImages}
                onRemove={handleRemoveImage}
              />
            </div>
          )}
          <Input
            label="Or enter an image URL (fallback)"
            value={form.imageUrl}
            onChange={(e) => updateField('imageUrl', e.target.value)}
            helperText="Used only if no images are uploaded."
          />
        </CollapsibleSection>

        <div className="flex gap-3 justify-end pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/dealer-panel/vehicles')}
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

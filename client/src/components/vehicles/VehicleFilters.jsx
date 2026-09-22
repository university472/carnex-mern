// client/src/components/vehicles/VehicleFilters.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'

const VITE_API_URL = import.meta.env.VITE_API_URL

// ✅ Fixed: Separate year options for "From" and "To"
const yearFromOptions = [
  { label: 'Any', value: '' },
  { label: '2010 & Older', value: '2010' },
  { label: '2015 & Older', value: '2015' },
  { label: '2018 & Older', value: '2018' },
  { label: '2020 & Older', value: '2020' },
  { label: '2022 & Older', value: '2022' },
  { label: '2024 & Older', value: '2024' }
]

const yearToOptions = [
  { label: 'Any', value: '' },
  { label: '2024 & Newer', value: '2024' },
  { label: '2022 & Newer', value: '2022' },
  { label: '2020 & Newer', value: '2020' },
  { label: '2018 & Newer', value: '2018' },
  { label: '2015 & Newer', value: '2015' },
  { label: '2010 & Newer', value: '2010' }
]

export function VehicleFilters({ filters, onChange, onReset }) {
  const [options, setOptions] = useState({
    makes: [],
    bodyTypes: [],
    fuelTypes: [],
    transmissions: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await axios.get(`${VITE_API_URL}/vehicles/filters`)
        // Expected response shape: { makes: string[], bodyTypes: string[], fuelTypes: string[], transmissions: string[] }
        const data = res.data
        setOptions({
          makes: Array.isArray(data.makes) ? data.makes : [],
          bodyTypes: Array.isArray(data.bodyTypes) ? data.bodyTypes : [],
          fuelTypes: Array.isArray(data.fuelTypes) ? data.fuelTypes : [],
          transmissions: Array.isArray(data.transmissions)
            ? data.transmissions
            : []
        })
      } catch (err) {
        console.error('Failed to fetch filter options:', err)
        // Fallback to empty arrays
      } finally {
        setLoading(false)
      }
    }
    fetchFilters()
  }, [])

  const handleChange = (field, value) => {
    onChange(field, value)
  }

  // Convert string arrays to { label, value } objects with an "Any" default
  const makeOptions = [
    { label: 'Any', value: '' },
    ...options.makes.map((m) => ({ label: m, value: m }))
  ]
  const bodyTypeOptions = [
    { label: 'Any', value: '' },
    ...options.bodyTypes.map((b) => ({ label: b, value: b }))
  ]
  const fuelOptions = [
    { label: 'Any', value: '' },
    ...options.fuelTypes.map((f) => ({ label: f, value: f }))
  ]
  const transmissionOptions = [
    { label: 'Any', value: '' },
    ...options.transmissions.map((t) => ({ label: t, value: t }))
  ]

  return (
    <aside className="card-surface space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-brand-secondary">Filters</h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={onReset}
          className="text-xs text-brand-muted hover:text-brand-primary"
        >
          Reset
        </Button>
      </div>

      {loading ? (
        <p className="text-xs text-brand-muted">Loading filters...</p>
      ) : (
        <>
          <Select
            id="filter-make"
            label="Make"
            options={makeOptions}
            value={filters.make}
            onChange={(e) => handleChange('make', e.target.value)}
          />

          <Input
            id="filter-model"
            label="Model keyword"
            placeholder="e.g. Camry, RAV4"
            value={filters.model}
            onChange={(e) => handleChange('model', e.target.value)}
          />

          {/* ✅ Fixed: Price inputs now use correct state keys */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="filter-priceMin"
              label="Price Min (USD)"
              type="number"
              min="0"
              placeholder="Min"
              value={filters.priceMin}
              onChange={(e) => handleChange('priceMin', e.target.value)}
            />
            <Input
              id="filter-priceMax"
              label="Price Max (USD)"
              type="number"
              min="0"
              placeholder="Max"
              value={filters.priceMax} // ✅ Fixed: Changed from filters.maxPrice
              onChange={(e) => handleChange('priceMax', e.target.value)} // ✅ Fixed: Changed from 'maxPrice'
            />
          </div>

          {/* ✅ Fixed: Year selects now use proper options */}
          <div className="grid grid-cols-2 gap-3">
            <Select
              id="filter-yearMin"
              label="Year From"
              options={yearFromOptions} // ✅ Fixed: Using yearFromOptions
              value={filters.yearMin}
              onChange={(e) => handleChange('yearMin', e.target.value)}
            />
            <Select
              id="filter-yearMax"
              label="Year To"
              options={yearToOptions} // ✅ Fixed: Using yearToOptions instead of yearOptions
              value={filters.yearMax}
              onChange={(e) => handleChange('yearMax', e.target.value)}
            />
          </div>

          <Select
            id="filter-bodyType"
            label="Body Type"
            options={bodyTypeOptions}
            value={filters.bodyType}
            onChange={(e) => handleChange('bodyType', e.target.value)}
          />

          <Select
            id="filter-fuel"
            label="Fuel Type"
            options={fuelOptions}
            value={filters.fuelType}
            onChange={(e) => handleChange('fuelType', e.target.value)}
          />

          <Select
            id="filter-transmission"
            label="Transmission"
            options={transmissionOptions}
            value={filters.transmission}
            onChange={(e) => handleChange('transmission', e.target.value)}
          />

          <Input
            id="filter-maxMileage"
            label="Max Mileage"
            type="number"
            min="0"
            placeholder="e.g. 60000"
            value={filters.maxMileage}
            onChange={(e) => handleChange('maxMileage', e.target.value)}
          />
        </>
      )}
    </aside>
  )
}

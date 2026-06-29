// client/src/components/vehicles/VehicleFilters.jsx
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'

const makeOptions = [
  { label: 'Any', value: '' },
  { label: 'Toyota', value: 'Toyota' },
  { label: 'Honda', value: 'Honda' },
  { label: 'Chevrolet', value: 'Chevrolet' },
  { label: 'Ford', value: 'Ford' }
]

const bodyTypeOptions = [
  { label: 'Any', value: '' },
  { label: 'Sedan', value: 'Sedan' },
  { label: 'SUV', value: 'SUV' },
  { label: 'Truck', value: 'Truck' },
  { label: 'Coupe', value: 'Coupe' }
]

const fuelOptions = [
  { label: 'Any', value: '' },
  { label: 'Gasoline', value: 'Gasoline' },
  { label: 'Diesel', value: 'Diesel' },
  { label: 'Hybrid', value: 'Hybrid' },
  { label: 'Electric', value: 'Electric' }
]

const transmissionOptions = [
  { label: 'Any', value: '' },
  { label: 'Automatic', value: 'Automatic' },
  { label: 'Manual', value: 'Manual' }
]

const yearOptions = [
  { label: 'Any', value: '' },
  { label: '2024 & Newer', value: '2024' },
  { label: '2022+', value: '2022' },
  { label: '2020+', value: '2020' },
  { label: '2018+', value: '2018' }
]

export function VehicleFilters({ filters, onChange, onReset }) {
  const handleChange = (field, value) => {
    onChange(field, value)
  }

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

      {/* Price range – added from old version */}
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
          id="filter-maxPrice"
          label="Price Max (USD)"
          type="number"
          min="0"
          placeholder="Max"
          value={filters.maxPrice}
          onChange={(e) => handleChange('maxPrice', e.target.value)}
        />
      </div>

      {/* Year range – added from old version */}
      <div className="grid grid-cols-2 gap-3">
        <Select
          id="filter-yearMin"
          label="Year From"
          options={yearOptions}
          value={filters.minYear}
          onChange={(e) => handleChange('minYear', e.target.value)}
        />
        <Select
          id="filter-yearMax"
          label="Year To"
          options={yearOptions}
          value={filters.maxYear}
          onChange={(e) => handleChange('maxYear', e.target.value)}
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
    </aside>
  )
}

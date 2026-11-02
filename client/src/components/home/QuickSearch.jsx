import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

const yearOptions = [
  { label: 'Any Year', value: '' },
  { label: '2024+', value: '2024' },
  { label: '2022+', value: '2022' },
  { label: '2020+', value: '2020' },
  { label: '2018+', value: '2018' }
]

// Values map to the `condition` query param understood by /inventory
const CONDITION_TABS = [
  { label: 'All Vehicles', value: '' },
  { label: 'New', value: 'new' },
  { label: 'Used', value: 'used' }
]

export function QuickSearch({ filterOptions }) {
  const navigate = useNavigate()

  const [condition, setCondition] = useState('')
  const [filters, setFilters] = useState({
    make: '',
    bodyType: '',
    maxPrice: '',
    minYear: ''
  })

  const makeOptions = [
    { label: 'Any Make', value: '' },
    ...(filterOptions.makes || []).map((m) => ({ label: m, value: m }))
  ]

  const bodyTypeOptions = [
    { label: 'Any Type', value: '' },
    ...(filterOptions.bodyTypes || []).map((b) => ({ label: b, value: b }))
  ]

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleQuickSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (condition) params.set('condition', condition)
    if (filters.make) params.set('make', filters.make)
    if (filters.bodyType) params.set('bodyType', filters.bodyType)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.minYear) params.set('minYear', filters.minYear)
    navigate(`/inventory?${params.toString()}`)
  }

  return (
    <div className="container relative z-20 -mt-24 sm:-mt-28">
      <div className="mx-auto max-w-5xl">
        {/* Condition tabs */}
        <div
          role="tablist"
          aria-label="Vehicle condition"
          className="flex gap-1.5 pl-4 sm:pl-6"
        >
          {CONDITION_TABS.map((tab) => {
            const active = condition === tab.value
            return (
              <button
                key={tab.label}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCondition(tab.value)}
                className={`rounded-t-xl px-4 py-2.5 text-xs font-semibold transition-colors sm:px-5 sm:text-sm ${
                  active
                    ? 'bg-white text-brand-primary shadow-[0_-6px_16px_-8px_rgba(0,0,0,0.3)]'
                    : 'bg-white/10 text-white backdrop-blur hover:bg-white/20'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <form
          onSubmit={handleQuickSearch}
          className="rounded-2xl rounded-tl-none bg-white p-5 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.35)] sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr)),auto]">
            <Select
              id="qs-make"
              label="Make"
              options={makeOptions}
              value={filters.make}
              onChange={(e) => handleFilterChange('make', e.target.value)}
              className="w-full"
            />
            <Select
              id="qs-bodyType"
              label="Body Type"
              options={bodyTypeOptions}
              value={filters.bodyType}
              onChange={(e) => handleFilterChange('bodyType', e.target.value)}
              className="w-full"
            />
            <Input
              id="qs-maxPrice"
              label="Max Price (USD)"
              type="number"
              min="0"
              placeholder="e.g. 30000"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-full"
            />
            <Select
              id="qs-year"
              label="Min Year"
              options={yearOptions}
              value={filters.minYear}
              onChange={(e) => handleFilterChange('minYear', e.target.value)}
              className="w-full"
            />
            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-ink-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-primary lg:w-auto"
              >
                <Search className="h-4 w-4" />
                Search Now
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

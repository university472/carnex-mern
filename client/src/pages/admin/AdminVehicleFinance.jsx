// client/src/pages/admin/AdminVehicleFinance.jsx
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { CollapsibleSection } from '../../components/admin/CollapsibleSection'
import { useToast } from '../../hooks/useToast'
import { formatPrice, formatDate } from '../../utils/formatters'

const acquisitionSourceOptions = [
  { label: 'Auction', value: 'auction' },
  { label: 'Trade-In', value: 'trade-in' },
  { label: 'Wholesale', value: 'wholesale' },
  { label: 'Private Party', value: 'private-party' },
  { label: 'Other', value: 'other' }
]

const initialForm = {
  purchasePrice: '',
  purchaseDate: '',
  acquisitionSource: '',
  acquisitionTax: '',
  acquisitionFees: '',
  transportationCost: '',
  auctionFees: '',
  otherAcquisitionCost: '',
  reconditioningCost: '',
  otherPrepCost: '',
  customerSalesTax: '',
  registrationFee: '',
  titleFee: '',
  discountGiven: '',
  otherSaleCost: '',
  taxRemittedByCompany: '',
  otherTaxesFees: '',
  notes: ''
}

function n(value) {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

function computeTotals(form, soldPrice) {
  const totalAcquisitionCost =
    n(form.purchasePrice) +
    n(form.acquisitionTax) +
    n(form.acquisitionFees) +
    n(form.transportationCost) +
    n(form.auctionFees) +
    n(form.otherAcquisitionCost)

  const totalReconCost = n(form.reconditioningCost) + n(form.otherPrepCost)
  const totalInvestment = totalAcquisitionCost + totalReconCost
  const grossSaleAmount = n(soldPrice)

  const totalExpenses =
    n(form.registrationFee) +
    n(form.titleFee) +
    n(form.discountGiven) +
    n(form.otherSaleCost)

  const companyTaxCost = n(form.taxRemittedByCompany) + n(form.otherTaxesFees)
  const totalTaxes = n(form.customerSalesTax) + companyTaxCost
  const netCost = totalInvestment + totalExpenses + companyTaxCost
  const grossProfit = grossSaleAmount - totalInvestment
  const netProfit = grossSaleAmount - netCost

  return {
    totalAcquisitionCost,
    totalReconCost,
    totalInvestment,
    grossSaleAmount,
    totalExpenses,
    totalTaxes,
    netCost,
    grossProfit,
    netProfit
  }
}

function SummaryTile({ label, value, emphasis }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-brand-muted">{label}</p>
      <p
        className={
          emphasis
            ? `text-lg font-semibold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`
            : 'text-sm font-medium text-brand-secondary'
        }
      >
        {formatPrice(value)}
      </p>
    </div>
  )
}

export function AdminVehicleFinance() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [vehicle, setVehicle] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setFetching(true)
    try {
      const { data } = await api.get(`/admin/vehicles/${id}`)
      const v = data?.data || data
      setVehicle(v)
      const f = v.finance || {}
      setForm({
        purchasePrice: f.purchasePrice ?? '',
        purchaseDate: f.purchaseDate ? f.purchaseDate.slice(0, 10) : '',
        acquisitionSource: f.acquisitionSource || '',
        acquisitionTax: f.acquisitionTax ?? '',
        acquisitionFees: f.acquisitionFees ?? '',
        transportationCost: f.transportationCost ?? '',
        auctionFees: f.auctionFees ?? '',
        otherAcquisitionCost: f.otherAcquisitionCost ?? '',
        reconditioningCost: f.reconditioningCost ?? '',
        otherPrepCost: f.otherPrepCost ?? '',
        customerSalesTax: f.customerSalesTax ?? '',
        registrationFee: f.registrationFee ?? '',
        titleFee: f.titleFee ?? '',
        discountGiven: f.discountGiven ?? '',
        otherSaleCost: f.otherSaleCost ?? '',
        taxRemittedByCompany: f.taxRemittedByCompany ?? '',
        otherTaxesFees: f.otherTaxesFees ?? '',
        notes: f.notes || ''
      })
    } catch {
      toast.error('Failed to load vehicle')
      navigate('/dealer-panel/vehicles')
    } finally {
      setFetching(false)
    }
  }, [id, navigate, toast])

  useEffect(() => {
    load()
  }, [load])

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const liveTotals = useMemo(
    () => computeTotals(form, vehicle?.soldPrice),
    [form, vehicle?.soldPrice]
  )

  const savedTotals = vehicle?.finance?.totals

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.patch(`/admin/vehicles/${id}/finance`, form)
      const updated = data?.data || data
      setVehicle(updated)
      toast.success('Finance record saved')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save finance record')
    } finally {
      setSaving(false)
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
          Vehicle Finance — {vehicle?.year} {vehicle?.make} {vehicle?.model}
        </h1>
        <p className="text-body-muted text-sm">
          VIN {vehicle?.vin || '—'} · Stock #{vehicle?.stockNumber || '—'} · Status{' '}
          {vehicle?.status} · Listing price {formatPrice(vehicle?.price)}
          {vehicle?.status === 'sold' && (
            <>
              {' '}
              · Sold {formatPrice(vehicle?.soldPrice)} on{' '}
              {formatDate(vehicle?.soldAt)}
            </>
          )}
        </p>
        <Link
          to={`/dealer-panel/vehicles/${id}/edit`}
          className="text-xs text-brand-primary hover:underline"
        >
          Edit vehicle listing details
        </Link>
      </header>

      {/* Profit summary */}
      <div className="card-surface p-5 space-y-4">
        <h2 className="text-sm font-semibold text-brand-secondary">
          Financial Summary {saving ? '' : savedTotals ? '(saved)' : '(unsaved preview)'}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <SummaryTile label="Total Investment/Cost" value={liveTotals.totalInvestment} />
          <SummaryTile label="Gross Sale Amount" value={liveTotals.grossSaleAmount} />
          <SummaryTile label="Total Expenses" value={liveTotals.totalExpenses} />
          <SummaryTile label="Total Taxes" value={liveTotals.totalTaxes} />
          <SummaryTile label="Net Cost" value={liveTotals.netCost} />
          <SummaryTile label="Gross Profit" value={liveTotals.grossProfit} emphasis />
          <SummaryTile label="Net Profit" value={liveTotals.netProfit} emphasis />
        </div>
        <p className="text-xs text-brand-muted">
          Sale price and sale date come from "Complete Sale" on the Vehicles list, not
          this form. Figures above update live as you type; save to persist them.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <CollapsibleSection title="Acquisition Costs" defaultOpen>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Purchase Price"
              type="number"
              value={form.purchasePrice}
              onChange={(e) => updateField('purchasePrice', e.target.value)}
            />
            <Input
              label="Purchase Date"
              type="date"
              value={form.purchaseDate}
              onChange={(e) => updateField('purchaseDate', e.target.value)}
            />
            <Select
              label="Acquisition Source"
              value={form.acquisitionSource}
              options={acquisitionSourceOptions}
              onChange={(e) => updateField('acquisitionSource', e.target.value)}
            />
            <Input
              label="Acquisition Tax"
              type="number"
              value={form.acquisitionTax}
              onChange={(e) => updateField('acquisitionTax', e.target.value)}
            />
            <Input
              label="Acquisition Fees"
              type="number"
              value={form.acquisitionFees}
              onChange={(e) => updateField('acquisitionFees', e.target.value)}
            />
            <Input
              label="Transportation Cost"
              type="number"
              value={form.transportationCost}
              onChange={(e) => updateField('transportationCost', e.target.value)}
            />
            <Input
              label="Auction Fees"
              type="number"
              value={form.auctionFees}
              onChange={(e) => updateField('auctionFees', e.target.value)}
            />
            <Input
              label="Other Acquisition Cost"
              type="number"
              value={form.otherAcquisitionCost}
              onChange={(e) => updateField('otherAcquisitionCost', e.target.value)}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Reconditioning & Prep">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Reconditioning Cost"
              type="number"
              value={form.reconditioningCost}
              onChange={(e) => updateField('reconditioningCost', e.target.value)}
            />
            <Input
              label="Other Prep Cost"
              type="number"
              value={form.otherPrepCost}
              onChange={(e) => updateField('otherPrepCost', e.target.value)}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Sale Transaction">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Customer-Paid Sales Tax"
              type="number"
              value={form.customerSalesTax}
              onChange={(e) => updateField('customerSalesTax', e.target.value)}
            />
            <Input
              label="Registration Fee"
              type="number"
              value={form.registrationFee}
              onChange={(e) => updateField('registrationFee', e.target.value)}
            />
            <Input
              label="Title Fee"
              type="number"
              value={form.titleFee}
              onChange={(e) => updateField('titleFee', e.target.value)}
            />
            <Input
              label="Discount Given"
              type="number"
              value={form.discountGiven}
              onChange={(e) => updateField('discountGiven', e.target.value)}
            />
            <Input
              label="Other Sale Cost"
              type="number"
              value={form.otherSaleCost}
              onChange={(e) => updateField('otherSaleCost', e.target.value)}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Company-Remitted Tax & Fees">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Tax Remitted by Company"
              type="number"
              value={form.taxRemittedByCompany}
              onChange={(e) => updateField('taxRemittedByCompany', e.target.value)}
              helperText="State/local tax or fees the dealership pays that are not recovered from the customer."
            />
            <Input
              label="Other Taxes / Fees"
              type="number"
              value={form.otherTaxesFees}
              onChange={(e) => updateField('otherTaxesFees', e.target.value)}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Notes">
          <Input
            label="Finance Notes"
            textarea
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            helperText="Internal audit-trail notes for this vehicle's financial record."
          />
        </CollapsibleSection>

        <div className="flex gap-3 justify-end pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/dealer-panel/vehicles')}
            disabled={saving}
          >
            Back to Vehicles
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save finance record'}
          </Button>
        </div>
      </form>
    </section>
  )
}

// client/src/pages/admin/AdminVehicleFinance.jsx
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { CollapsibleSection } from '../../components/admin/CollapsibleSection'
import { useToast } from '../../hooks/useToast'
import { formatPrice, formatDate } from '../../utils/formatters'

const initialForm = {
  // Cost Price — stored under the original `purchasePrice` key
  purchasePrice: '',
  listedFor: '',
  listedAmount: '',
  minimumPrice: '',
  soldFor: '',
  collectedAmount: '',
  dmvFeePaid: '',
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

// Mirrors server/src/utils/vehicleFinance.js — keep the two in sync.
function computeTotals(form, soldPrice) {
  const costPrice = n(form.purchasePrice)
  const totalAcquisitionCost = costPrice
  const totalReconCost = n(form.reconditioningCost) + n(form.otherPrepCost)
  const totalInvestment = totalAcquisitionCost + totalReconCost
  const grossSaleAmount = n(form.soldFor) > 0 ? n(form.soldFor) : n(soldPrice)

  const collectedAmount = n(form.collectedAmount)
  const dmvFeePaid = n(form.dmvFeePaid)
  const amountAfterFee = collectedAmount - dmvFeePaid
  const profit = amountAfterFee - costPrice

  const totalExpenses =
    dmvFeePaid +
    n(form.registrationFee) +
    n(form.titleFee) +
    n(form.discountGiven) +
    n(form.otherSaleCost)

  const companyTaxCost = n(form.taxRemittedByCompany) + n(form.otherTaxesFees)
  const totalTaxes = n(form.customerSalesTax) + companyTaxCost
  const netCost = totalInvestment + totalExpenses + companyTaxCost
  const grossProfit = profit
  const netProfit = collectedAmount - netCost

  return {
    totalAcquisitionCost,
    totalReconCost,
    totalInvestment,
    grossSaleAmount,
    amountAfterFee,
    profit,
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
        // Pre-fill from the listing / completed sale until set here
        listedFor: f.listedFor || v.price || '',
        listedAmount: f.listedAmount ?? '',
        minimumPrice: f.minimumPrice ?? '',
        soldFor: f.soldFor || v.soldPrice || '',
        collectedAmount: f.collectedAmount ?? '',
        dmvFeePaid: f.dmvFeePaid ?? '',
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
          <SummaryTile label="Cost Price" value={n(form.purchasePrice)} />
          <SummaryTile label="Sold For" value={liveTotals.grossSaleAmount} />
          <SummaryTile label="Collected from Customer" value={n(form.collectedAmount)} />
          <SummaryTile label="DMV Fee Paid" value={n(form.dmvFeePaid)} />
          <SummaryTile label="Amount After Fee" value={liveTotals.amountAfterFee} />
          <SummaryTile label="Profit" value={liveTotals.profit} emphasis />
          <SummaryTile label="Total Investment/Cost" value={liveTotals.totalInvestment} />
          <SummaryTile label="Total Expenses" value={liveTotals.totalExpenses} />
          <SummaryTile label="Total Taxes" value={liveTotals.totalTaxes} />
          <SummaryTile label="Net Cost" value={liveTotals.netCost} />
          <SummaryTile label="Net Profit" value={liveTotals.netProfit} emphasis />
        </div>
        <p className="text-xs text-brand-muted">
          Profit = Amount After Fee − Cost Price. Net Profit additionally deducts
          reconditioning, other sale costs and company-paid taxes. Figures above update
          live as you type; save to persist them.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <CollapsibleSection title="Acquisition Costs" defaultOpen>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Cost Price"
              type="number"
              value={form.purchasePrice}
              onChange={(e) => updateField('purchasePrice', e.target.value)}
              helperText="How much the vehicle cost us."
            />
            <Input
              label="Listed For"
              type="number"
              value={form.listedFor}
              onChange={(e) => updateField('listedFor', e.target.value)}
              helperText="The price at which we listed the vehicle."
            />
            <Input
              label="Listed"
              type="number"
              value={form.listedAmount}
              onChange={(e) => updateField('listedAmount', e.target.value)}
              helperText="The amount for which we listed the vehicle."
            />
            <Input
              label="Minimum Price"
              type="number"
              value={form.minimumPrice}
              onChange={(e) => updateField('minimumPrice', e.target.value)}
              helperText="The lowest price we are willing to sell at."
            />
            <Input
              label="Sold For"
              type="number"
              value={form.soldFor}
              onChange={(e) => updateField('soldFor', e.target.value)}
              helperText="The actual price the vehicle sold for."
            />
            <Input
              label="Collected Amount from Customer"
              type="number"
              value={form.collectedAmount}
              onChange={(e) => updateField('collectedAmount', e.target.value)}
            />
            <Input
              label="DMV Fee Paid"
              type="number"
              value={form.dmvFeePaid}
              onChange={(e) => updateField('dmvFeePaid', e.target.value)}
            />
            <Input
              label="Amount After Fee"
              type="number"
              value={liveTotals.amountAfterFee}
              readOnly
              disabled
              helperText="Collected Amount − DMV Fee Paid"
            />
            <Input
              label="Profit"
              type="number"
              value={liveTotals.profit}
              readOnly
              disabled
              helperText="Amount After Fee − Cost Price"
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

// client/src/pages/admin/AdminTradeInLeads.jsx
import { LeadListPage } from './LeadListPage'

const extraColumns = [
  {
    key: 'vehicle',
    label: 'Trade-In Vehicle',
    render: (lead) =>
      lead.year && lead.make && lead.model
        ? `${lead.year} ${lead.make} ${lead.model}`
        : '—'
  },
  {
    key: 'mileage',
    label: 'Mileage',
    render: (lead) =>
      lead.mileage ? Number(lead.mileage).toLocaleString('en-US') + ' mi' : '—'
  },
  {
    key: 'condition',
    label: 'Condition',
    render: (lead) => lead.condition || '—'
  }
]

export function AdminTradeInLeads() {
  return (
    <LeadListPage
      title="Trade-In Leads"
      description="Customers who submitted a trade-in valuation request."
      leadType="tradeIn"
      detailRoute="/dealer-panel/trade-in-leads"
      extraColumns={extraColumns}
    />
  )
}

// client/src/pages/admin/AdminSourcingLeads.jsx
import { LeadListPage } from './LeadListPage'
import { formatPrice } from '../../utils/formatters'

const extraColumns = [
  {
    key: 'desiredMake',
    label: 'Make / Model',
    render: (lead) =>
      [lead.desiredMake, lead.desiredModel].filter(Boolean).join(' ') || '—'
  },
  {
    key: 'desiredBudgetMax',
    label: 'Max Budget',
    render: (lead) =>
      lead.desiredBudgetMax ? formatPrice(lead.desiredBudgetMax) : '—'
  },
  {
    key: 'desiredBodyType',
    label: 'Body Type',
    render: (lead) => lead.desiredBodyType || '—'
  }
]

export function AdminSourcingLeads() {
  return (
    <LeadListPage
      title="Sourcing Leads"
      description="Customers who submitted a vehicle sourcing request."
      leadType="sourcing"
      detailRoute="/admin/sourcing-leads"
      extraColumns={extraColumns}
    />
  )
}

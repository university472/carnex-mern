// client/src/pages/admin/AdminFinanceLeads.jsx
import { LeadListPage } from './LeadListPage'
import { formatPrice } from '../../utils/formatters'

const extraColumns = [
  {
    key: 'vehicleTitle',
    label: 'Vehicle',
    render: (lead) => lead.vehicleTitle || '—'
  },
  {
    key: 'desiredAmount',
    label: 'Loan Amount',
    render: (lead) =>
      lead.desiredAmount ? formatPrice(lead.desiredAmount) : '—'
  },
  {
    key: 'employmentStatus',
    label: 'Employment',
    render: (lead) => lead.employmentStatus || '—'
  }
]

export function AdminFinanceLeads() {
  return (
    <LeadListPage
      title="Financing Leads"
      description="Customers who submitted a financing application."
      leadType="finance"
      detailRoute="/dealer-panel/finance-leads"
      extraColumns={extraColumns}
    />
  )
}

// client/src/pages/admin/AdminTestDriveLeads.jsx
import { LeadListPage } from './LeadListPage'
import { formatDate } from '../../utils/formatters'

const extraColumns = [
  {
    key: 'vehicleTitle',
    label: 'Vehicle',
    render: (lead) => lead.vehicleTitle || '—'
  },
  {
    key: 'preferredDate',
    label: 'Preferred Date',
    render: (lead) => formatDate(lead.preferredDate)
  },
  {
    key: 'preferredTimeSlot',
    label: 'Time',
    render: (lead) => lead.preferredTimeSlot || '—'
  }
]

export function AdminTestDriveLeads() {
  return (
    <LeadListPage
      title="Test Drive Leads"
      description="Customers who requested to schedule a test drive."
      leadType="testDrive"
      detailRoute="/admin/test-drive-leads"
      extraColumns={extraColumns}
    />
  )
}

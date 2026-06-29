// client/src/pages/admin/AdminContactLeads.jsx
import { LeadListPage } from './LeadListPage'

const extraColumns = [
  {
    key: 'topic',
    label: 'Topic',
    render: (lead) => lead.topic || '—'
  },
  {
    key: 'subject',
    label: 'Subject',
    render: (lead) =>
      lead.subject
        ? lead.subject.length > 40
          ? lead.subject.slice(0, 40) + '…'
          : lead.subject
        : '—'
  }
]

export function AdminContactLeads() {
  return (
    <LeadListPage
      title="Contact Messages"
      description="Messages submitted through the public contact form."
      leadType="contact"
      detailRoute="/admin/contact-leads"
      extraColumns={extraColumns}
    />
  )
}

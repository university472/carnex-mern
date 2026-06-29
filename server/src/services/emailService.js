// server/src/services/emailService.js
const { sendMail } = require('../config/nodemailer')

/**
 * Get the dealership notification email from Settings or env fallback.
 * Called lazily so DB connection is guaranteed to exist.
 */
async function getDealershipEmail() {
  try {
    const Settings = require('../models/Settings')
    const settings = await Settings.findOne().lean()
    if (settings?.notificationEmails?.length) {
      return settings.notificationEmails
    }
    if (settings?.email) {
      return [settings.email]
    }
  } catch {
    // Settings model may not be seeded yet
  }
  // Final fallback to env
  return [process.env.SMTP_USER || process.env.DEALERSHIP_EMAIL].filter(Boolean)
}

/**
 * Send notification email to dealership.
 * Errors are caught and logged — never thrown to the caller.
 *
 * @param {string} subject
 * @param {string} html
 */
async function notifyDealership(subject, html) {
  try {
    const recipients = await getDealershipEmail()
    if (!recipients.length) {
      console.warn(
        '[emailService] No dealership email configured — skipping notification'
      )
      return
    }
    await sendMail({ to: recipients.join(', '), subject, html })
    console.log(
      `[emailService] Notification sent: "${subject}" → ${recipients.join(', ')}`
    )
  } catch (err) {
    // Log but never crash the request
    console.error('[emailService] Failed to send notification:', err.message)
  }
}

// ── Shared HTML shell ─────────────────────────────────────────
function emailShell(title, accentColor = '#DC2626', bodyHtml) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#f3f4f6;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:10px;
                      overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:${accentColor};padding:20px 28px;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">
                Carnex Auto Sales
              </p>
              <p style="margin:4px 0 0;color:#fca5a5;font-size:12px;">
                Admin Notification
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px;">
              <h2 style="margin:0 0 16px;font-size:17px;color:#111827;">
                ${title}
              </h2>
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:16px 28px;
                       border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">
                Carnex Auto Sales LLC &bull;
                8193 Elder Creek Road, Sacramento, CA 95824<br/>
                This is an automated notification. Do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/**
 * Render a two-column key/value field table.
 * @param {Array<[string, any]>} fields
 */
function fieldTable(fields) {
  const rows = fields
    .filter(([, val]) => val !== undefined && val !== null && val !== '')
    .map(
      ([label, val]) => `
      <tr>
        <td style="padding:7px 10px 7px 0;color:#6b7280;
                   font-size:13px;white-space:nowrap;vertical-align:top;
                   width:40%;">
          ${label}
        </td>
        <td style="padding:7px 0;color:#111827;font-size:13px;
                   font-weight:500;vertical-align:top;">
          ${String(val)}
        </td>
      </tr>`
    )
    .join('')

  return `
  <table width="100%" cellpadding="0" cellspacing="0"
         style="border-collapse:collapse;margin-top:8px;">
    ${rows}
  </table>`
}

/**
 * Highlight badge — used for lead type label in emails.
 */
function badge(text, color = '#DC2626') {
  return `<span style="display:inline-block;padding:2px 10px;
                        background:${color}15;border:1px solid ${color}40;
                        border-radius:99px;font-size:11px;font-weight:600;
                        color:${color};margin-bottom:14px;">${text}</span>`
}

function divider() {
  return `<hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0;"/>`
}

function submittedAt(date) {
  return `<p style="margin:14px 0 0;color:#9ca3af;font-size:11px;">
    Submitted: ${new Date(date || Date.now()).toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      dateStyle: 'full',
      timeStyle: 'short'
    })} PT
  </p>`
}

// ─────────────────────────────────────────────────────────────
// ── Lead-specific email builders ─────────────────────────────
// ─────────────────────────────────────────────────────────────

/**
 * Contact form notification
 */
function buildContactEmail(lead) {
  const body = `
    ${badge('New Contact Message')}
    ${fieldTable([
      ['Name', lead.name],
      ['Email', lead.email],
      ['Phone', lead.phone],
      ['Topic', lead.topic],
      ['Subject', lead.subject]
    ])}
    ${divider()}
    <p style="color:#374151;font-size:13px;line-height:1.6;margin:0;">
      <strong>Message:</strong><br/>
      ${(lead.message || '').replace(/\n/g, '<br/>')}
    </p>
    ${submittedAt(lead.createdAt)}
  `
  return {
    subject: `[Carnex] New Contact Message — ${lead.name || 'Unknown'}`,
    html: emailShell('New Contact Message', '#DC2626', body)
  }
}

/**
 * Finance application notification
 */
function buildFinanceEmail(lead) {
  const body = `
    ${badge('New Financing Application', '#1d4ed8')}
    <p style="margin:0 0 12px;font-size:13px;color:#374151;">
      A customer has submitted a financing application and is interested in
      purchasing a vehicle.
    </p>
    ${fieldTable([
      ['Applicant', `${lead.firstName || ''} ${lead.lastName || ''}`.trim()],
      ['Email', lead.email],
      ['Phone', lead.phone],
      ['City / State', [lead.city, lead.state].filter(Boolean).join(', ')],
      ['Employment', lead.employmentStatus],
      [
        'Monthly Income',
        lead.monthlyIncome
          ? `$${Number(lead.monthlyIncome).toLocaleString('en-US')}`
          : ''
      ],
      ['Vehicle Interest', lead.vehicleTitle || lead.vehicleId || ''],
      [
        'Vehicle Price',
        lead.vehiclePrice
          ? `$${Number(lead.vehiclePrice).toLocaleString('en-US')}`
          : ''
      ],
      [
        'Down Payment',
        lead.downPayment
          ? `$${Number(lead.downPayment).toLocaleString('en-US')}`
          : ''
      ],
      ['Loan Term', lead.termMonths ? `${lead.termMonths} months` : '']
    ])}
    ${submittedAt(lead.createdAt)}
  `
  return {
    subject:
      `[Carnex] New Financing Application — ${lead.firstName || ''} ${lead.lastName || ''}`.trim(),
    html: emailShell('New Financing Application', '#1d4ed8', body)
  }
}

/**
 * Trade-in request notification
 */
function buildTradeInEmail(lead) {
  const body = `
    ${badge('New Trade-In Request', '#d97706')}
    <p style="margin:0 0 12px;font-size:13px;color:#374151;">
      A customer wants to trade in their vehicle.
    </p>
    ${fieldTable([
      ['Customer', lead.name],
      ['Email', lead.email],
      ['Phone', lead.phone]
    ])}
    ${divider()}
    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#111827;">
      Vehicle Being Traded
    </p>
    ${fieldTable([
      ['Year', lead.year],
      ['Make', lead.make],
      ['Model', lead.model],
      [
        'Mileage',
        lead.mileage
          ? `${Number(lead.mileage).toLocaleString('en-US')} miles`
          : ''
      ],
      ['VIN', lead.vin],
      ['Condition', lead.condition],
      ['Notes', lead.notes]
    ])}
    ${submittedAt(lead.createdAt)}
  `
  return {
    subject:
      `[Carnex] New Trade-In Request — ${lead.year || ''} ${lead.make || ''} ${lead.model || ''}`.trim(),
    html: emailShell('New Trade-In Request', '#d97706', body)
  }
}

/**
 * Test drive request notification
 */
function buildTestDriveEmail(lead) {
  const preferredDate = lead.preferredDate
    ? new Date(lead.preferredDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '—'

  const body = `
    ${badge('New Test Drive Request', '#7c3aed')}
    <p style="margin:0 0 12px;font-size:13px;color:#374151;">
      A customer has requested to schedule a test drive.
    </p>
    ${fieldTable([
      ['Customer', lead.name],
      ['Email', lead.email],
      ['Phone', lead.phone],
      ['Vehicle', lead.vehicleTitle || lead.vehicleId || ''],
      ['Preferred Date', preferredDate],
      ['Preferred Time', lead.preferredTimeSlot || ''],
      ['Notes', lead.notes || '']
    ])}
    ${submittedAt(lead.createdAt)}
  `
  return {
    subject: `[Carnex] New Test Drive Request — ${lead.name || 'Unknown'} on ${preferredDate}`,
    html: emailShell('New Test Drive Request', '#7c3aed', body)
  }
}

/**
 * Sourcing request notification
 */
function buildSourcingEmail(lead) {
  const budget = lead.desiredBudgetMax
    ? `$${Number(lead.desiredBudgetMax).toLocaleString('en-US')}`
    : '—'

  const yearRange =
    lead.desiredYearMin && lead.desiredYearMax
      ? `${lead.desiredYearMin} – ${lead.desiredYearMax}`
      : lead.desiredYearMin || lead.desiredYearMax || '—'

  const body = `
    ${badge('New Vehicle Sourcing Request', '#059669')}
    <p style="margin:0 0 12px;font-size:13px;color:#374151;">
      A customer wants us to source a specific vehicle for them.
    </p>
    ${fieldTable([
      ['Customer', lead.name],
      ['Email', lead.email],
      ['Phone', lead.phone]
    ])}
    ${divider()}
    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#111827;">
      Vehicle Requirements
    </p>
    ${fieldTable([
      ['Make', lead.desiredMake || '—'],
      ['Model', lead.desiredModel || '—'],
      ['Body Type', lead.desiredBodyType || '—'],
      ['Year Range', yearRange],
      ['Max Budget', budget],
      ['Must Haves', lead.mustHaveFeatures || '—']
    ])}
    ${submittedAt(lead.createdAt)}
  `
  return {
    subject:
      `[Carnex] New Sourcing Request — ${lead.desiredMake || ''} ${lead.desiredModel || ''}`.trim() ||
      'Vehicle Sourcing',
    html: emailShell('New Vehicle Sourcing Request', '#059669', body)
  }
}

// ─────────────────────────────────────────────────────────────
// ── Public notification functions ────────────────────────────
// ─────────────────────────────────────────────────────────────

async function sendContactNotification(lead) {
  const { subject, html } = buildContactEmail(lead)
  await notifyDealership(subject, html)
}

async function sendFinanceNotification(lead) {
  const { subject, html } = buildFinanceEmail(lead)
  await notifyDealership(subject, html)
}

async function sendTradeInNotification(lead) {
  const { subject, html } = buildTradeInEmail(lead)
  await notifyDealership(subject, html)
}

async function sendTestDriveNotification(lead) {
  const { subject, html } = buildTestDriveEmail(lead)
  await notifyDealership(subject, html)
}

async function sendSourcingNotification(lead) {
  const { subject, html } = buildSourcingEmail(lead)
  await notifyDealership(subject, html)
}

module.exports = {
  sendContactNotification,
  sendFinanceNotification,
  sendTradeInNotification,
  sendTestDriveNotification,
  sendSourcingNotification
}

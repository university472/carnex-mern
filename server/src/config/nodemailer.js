// server/src/config/nodemailer.js
const nodemailer = require('nodemailer')
function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const sendMail = async ({ to, subject, html, text }) => {
  const from =
    process.env.SMTP_FROM || `Carnex Auto Sales <${process.env.SMTP_USER}>`

  await transporter.sendMail({ from, to, subject, html, text })
}

/**
 * Send a styled OTP email
 */
const sendOTPEmail = async ({ to, name, code, purpose }) => {
  const purposeLabel = purpose === 'login' ? 'Admin Login' : 'Password Reset'

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px">
      <div style="background:#DC2626;padding:16px 24px;border-radius:8px 8px 0 0">
        <h2 style="color:#fff;margin:0;font-size:20px">Carnex Auto Sales</h2>
        <p style="color:#fca5a5;margin:4px 0 0;font-size:13px">Admin Panel Security</p>
      </div>
      <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;
                  padding:24px;border-radius:0 0 8px 8px">
        <p style="color:#111827;margin:0 0 8px">Hello <strong>${escapeHtml(name)}</strong>,</p>
        <p style="color:#6b7280;font-size:14px;margin:0 0 24px">
          Your <strong>${purposeLabel}</strong> verification code is:
        </p>
        <div style="background:#f9fafb;border:2px dashed #dc2626;border-radius:8px;
                    padding:20px;text-align:center;margin:0 0 24px">
          <span style="font-size:36px;font-weight:700;letter-spacing:8px;
                       color:#dc2626;font-family:monospace">
            ${escapeHtml(code)}
          </span>
        </div>
        <p style="color:#6b7280;font-size:13px;margin:0 0 8px">
          ⏱ This code expires in <strong>10 minutes</strong>.
        </p>
        <p style="color:#6b7280;font-size:13px;margin:0">
          🔒 If you did not request this, ignore this email. 
          Your account remains secure.
        </p>
      </div>
      <p style="color:#9ca3af;font-size:11px;text-align:center;margin:16px 0 0">
        Carnex Auto Sales LLC • 8193 Elder Creek Road, Sacramento, CA 95824
      </p>
    </div>
  `

  await sendMail({
    to,
    subject: `${code} — Carnex Admin ${purposeLabel} Code`,
    html
  })
}

module.exports = { transporter, sendMail, sendOTPEmail }

// // server/src/config/nodemailer.js
// const nodemailer = require('nodemailer')

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: Number(process.env.SMTP_PORT) || 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// })

// /**
//  * Send an email.
//  * @param {Object} opts
//  * @param {string|string[]} opts.to
//  * @param {string} opts.subject
//  * @param {string} [opts.text]
//  * @param {string} [opts.html]
//  */
// const sendMail = async ({ to, subject, text, html }) => {
//   const from =
//     process.env.SMTP_FROM || `Carnex Auto Sales <${process.env.SMTP_USER}>`
//   await transporter.sendMail({ from, to, subject, text, html })
// }

// module.exports = { transporter, sendMail }

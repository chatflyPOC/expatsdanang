import { Resend } from 'resend'
import { ServiceRequestInput } from './validations'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'placeholder')
}

export async function sendAdminNotification(data: ServiceRequestInput & { id: string }) {
  const resend = getResend()
  await resend.emails.send({
    from: 'Expats Da Nang <noreply@expatsdanang.com>',
    to: process.env.ADMIN_EMAIL!,
    subject: `New request from ${data.name}`,
    html: `
      <h2>New Service Request</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Services:</strong> ${data.services.join(', ')}</p>
      <p><strong>Timeline:</strong> ${data.timeline}</p>
      <p><strong>Details:</strong> ${data.details || 'None'}</p>
      <p><strong>Contact:</strong> ${data.contact_pref} — ${data.contact_value}</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">View in admin →</a></p>
    `,
  })
}

export async function sendUserConfirmation(data: ServiceRequestInput) {
  if (data.contact_pref !== 'email') return
  const resend = getResend()
  await resend.emails.send({
    from: 'Expats Da Nang <hello@expatsdanang.com>',
    to: data.contact_value,
    subject: "We received your request — we'll be in touch within 2 hours",
    html: `
      <h2>Hi ${data.name}!</h2>
      <p>Thanks for reaching out. We've received your request for: <strong>${data.services.join(', ')}</strong>.</p>
      <p>We'll get back to you within 2 hours.</p>
      <p>In the meantime, you can also reach us on WhatsApp:
        <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}">Chat now</a>
      </p>
      <p>— Expats Da Nang team</p>
    `,
  })
}

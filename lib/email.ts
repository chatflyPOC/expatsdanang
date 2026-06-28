import { Resend } from 'resend'
import { ServiceRequestInput, HousingInquiryInput } from './validations'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'placeholder')
}

export async function sendAdminNotification(data: ServiceRequestInput & { id: string }) {
  const resend = getResend()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expatsdanang.com'
  const adminUrl = `${siteUrl}/admin`
  const submittedAt = new Date().toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh',
  })
  const serviceBadges = data.services
    .map(s => `<span style="display:inline-block;background:#E1F5EE;color:#0F6E56;font-size:12px;padding:2px 10px;border-radius:20px;margin-right:4px;font-family:sans-serif;">${s}</span>`)
    .join('')

  const subject = `[Expats Da Nang] New request — ${data.name} · ${data.services[0] ?? 'General'}`

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">

        <!-- Header -->
        <tr>
          <td style="background:#0A3A5C;padding:20px 24px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="width:40px;height:40px;background:#1D9E75;border-radius:8px;text-align:center;vertical-align:middle;">
                <span style="font-size:20px;line-height:40px;">✉</span>
              </td>
              <td style="padding-left:12px;">
                <p style="margin:0;color:#FFFFFF;font-weight:600;font-size:15px;">New service request</p>
                <p style="margin:0;color:#A8D4F0;font-size:12px;">expatsdanang.com</p>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#FFFFFF;padding:24px;">

            <!-- Alert banner -->
            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;">
              <tr>
                <td style="background:#E1F5EE;border-left:3px solid #1D9E75;border-radius:0 6px 6px 0;padding:10px 14px;">
                  <p style="margin:0;font-size:13px;color:#0F6E56;">A new customer has submitted a request. Review and assign a partner below.</p>
                </td>
              </tr>
            </table>

            <!-- Info table -->
            <table cellpadding="0" cellspacing="0" width="100%" style="font-size:14px;border-collapse:collapse;">
              <tr style="border-bottom:1px solid #F3F4F6;">
                <td style="padding:10px 0;color:#6B7280;width:36%;vertical-align:top;">👤 Name</td>
                <td style="padding:10px 0;font-weight:600;color:#111827;">${data.name}</td>
              </tr>
              <tr style="border-bottom:1px solid #F3F4F6;">
                <td style="padding:10px 0;color:#6B7280;vertical-align:top;">💼 Services</td>
                <td style="padding:10px 0;">${serviceBadges}</td>
              </tr>
              <tr style="border-bottom:1px solid #F3F4F6;">
                <td style="padding:10px 0;color:#6B7280;vertical-align:top;">⏱ Timeline</td>
                <td style="padding:10px 0;color:#111827;">${data.timeline}</td>
              </tr>
              <tr style="border-bottom:1px solid #F3F4F6;">
                <td style="padding:10px 0;color:#6B7280;vertical-align:top;">💬 Details</td>
                <td style="padding:10px 0;color:#374151;line-height:1.6;">${data.details || '<span style="color:#9CA3AF">No details provided</span>'}</td>
              </tr>
              <tr style="border-bottom:1px solid #F3F4F6;">
                <td style="padding:10px 0;color:#6B7280;vertical-align:top;">📱 Contact</td>
                <td style="padding:10px 0;color:#111827;">
                  <span style="color:#6B7280;font-size:13px;">${data.contact_pref} · </span>
                  <strong>${data.contact_value}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#6B7280;vertical-align:top;">📅 Submitted</td>
                <td style="padding:10px 0;color:#6B7280;font-size:13px;">${submittedAt} (ICT)</td>
              </tr>
            </table>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin-top:20px;padding-top:20px;border-top:1px solid #F3F4F6;">
              <tr>
                <td>
                  <a href="${adminUrl}" style="display:inline-block;background:#1D9E75;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:600;padding:10px 22px;border-radius:20px;">
                    View in admin →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:12px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:12px;color:#9CA3AF;">Expats Da Nang · CHATFLY COMPANY LIMITED</td>
              <td align="right" style="font-size:12px;color:#D1D5DB;">ID: ${data.id}</td>
            </tr></table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  const { error } = await resend.emails.send({
    from: 'Expats Da Nang <noreply@expatsdanang.com>',
    to: process.env.ADMIN_EMAIL!,
    subject,
    html,
  })
  if (error) throw new Error(`Resend admin notification failed: ${JSON.stringify(error)}`)
}

export async function sendUserConfirmation(data: ServiceRequestInput) {
  if (data.contact_pref !== 'email') return
  const resend = getResend()
  const { error } = await resend.emails.send({
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
  if (error) throw new Error(`Resend user confirmation failed: ${JSON.stringify(error)}`)
}

export async function sendHousingInquiryNotification(
  data: HousingInquiryInput & { id: string }
) {
  const resend = getResend()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expatsdanang.com'
  const submittedAt = new Date().toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh',
  })

  const subject = `[Housing] New inquiry — ${data.name} · ${data.listing_title}`

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
        <tr>
          <td style="background:#0A3A5C;padding:20px 24px;">
            <p style="margin:0;color:#FFFFFF;font-weight:600;font-size:15px;">New housing inquiry</p>
            <p style="margin:0;color:#A8D4F0;font-size:12px;">expatsdanang.com/housing</p>
          </td>
        </tr>
        <tr>
          <td style="background:#FFFFFF;padding:24px;">
            <table cellpadding="0" cellspacing="0" width="100%" style="font-size:14px;border-collapse:collapse;">
              <tr style="border-bottom:1px solid #F3F4F6;">
                <td style="padding:10px 0;color:#6B7280;width:36%;">🏠 Listing</td>
                <td style="padding:10px 0;font-weight:600;color:#111827;">${data.listing_title}</td>
              </tr>
              <tr style="border-bottom:1px solid #F3F4F6;">
                <td style="padding:10px 0;color:#6B7280;">👤 Name</td>
                <td style="padding:10px 0;font-weight:600;color:#111827;">${data.name}</td>
              </tr>
              <tr style="border-bottom:1px solid #F3F4F6;">
                <td style="padding:10px 0;color:#6B7280;">📱 Contact</td>
                <td style="padding:10px 0;color:#111827;">${data.contact_channel} · <strong>${data.contact_value}</strong></td>
              </tr>
              ${data.rental_duration ? `<tr style="border-bottom:1px solid #F3F4F6;"><td style="padding:10px 0;color:#6B7280;">⏱ Duration</td><td style="padding:10px 0;color:#111827;">${data.rental_duration}</td></tr>` : ''}
              ${data.preferred_viewing_date ? `<tr style="border-bottom:1px solid #F3F4F6;"><td style="padding:10px 0;color:#6B7280;">📅 Viewing</td><td style="padding:10px 0;color:#111827;">${data.preferred_viewing_date}</td></tr>` : ''}
              ${data.message ? `<tr style="border-bottom:1px solid #F3F4F6;"><td style="padding:10px 0;color:#6B7280;vertical-align:top;">💬 Message</td><td style="padding:10px 0;color:#374151;line-height:1.6;">${data.message}</td></tr>` : ''}
              <tr><td style="padding:10px 0;color:#6B7280;">🕐 Submitted</td><td style="padding:10px 0;color:#6B7280;font-size:13px;">${submittedAt} (ICT)</td></tr>
            </table>
            <table cellpadding="0" cellspacing="0" style="margin-top:20px;padding-top:20px;border-top:1px solid #F3F4F6;">
              <tr>
                <td>
                  <a href="${siteUrl}/housing/${data.listing_id}" style="display:inline-block;background:#1D9E75;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:600;padding:10px 22px;border-radius:20px;">
                    View listing →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:12px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:12px;color:#9CA3AF;">Expats Da Nang · Housing Inquiry</td>
              <td align="right" style="font-size:12px;color:#D1D5DB;">ID: ${data.id}</td>
            </tr></table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const { error } = await resend.emails.send({
    from: 'Expats Da Nang <noreply@expatsdanang.com>',
    to: process.env.ADMIN_EMAIL!,
    subject,
    html,
  })
  if (error) throw new Error(`Resend housing inquiry failed: ${JSON.stringify(error)}`)
}

export async function sendMotorbikeInquiryNotification(data: {
  id: string
  listing_id: string
  listing_title: string
  name: string
  contact_channel: string
  contact_value: string
  start_date?: string | null
  duration_days?: number | null
  delivery_method: string
  delivery_address?: string | null
  message?: string | null
}) {
  const resend = getResend()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expatsdanang.com'
  const submittedAt = new Date().toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh',
  })

  const deliveryLabel = data.delivery_method === 'home_delivery'
    ? `Home delivery${data.delivery_address ? ` → ${data.delivery_address}` : ''}`
    : 'Store pickup'

  const subject = `[Motorbike] New inquiry — ${data.name} · ${data.listing_title}`

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
        <tr>
          <td style="background:#0A3A5C;padding:20px 24px;">
            <p style="margin:0;color:#FFFFFF;font-weight:600;font-size:15px;">🛵 New motorbike inquiry</p>
            <p style="margin:0;color:#A8D4F0;font-size:12px;">expatsdanang.com/motorbike-rental</p>
          </td>
        </tr>
        <tr>
          <td style="background:#FFFFFF;padding:24px;">
            <table cellpadding="0" cellspacing="0" width="100%" style="font-size:14px;border-collapse:collapse;">
              <tr style="border-bottom:1px solid #F3F4F6;">
                <td style="padding:10px 0;color:#6B7280;width:36%;">🛵 Bike</td>
                <td style="padding:10px 0;font-weight:600;color:#111827;">${data.listing_title}</td>
              </tr>
              <tr style="border-bottom:1px solid #F3F4F6;">
                <td style="padding:10px 0;color:#6B7280;">👤 Name</td>
                <td style="padding:10px 0;font-weight:600;color:#111827;">${data.name}</td>
              </tr>
              <tr style="border-bottom:1px solid #F3F4F6;">
                <td style="padding:10px 0;color:#6B7280;">📱 Contact</td>
                <td style="padding:10px 0;color:#111827;">${data.contact_channel} · <strong>${data.contact_value}</strong></td>
              </tr>
              ${data.start_date ? `<tr style="border-bottom:1px solid #F3F4F6;"><td style="padding:10px 0;color:#6B7280;">📅 Start date</td><td style="padding:10px 0;color:#111827;">${data.start_date}</td></tr>` : ''}
              ${data.duration_days ? `<tr style="border-bottom:1px solid #F3F4F6;"><td style="padding:10px 0;color:#6B7280;">⏱ Duration</td><td style="padding:10px 0;color:#111827;">${data.duration_days} day${data.duration_days > 1 ? 's' : ''}</td></tr>` : ''}
              <tr style="border-bottom:1px solid #F3F4F6;">
                <td style="padding:10px 0;color:#6B7280;">🚚 Delivery</td>
                <td style="padding:10px 0;color:#111827;">${deliveryLabel}</td>
              </tr>
              ${data.message ? `<tr style="border-bottom:1px solid #F3F4F6;"><td style="padding:10px 0;color:#6B7280;vertical-align:top;">💬 Message</td><td style="padding:10px 0;color:#374151;line-height:1.6;">${data.message}</td></tr>` : ''}
              <tr><td style="padding:10px 0;color:#6B7280;">🕐 Submitted</td><td style="padding:10px 0;color:#6B7280;font-size:13px;">${submittedAt} (ICT)</td></tr>
            </table>
            <table cellpadding="0" cellspacing="0" style="margin-top:20px;padding-top:20px;border-top:1px solid #F3F4F6;">
              <tr>
                <td>
                  <a href="${siteUrl}/motorbike-rental/${data.listing_id}" style="display:inline-block;background:#1D9E75;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:600;padding:10px 22px;border-radius:20px;">
                    View listing →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:12px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:12px;color:#9CA3AF;">Expats Da Nang · Motorbike Inquiry</td>
              <td align="right" style="font-size:12px;color:#D1D5DB;">ID: ${data.id}</td>
            </tr></table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const { error } = await resend.emails.send({
    from: 'Expats Da Nang <noreply@expatsdanang.com>',
    to: process.env.ADMIN_EMAIL!,
    subject,
    html,
  })
  if (error) throw new Error(`Resend motorbike inquiry failed: ${JSON.stringify(error)}`)
}

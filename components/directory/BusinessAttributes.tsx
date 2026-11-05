import {
  Business, AMENITIES, amenityLabel, priceLevelLabel,
  ENGLISH_LEVEL_LABELS, PAYMENT_LABELS, PaymentMethod,
} from '@/types/directory'
import { Check, Clock, MapPin, Phone, Globe, Share2, Mail, MessageCircle } from 'lucide-react'

/**
 * The expat-facing attribute panel.
 *
 * Only attributes that were actually recorded are rendered. An unanswered
 * question (no price level, no payment methods) is left out rather than shown
 * as "unknown" — the panel's job is to carry what the verification visit
 * confirmed, and padding it with blanks makes a thin record look complete.
 */
export function BusinessAttributes({ business }: { business: Business }) {
  const price = priceLevelLabel(business.price_level)
  const payments = (business.payment_methods ?? []).filter(
    (p): p is PaymentMethod => p in PAYMENT_LABELS
  )
  // Render amenities in the vocabulary's order, not the row's, so every
  // business lists them the same way.
  const amenities = AMENITIES.filter((a) => business.amenities?.includes(a.key))

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Item label="English">{ENGLISH_LEVEL_LABELS[business.english_level]}</Item>
        {price && <Item label="Price level">{price}</Item>}
        {payments.length > 0 && (
          <Item label="Payment">{payments.map((p) => PAYMENT_LABELS[p]).join(', ')}</Item>
        )}
        <Item label="Area">{business.district_label}</Item>
      </dl>

      {amenities.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Confirmed on site
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {amenities.map((a) => (
              <li key={a.key} className="flex items-center gap-2 text-sm text-gray-700">
                <Check size={14} className="text-[#1D9E75] flex-none" />
                {amenityLabel(a.key)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-gray-400 mb-0.5">{label}</dt>
      <dd className="text-sm font-medium text-gray-800">{children}</dd>
    </div>
  )
}

/**
 * Contact card. A directory that hides the phone number is a lead form, so
 * every channel the business publishes is shown and links out directly.
 */
export function BusinessContact({ business }: { business: Business }) {
  const rows: { icon: React.ReactNode; label: string; href?: string; text: string }[] = []

  if (business.address) {
    rows.push({
      icon: <MapPin size={14} />,
      label: 'Address',
      text: business.address,
      href: business.maps_url ?? undefined,
    })
  }
  if (business.hours) {
    rows.push({ icon: <Clock size={14} />, label: 'Hours', text: business.hours })
  }
  if (business.phone) {
    rows.push({
      icon: <Phone size={14} />,
      label: 'Phone',
      text: business.phone,
      href: `tel:${business.phone.replace(/[^\d+]/g, '')}`,
    })
  }
  if (business.zalo) {
    rows.push({ icon: <MessageCircle size={14} />, label: 'Zalo', text: business.zalo })
  }
  if (business.website) {
    rows.push({
      icon: <Globe size={14} />,
      label: 'Website',
      text: business.website.replace(/^https?:\/\//, ''),
      href: business.website,
    })
  }
  if (business.facebook) {
    rows.push({
      icon: <Share2 size={14} />,
      label: 'Facebook',
      text: 'Facebook page',
      href: business.facebook,
    })
  }
  if (business.email) {
    rows.push({
      icon: <Mail size={14} />,
      label: 'Email',
      text: business.email,
      href: `mailto:${business.email}`,
    })
  }

  if (rows.length === 0) return null

  return (
    <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white">
      <p className="px-4 py-3 bg-gray-50 border-b border-[#E5E7EB] text-sm font-semibold text-gray-800">
        Contact
      </p>
      <ul className="divide-y divide-[#F3F5F9]">
        {rows.map((row) => (
          <li key={row.label} className="px-4 py-3 flex gap-3">
            <span className="text-[#1D9E75] mt-0.5 flex-none">{row.icon}</span>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400">{row.label}</p>
              {row.href ? (
                <a
                  href={row.href}
                  target={row.href.startsWith('http') ? '_blank' : undefined}
                  rel={row.href.startsWith('http') ? 'noopener noreferrer nofollow' : undefined}
                  className="text-sm text-[#0F6E56] hover:underline break-words"
                >
                  {row.text}
                </a>
              ) : (
                <p className="text-sm text-gray-700 break-words">{row.text}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

const VN_COUNTRY_CODE = '84'

/** Fallback used when the env var is missing; never rendered in production. */
const PLACEHOLDER = '84000000000'

/**
 * Normalises a Vietnamese phone number to the bare E.164 digits wa.me expects.
 *
 * wa.me rejects anything that isn't a full international number: no `+`, no
 * separators, and crucially no leading `0`. A local-format number such as
 * `0337788044` silently produces a dead link, so every WhatsApp entry point
 * must go through here rather than reading the env var directly.
 */
export function normalizeWhatsappNumber(raw?: string | null): string {
  const digits = (raw ?? '').replace(/\D/g, '')
  if (!digits) return PLACEHOLDER
  if (digits.startsWith(VN_COUNTRY_CODE)) return digits
  // Local format: 0337788044 -> 84337788044
  if (digits.startsWith('0')) return VN_COUNTRY_CODE + digits.slice(1)
  return VN_COUNTRY_CODE + digits
}

/** The site's WhatsApp number in E.164 digits, safe to interpolate into wa.me. */
export const WHATSAPP_NUMBER = normalizeWhatsappNumber(
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
)

/** Same number in display form, e.g. for `telephone` in structured data. */
export const WHATSAPP_E164 = `+${WHATSAPP_NUMBER}`

/** Builds a wa.me deep link, optionally pre-filling the message body. */
export function whatsappHref(text?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

'use client'
import { useState } from 'react'
import { X, Loader2, Home, Store } from 'lucide-react'

type DeliveryMethod = 'home_delivery' | 'store_pickup'

interface Props {
  listingId: string
  listingTitle: string
  pricePerDay: number
  deliveryAvailable?: boolean
  deliveryFeeUsd?: number | null
  onClose: () => void
}

const CHANNELS = [
  { value: 'zalo', label: 'Zalo' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'email', label: 'Email' },
] as const

export function MotorbikeInquiryForm({
  listingId, listingTitle, pricePerDay,
  deliveryAvailable = false, deliveryFeeUsd,
  onClose,
}: Props) {
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('store_pickup')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [channel, setChannel] = useState<'zalo' | 'whatsapp' | 'telegram' | 'email'>('zalo')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [startDate, setStartDate] = useState('')
  const [days, setDays] = useState<number | ''>('')
  const [message, setMessage] = useState('')
  const [hp, setHp] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const rentalTotal = days ? days * pricePerDay : null
  const deliveryFee = deliveryMethod === 'home_delivery' && deliveryFeeUsd ? deliveryFeeUsd : 0
  const grandTotal = rentalTotal ? rentalTotal + deliveryFee : null

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/motorbike/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listing_id: listingId,
        listing_title: listingTitle,
        name,
        contact_channel: channel,
        contact_value: contact,
        start_date: startDate || undefined,
        duration_days: days || undefined,
        delivery_method: deliveryMethod,
        delivery_address: deliveryMethod === 'home_delivery' ? deliveryAddress : undefined,
        message: message || undefined,
        hp,
      }),
    })
    setLoading(false)
    setDone(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Book this bike</h3>
            <p className="text-xs text-gray-400 line-clamp-1">{listingTitle}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {done ? (
          <div className="px-5 py-10 text-center">
            <div className="text-4xl mb-3">🏍️</div>
            <p className="font-semibold text-gray-900 mb-1">Request sent!</p>
            <p className="text-sm text-gray-500 mb-1">
              {deliveryMethod === 'home_delivery'
                ? 'We will deliver the bike to your address.'
                : 'Please come to the store to pick up the bike.'}
            </p>
            <p className="text-xs text-gray-400 mb-5">We&apos;ll contact you within 2 hours via {channel}.</p>
            <button onClick={onClose} className="px-6 py-2 bg-[#1D9E75] text-white rounded-full text-sm font-medium hover:bg-[#0F6E56] transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-5 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Honeypot */}
            <input type="text" name="website" value={hp} onChange={e => setHp(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

            {/* Delivery method */}
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-2 block">Pickup method *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('store_pickup')}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 transition-all ${
                    deliveryMethod === 'store_pickup'
                      ? 'border-[#1D9E75] bg-[#E1F5EE] text-[#085041]'
                      : 'border-[#E5E7EB] text-gray-500 hover:border-[#1D9E75]/50'
                  }`}
                >
                  <Store size={20} />
                  <span className="text-xs font-semibold">Store pickup</span>
                  <span className="text-[10px] text-gray-400">Free</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('home_delivery')}
                  disabled={!deliveryAvailable}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 transition-all ${
                    !deliveryAvailable
                      ? 'border-[#E5E7EB] bg-gray-50 text-gray-300 cursor-not-allowed'
                      : deliveryMethod === 'home_delivery'
                        ? 'border-[#1D9E75] bg-[#E1F5EE] text-[#085041]'
                        : 'border-[#E5E7EB] text-gray-500 hover:border-[#1D9E75]/50'
                  }`}
                >
                  <Home size={20} />
                  <span className="text-xs font-semibold">Home delivery</span>
                  <span className="text-[10px] text-gray-400">
                    {!deliveryAvailable
                      ? 'Not available'
                      : deliveryFeeUsd
                        ? `+$${deliveryFeeUsd} fee`
                        : 'Free'}
                  </span>
                </button>
              </div>

              {/* Delivery address */}
              {deliveryMethod === 'home_delivery' && (
                <div className="mt-2">
                  <label className="text-xs font-medium text-gray-700 mb-1.5 block">Delivery address *</label>
                  <textarea
                    required={deliveryMethod === 'home_delivery'}
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    rows={2}
                    placeholder="Street number, street name, ward / district..."
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 resize-none"
                  />
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">Your name *</label>
              <input
                required value={name} onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">Contact via *</label>
              <div className="flex gap-2 mb-2">
                {CHANNELS.map(c => (
                  <button key={c.value} type="button" onClick={() => setChannel(c.value)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${channel === c.value ? 'bg-[#1D9E75] text-white border-[#1D9E75]' : 'border-[#E5E7EB] text-gray-600 hover:border-[#1D9E75]'}`}>
                    {c.label}
                  </button>
                ))}
              </div>
              <input
                required value={contact} onChange={e => setContact(e.target.value)}
                placeholder={channel === 'email' ? 'your@email.com' : 'Your phone / username'}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Start date</label>
                <input
                  type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Duration (days)</label>
                <input
                  type="number" min={1} value={days} onChange={e => setDays(Number(e.target.value) || '')}
                  placeholder="e.g. 7"
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
                />
              </div>
            </div>

            {/* Cost estimate */}
            {grandTotal !== null && (
              <div className="bg-[#E1F5EE] rounded-xl px-4 py-3 space-y-1.5">
                <div className="flex justify-between text-xs text-[#0F6E56]">
                  <span>Rental ({days} days × ${pricePerDay})</span>
                  <span>${rentalTotal?.toLocaleString()}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-xs text-[#0F6E56]">
                    <span>Delivery fee</span>
                    <span>${deliveryFee}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#085041] border-t border-[#B6E5D4] pt-1.5">
                  <span>Estimated total</span>
                  <span>${grandTotal.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Message */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">Message (optional)</label>
              <textarea
                value={message} onChange={e => setMessage(e.target.value)}
                rows={2} placeholder="Special requests, questions..."
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 resize-none"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#1D9E75] hover:bg-[#0F6E56] text-white font-semibold py-3 rounded-full text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {deliveryMethod === 'home_delivery' ? 'Book — home delivery →' : 'Book — store pickup →'}
            </button>

            <p className="text-center text-[10px] text-gray-400">✓ Free to inquire · ✓ Reply within 2 hours</p>
          </form>
        )}
      </div>
    </div>
  )
}

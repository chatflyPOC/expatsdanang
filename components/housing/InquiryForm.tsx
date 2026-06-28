'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { housingInquirySchema, HousingInquiryInput } from '@/lib/validations'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { CheckCircle, X } from 'lucide-react'
import { clsx } from 'clsx'

const CHANNELS = [
  { value: 'zalo' as const, label: 'Zalo' },
  { value: 'whatsapp' as const, label: 'WhatsApp' },
  { value: 'telegram' as const, label: 'Telegram' },
  { value: 'email' as const, label: 'Email' },
]

const DURATIONS = ['1 month', '3 months', '6 months', '1 year', 'Flexible']

interface Props {
  listingId: string
  listingTitle: string
  onClose: () => void
}

export function InquiryForm({ listingId, listingTitle, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [channel, setChannel] = useState<'zalo' | 'whatsapp' | 'telegram' | 'email'>('whatsapp')
  const [duration, setDuration] = useState<string | null>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<HousingInquiryInput>({
    resolver: zodResolver(housingInquirySchema),
    defaultValues: {
      listing_id: listingId,
      listing_title: listingTitle,
      contact_channel: 'whatsapp',
    },
  })

  const onSubmit = async (data: HousingInquiryInput) => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/housing/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, contact_channel: channel, rental_duration: duration ?? undefined }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or message us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
          <div>
            <p className="font-semibold text-gray-900">Request a viewing</p>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{listingTitle}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle size={44} className="text-[#1D9E75] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Inquiry sent!</h3>
            <p className="text-sm text-gray-600 mb-6">
              Our concierge will contact you within 2 hours to arrange a viewing.
            </p>
            <button
              onClick={onClose}
              className="text-sm font-medium text-[#1D9E75] hover:text-[#0F6E56]"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
            {/* Honeypot */}
            <input type="text" className="hidden" tabIndex={-1} {...register('hp')} />

            <Input
              label="Your name"
              required
              placeholder="John Smith"
              error={errors.name?.message}
              {...register('name')}
            />

            {/* Contact channel */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Preferred contact <span className="text-red-400">*</span>
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {CHANNELS.map(c => (
                  <Chip
                    key={c.value}
                    label={c.label}
                    selected={channel === c.value}
                    onClick={() => {
                      setChannel(c.value)
                      setValue('contact_channel', c.value)
                    }}
                  />
                ))}
              </div>
              <Input
                required
                placeholder={
                  channel === 'email' ? 'you@example.com'
                  : channel === 'telegram' ? '@yourusername'
                  : '+84 900 000 000'
                }
                type={channel === 'email' ? 'email' : 'text'}
                error={errors.contact_value?.message}
                {...register('contact_value')}
              />
            </div>

            {/* Duration */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Rental duration</p>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map(d => (
                  <Chip
                    key={d}
                    label={d}
                    selected={duration === d}
                    onClick={() => setDuration(prev => prev === d ? null : d)}
                  />
                ))}
              </div>
            </div>

            {/* Viewing date */}
            <Input
              label="Preferred viewing date"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              error={errors.preferred_viewing_date?.message}
              {...register('preferred_viewing_date')}
            />

            <Textarea
              label="Message (optional)"
              placeholder="Any specific questions or requirements..."
              rows={3}
              {...register('message')}
            />

            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              {submitting ? 'Sending…' : 'Send inquiry →'}
            </Button>

            <p className="text-center text-xs text-gray-400">
              Our concierge will reply within 2 hours
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export function InquiryButton({
  listingId,
  listingTitle,
  className,
}: {
  listingId: string
  listingTitle: string
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={clsx(
          'w-full bg-[#1D9E75] text-white font-semibold py-3 px-6 rounded-full',
          'hover:bg-[#0F6E56] transition-colors text-sm',
          className
        )}
      >
        Request a viewing →
      </button>
      {open && (
        <InquiryForm
          listingId={listingId}
          listingTitle={listingTitle}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

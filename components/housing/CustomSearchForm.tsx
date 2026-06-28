'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { housingSearchRequestSchema, HousingSearchRequestInput } from '@/lib/validations'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { CheckCircle, Search } from 'lucide-react'
import { DISTRICTS, HOUSING_TYPES } from '@/types/housing'

const CHANNELS = ['Zalo', 'WhatsApp', 'Telegram', 'Email']
const CHANNEL_MAP: Record<string, 'zalo' | 'whatsapp' | 'telegram' | 'email'> = {
  Zalo: 'zalo', WhatsApp: 'whatsapp', Telegram: 'telegram', Email: 'email',
}

export function CustomSearchForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [channel, setChannel] = useState('WhatsApp')
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const { register, handleSubmit, formState: { errors } } = useForm<HousingSearchRequestInput>({
    resolver: zodResolver(housingSearchRequestSchema),
    defaultValues: { contact_channel: 'whatsapp' },
  })

  const onSubmit = async (data: HousingSearchRequestInput) => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/housing/search-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          contact_channel: CHANNEL_MAP[channel],
          districts: selectedDistricts,
          type_preferences: selectedTypes,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleDistrict = (v: string) =>
    setSelectedDistricts(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])

  const toggleType = (v: string) =>
    setSelectedTypes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])

  return (
    <div className="bg-gradient-to-br from-[#E1F5EE] to-[#F0FAF6] border border-[#B6E5D4] rounded-2xl p-6 sm:p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 bg-[#1D9E75] rounded-full flex items-center justify-center flex-none">
          <Search size={18} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#085041]">
            Can&apos;t find the right place?
          </h2>
          <p className="text-sm text-[#0F6E56] mt-0.5">
            Tell us your requirements and our concierge will search for you — for free.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="text-center py-6">
          <CheckCircle size={40} className="text-[#1D9E75] mx-auto mb-3" />
          <p className="font-semibold text-[#085041] mb-1">Got it! We&apos;ll get searching.</p>
          <p className="text-sm text-[#0F6E56]">We&apos;ll be in touch within 24 hours with matching options.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Honeypot */}
          <input type="text" className="hidden" tabIndex={-1} {...register('hp')} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your name"
              required
              placeholder="John Smith"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Max budget (USD/month)"
              type="number"
              placeholder="e.g. 500"
              error={errors.budget_usd_max?.message}
              {...register('budget_usd_max', { valueAsNumber: true })}
            />
          </div>

          {/* Areas */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Preferred areas</p>
            <div className="flex flex-wrap gap-2">
              {DISTRICTS.map(d => (
                <Chip
                  key={d.value}
                  label={d.label}
                  selected={selectedDistricts.includes(d.value)}
                  onClick={() => toggleDistrict(d.value)}
                />
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Property type</p>
            <div className="flex flex-wrap gap-2">
              {HOUSING_TYPES.map(t => (
                <Chip
                  key={t.value}
                  label={t.label}
                  selected={selectedTypes.includes(t.value)}
                  onClick={() => toggleType(t.value)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Move-in date"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              {...register('move_in_date')}
            />
            <Input
              label="Rental duration"
              placeholder="e.g. 6 months"
              {...register('duration')}
            />
          </div>

          <Textarea
            label="Additional requirements"
            placeholder="e.g. sea view, pet-friendly, near coworking, ground floor..."
            rows={3}
            {...register('notes')}
          />

          {/* Contact */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              How should we contact you? <span className="text-red-400">*</span>
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {CHANNELS.map(c => (
                <Chip
                  key={c}
                  label={c}
                  selected={channel === c}
                  onClick={() => setChannel(c)}
                />
              ))}
            </div>
            <Input
              required
              placeholder={channel === 'Email' ? 'you@example.com' : channel === 'Telegram' ? '@yourusername' : '+84 900 000 000'}
              type={channel === 'Email' ? 'email' : 'text'}
              error={errors.contact_value?.message}
              {...register('contact_value')}
            />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? 'Sending…' : 'Send my requirements →'}
          </Button>
        </form>
      )}
    </div>
  )
}

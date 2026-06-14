'use client'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceRequestSchema, ServiceRequestInput } from '@/lib/validations'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { CheckCircle } from 'lucide-react'

const ALL_SERVICES = [
  'Airport transfer', 'Housing & rental', 'Bank account',
  'Visa & documents', 'Translation', 'Motorbike rental', 'Something else',
]

// Maps a service slug (?service=…) to the matching chip label
const SLUG_TO_SERVICE: Record<string, string> = {
  'airport-transfer': 'Airport transfer',
  'housing': 'Housing & rental',
  'bank-account': 'Bank account',
  'visa-documents': 'Visa & documents',
  'translation': 'Translation',
  'motorbike-rental': 'Motorbike rental',
}
const TIMELINES = ['ASAP', 'This week', 'This month', 'Just exploring']
const CONTACT_PREFS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
  { value: 'telegram', label: 'Telegram' },
] as const

const SESSION_KEY = 'expats_request_form'

export function RequestForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<ServiceRequestInput>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      services: [],
      contact_pref: 'whatsapp',
    },
  })

  const contactPref = watch('contact_pref')
  const formValues = watch()

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      Object.entries(parsed).forEach(([k, v]) => setValue(k as keyof ServiceRequestInput, v as string))
    }

    // Pre-fill from query params (e.g. /get-help?service=housing&ref=Studio+My+Khe)
    const params = new URLSearchParams(window.location.search)
    const service = params.get('service')
    const ref = params.get('ref')
    const label = service ? SLUG_TO_SERVICE[service] : null
    if (label) {
      const current = (watch('services') as string[]) || []
      if (!current.includes(label)) setValue('services', [...current, label])
    }
    if (ref) {
      const existing = watch('details') || ''
      const note = `Interested in: ${ref}`
      if (!existing.includes(note)) {
        setValue('details', existing ? `${note}\n${existing}` : note)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue])

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(formValues))
  }, [formValues])

  const onSubmit = async (data: ServiceRequestInput) => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed')
      sessionStorage.removeItem(SESSION_KEY)
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or message us on WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '84000000000'
    return (
      <div className="text-center py-16">
        <CheckCircle size={48} className="text-[#1D9E75] mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">We&apos;re on it!</h2>
        <p className="text-gray-600 mb-8">We&apos;ll be in touch within 2 hours.</p>
        <a
          href={`https://wa.me/${wa}?text=Hi!+I+just+submitted+a+request+on+your+website.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-[#1D9E75] text-white font-medium px-6 py-3 rounded-full hover:bg-[#0F6E56] transition-colors"
        >
          Message us on WhatsApp too →
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Input
        label="Your name"
        placeholder="John Smith"
        error={errors.name?.message}
        {...register('name')}
      />

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Services needed <span className="text-red-400">*</span></p>
        <Controller
          control={control}
          name="services"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {ALL_SERVICES.map((svc) => (
                <Chip
                  key={svc}
                  label={svc}
                  selected={field.value?.includes(svc)}
                  onClick={() => {
                    const cur = field.value || []
                    field.onChange(cur.includes(svc) ? cur.filter(s => s !== svc) : [...cur, svc])
                  }}
                />
              ))}
            </div>
          )}
        />
        {errors.services && <p className="text-xs text-red-500 mt-2">{errors.services.message}</p>}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">When do you need this? <span className="text-red-400">*</span></p>
        <Controller
          control={control}
          name="timeline"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {TIMELINES.map((t) => (
                <Chip key={t} label={t} selected={field.value === t} onClick={() => field.onChange(t)} />
              ))}
            </div>
          )}
        />
        {errors.timeline && <p className="text-xs text-red-500 mt-2">{errors.timeline.message}</p>}
      </div>

      <Textarea
        label="More details (optional)"
        placeholder="e.g. I'm arriving on June 20, need a 2BR apartment near the beach for 6 months, budget $500/month..."
        rows={4}
        error={errors.details?.message}
        {...register('details')}
      />

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">How should we contact you? <span className="text-red-400">*</span></p>
        <Controller
          control={control}
          name="contact_pref"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2 mb-4">
              {CONTACT_PREFS.map((p) => (
                <Chip key={p.value} label={p.label} selected={field.value === p.value} onClick={() => field.onChange(p.value)} />
              ))}
            </div>
          )}
        />
        <Input
          label={
            contactPref === 'whatsapp' ? 'WhatsApp number (with country code)' :
            contactPref === 'email' ? 'Email address' :
            'Telegram username'
          }
          placeholder={
            contactPref === 'whatsapp' ? '+44 7700 900000' :
            contactPref === 'email' ? 'you@example.com' :
            '@yourusername'
          }
          type={contactPref === 'email' ? 'email' : 'text'}
          error={errors.contact_value?.message}
          {...register('contact_value')}
        />
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? 'Sending...' : 'Send request →'}
      </Button>
    </form>
  )
}

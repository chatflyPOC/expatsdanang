'use client'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SERVICES } from '@/lib/services'
import type { ServiceRequest, AvailableRequest, Listing, Partner } from '@/types'
import { clsx } from 'clsx'

type Tab = 'available' | 'jobs' | 'listings'

export default function PartnerPage() {
  const supabase = useMemo(() => createClient(), [])
  const [tab, setTab] = useState<Tab>('available')
  const [partner, setPartner] = useState<Partner | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles').select('partner_id').eq('user_id', user.id).single()
      if (profile?.partner_id) {
        const { data } = await supabase
          .from('partners').select('*').eq('id', profile.partner_id).single()
        setPartner(data)
      }
      setLoading(false)
    })()
  }, [supabase])

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>
  if (!partner) return <p className="text-sm text-gray-400">No partner record found.</p>

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Services you handle:{' '}
          {partner.services.length
            ? partner.services.map(s => SERVICES.find(x => x.slug === s)?.title || s).join(', ')
            : <span className="text-amber-600">none assigned yet — contact admin</span>}
        </p>
      </div>

      <div className="flex gap-1 mb-8 border-b border-[#E5E7EB]">
        {([
          ['available', 'Available'],
          ['jobs', 'My jobs'],
          ['listings', 'My listings'],
        ] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'px-5 py-2.5 text-sm font-medium transition-colors',
              tab === t
                ? 'border-b-2 border-[#1D9E75] text-[#1D9E75]'
                : 'text-gray-500 hover:text-gray-900'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'available' && <AvailableTab partner={partner} onClaimed={() => setTab('jobs')} />}
      {tab === 'jobs' && <JobsTab partnerId={partner.id} />}
      {tab === 'listings' && <ListingsTab partner={partner} />}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Available pool — anonymized rows via list_available_requests() RPC
// ---------------------------------------------------------------------------
function AvailableTab({ partner, onClaimed }: { partner: Partner; onClaimed: () => void }) {
  const supabase = useMemo(() => createClient(), [])
  const [rows, setRows] = useState<AvailableRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.rpc('list_available_requests')
    if (error) setMsg(error.message)
    setRows((data as AvailableRequest[]) || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const claim = async (id: string) => {
    setClaiming(id)
    setMsg('')
    const { error } = await supabase.rpc('claim_request', { p_request_id: id })
    setClaiming(null)
    if (error) {
      setMsg(error.message) // e.g. "Request is no longer available" (lost the race)
      load()
    } else {
      onClaimed()
    }
  }

  if (loading) return <p className="text-sm text-gray-400">Loading pool…</p>

  return (
    <div>
      {msg && <p className="text-sm text-amber-600 mb-4">{msg}</p>}
      {!partner.services.length && (
        <p className="text-sm text-gray-400">No services assigned — nothing in your pool yet.</p>
      )}
      {partner.services.length > 0 && rows.length === 0 && (
        <p className="text-center py-16 text-gray-400 text-sm">No available requests right now.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rows.map(r => (
          <div key={r.id} className="border border-[#E5E7EB] rounded-xl p-5 bg-white">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {r.services.map(s => (
                <span key={s} className="text-xs bg-[#f0fdf9] text-[#0F6E56] px-2 py-0.5 rounded-full">
                  {SERVICES.find(x => x.slug === s)?.title || s}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mb-1">Timeline: {r.timeline}</p>
            {r.details_preview && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{r.details_preview}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-300">{new Date(r.created_at).toLocaleDateString()}</span>
              <button
                onClick={() => claim(r.id)}
                disabled={claiming === r.id}
                className="text-sm font-medium bg-[#1D9E75] text-white px-4 py-1.5 rounded-full hover:bg-[#0F6E56] disabled:opacity-50"
              >
                {claiming === r.id ? 'Claiming…' : 'Claim'}
              </button>
            </div>
            <p className="mt-3 text-[11px] text-gray-300">Customer contact is revealed after you claim.</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// My jobs — full request rows the partner has claimed (PII visible via RLS)
// ---------------------------------------------------------------------------
const FLOW: Record<string, { next?: string; label?: string }> = {
  claimed: { next: 'in_progress', label: 'Start working' },
  in_progress: { next: 'completed', label: 'Mark completed' },
  completed: {},
}

function JobsTab({ partnerId }: { partnerId: string }) {
  const supabase = useMemo(() => createClient(), [])
  const [jobs, setJobs] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState<Record<string, { quote: string; notes: string }>>({})

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('service_requests')
      .select('*')
      .eq('assigned_partner_id', partnerId)
      .order('claimed_at', { ascending: false })
    setJobs((data as ServiceRequest[]) || [])
    setLoading(false)
  }, [supabase, partnerId])

  useEffect(() => { load() }, [load])

  const logEvent = async (request_id: string, type: string, payload?: Record<string, unknown>) => {
    await supabase.from('request_events').insert({ request_id, actor_partner_id: partnerId, type, payload })
  }

  const advance = async (job: ServiceRequest) => {
    const next = FLOW[job.assignment_status]?.next
    if (!next) return
    await supabase.from('service_requests').update({ assignment_status: next }).eq('id', job.id)
    await logEvent(job.id, 'status_changed', { to: next })
    load()
  }

  const release = async (job: ServiceRequest) => {
    const { error } = await supabase.rpc('release_request', { p_request_id: job.id })
    if (!error) load()
  }

  const saveDetails = async (job: ServiceRequest) => {
    const d = draft[job.id]
    if (!d) return
    await supabase.from('service_requests')
      .update({ quote: d.quote, partner_notes: d.notes }).eq('id', job.id)
    await logEvent(job.id, 'quoted', { quote: d.quote })
    load()
  }

  if (loading) return <p className="text-sm text-gray-400">Loading jobs…</p>
  if (jobs.length === 0) return <p className="text-center py-16 text-gray-400 text-sm">No claimed jobs yet. Claim one from the Available tab.</p>

  return (
    <div className="space-y-4">
      {jobs.map(job => {
        const d = draft[job.id] ?? { quote: job.quote ?? '', notes: job.partner_notes ?? '' }
        const flow = FLOW[job.assignment_status]
        return (
          <div key={job.id} className="border border-[#E5E7EB] rounded-xl p-6 bg-white">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{job.name}</h3>
                <p className="text-xs text-gray-500">
                  {job.contact_pref} — <span className="font-medium text-gray-700">{job.contact_value}</span>
                </p>
              </div>
              <span className={clsx(
                'text-xs px-2 py-0.5 rounded-full font-medium',
                job.assignment_status === 'completed' ? 'bg-green-100 text-green-700' :
                job.assignment_status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'
              )}>{job.assignment_status}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {job.services.map(s => (
                <span key={s} className="text-xs bg-[#f0fdf9] text-[#0F6E56] px-2 py-0.5 rounded-full">
                  {SERVICES.find(x => x.slug === s)?.title || s}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 mb-1">Timeline: {job.timeline}</p>
            {job.details && <p className="text-sm text-gray-600 mb-4">{job.details}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <input
                placeholder="Quote (e.g. $30)"
                value={d.quote}
                onChange={e => setDraft(p => ({ ...p, [job.id]: { ...d, quote: e.target.value } }))}
                className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
              />
              <input
                placeholder="Internal notes"
                value={d.notes}
                onChange={e => setDraft(p => ({ ...p, [job.id]: { ...d, notes: e.target.value } }))}
                className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => saveDetails(job)}
                className="text-xs border border-[#D1D5DB] text-gray-600 px-4 py-1.5 rounded-full hover:bg-gray-50">
                Save quote & notes
              </button>
              {flow?.next && (
                <button onClick={() => advance(job)}
                  className="text-xs bg-[#1D9E75] text-white px-4 py-1.5 rounded-full hover:bg-[#0F6E56]">
                  {flow.label}
                </button>
              )}
              {job.assignment_status !== 'completed' && (
                <button onClick={() => release(job)}
                  className="text-xs border border-red-200 text-red-600 px-4 py-1.5 rounded-full hover:bg-red-50">
                  Release to pool
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Listing form helpers (shared with partner portal)
// ---------------------------------------------------------------------------
const P_DA_NANG_LOCATIONS = [
  { group: 'Hai Chau (Downtown)', wards: ['Hai Chau 1 Ward', 'Hai Chau 2 Ward', 'Thach Thang Ward', 'Binh Thuan Ward', 'Binh Hien Ward', 'Hoa Thuan Dong Ward', 'Hoa Thuan Tay Ward', 'Phuoc Ninh Ward', 'Nam Duong Ward'] },
  { group: 'Son Tra', wards: ['An Hai Bac Ward', 'An Hai Dong Ward', 'An Hai Tay Ward', 'Man Thai Ward', 'Nai Hien Dong Ward', 'Phuoc My Ward', 'Tho Quang Ward'] },
  { group: 'Ngu Hanh Son', wards: ['My An Ward', 'Khue My Ward', 'Hoa Hai Ward', 'Hoa Quy Ward'] },
  { group: 'Thanh Khe', wards: ['An Khe Ward', 'Chinh Gian Ward', 'Hoa Khe Ward', 'Tam Thuan Ward', 'Tan Chinh Ward', 'Thanh Khe Dong Ward', 'Thanh Khe Tay Ward', 'Vinh Trung Ward', 'Xuan Ha Ward'] },
  { group: 'Cam Le', wards: ['Hoa An Ward', 'Hoa Phat Ward', 'Hoa Tho Dong Ward', 'Hoa Tho Tay Ward', 'Hoa Xuan Ward', 'Khue Trung Ward'] },
  { group: 'Lien Chieu', wards: ['Hoa Hiep Bac Ward', 'Hoa Hiep Nam Ward', 'Hoa Khanh Bac Ward', 'Hoa Khanh Nam Ward', 'Hoa Minh Ward'] },
]

type PServiceCfg = {
  priceLabel: string; pricePlaceholder: string
  showArea: boolean; areaLabel?: string; areaPlaceholder?: string
  showLocation: boolean
  titlePlaceholder: string; descriptionPlaceholder: string
}

const P_SERVICE_CFG: Record<string, PServiceCfg> = {
  'airport-transfer': {
    priceLabel: 'Price (USD / trip)', pricePlaceholder: 'ex: 15',
    showArea: false, showLocation: true,
    titlePlaceholder: 'ex: Airport Pickup — City Centre Drop-off',
    descriptionPlaceholder: 'ex: English-speaking driver, meet & greet inside arrivals hall. Fixed price, no meter surprises. Available 24/7.',
  },
  'housing': {
    priceLabel: 'Rent (USD / month)', pricePlaceholder: 'ex: 450',
    showArea: true, areaLabel: 'Area (m²)', areaPlaceholder: 'ex: 65',
    showLocation: true,
    titlePlaceholder: 'ex: 2BR Apartment near My Khe Beach',
    descriptionPlaceholder: 'ex: Fully furnished 2-bedroom apartment, 65 m², 5 min walk to My Khe Beach. High-speed WiFi, AC in all rooms.',
  },
  'bank-account': {
    priceLabel: 'Service fee (USD)', pricePlaceholder: 'ex: 30',
    showArea: false, showLocation: true,
    titlePlaceholder: 'ex: Vietcombank Account Setup — Full Service',
    descriptionPlaceholder: 'ex: We handle all paperwork, translation, and accompany you to the branch. Card delivery within 5–7 business days.',
  },
  'visa-documents': {
    priceLabel: 'Service fee (USD)', pricePlaceholder: 'ex: 25',
    showArea: false, showLocation: false,
    titlePlaceholder: 'ex: 90-Day E-Visa Application (Single Entry)',
    descriptionPlaceholder: 'ex: Full e-visa application service for eligible nationalities. Processing time 3–5 business days.',
  },
  'translation': {
    priceLabel: 'Price (USD / page)', pricePlaceholder: 'ex: 15',
    showArea: false, showLocation: false,
    titlePlaceholder: 'ex: Certified Lease Contract Translation (VN → EN)',
    descriptionPlaceholder: 'ex: Certified Vietnamese-to-English translation accepted by embassies and government offices. 1–2 business day turnaround.',
  },
  'motorbike-rental': {
    priceLabel: 'Price (USD / day)', pricePlaceholder: 'ex: 7',
    showArea: true, areaLabel: 'Engine / type', areaPlaceholder: 'ex: 110cc automatic scooter',
    showLocation: true,
    titlePlaceholder: 'ex: Honda Vision 110cc — City Scooter',
    descriptionPlaceholder: 'ex: Well-maintained Honda Vision. Helmet included. Free delivery within Da Nang city centre.',
  },
}

const STATUS_META: Record<string, { label: string; color: string; hint: string }> = {
  draft:     { label: 'Draft',            color: 'bg-gray-100 text-gray-500',    hint: 'Not submitted yet — only you can see this.' },
  submitted: { label: 'Pending approval', color: 'bg-amber-100 text-amber-700',  hint: 'Waiting for admin review. Not visible on the website yet.' },
  approved:  { label: 'Live on website',  color: 'bg-green-100 text-green-700',  hint: 'Approved and visible to visitors on expatsdanang.com.' },
  rejected:  { label: 'Rejected',         color: 'bg-red-100 text-red-600',      hint: 'Not approved. Edit and resubmit for review.' },
}

// ---------------------------------------------------------------------------
// My listings — partner-owned service info, submitted for admin approval
// ---------------------------------------------------------------------------
function ListingsTab({ partner }: { partner: Partner }) {
  const supabase = useMemo(() => createClient(), [])
  const [listings, setListings] = useState<Listing[]>([])
  const [editing, setEditing] = useState<Partial<Listing> | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('listings').select('*').eq('partner_id', partner.id).order('created_at', { ascending: false })
    setListings((data as Listing[]) || [])
  }, [supabase, partner.id])

  useEffect(() => { load() }, [load])

  const openNew = () => {
    setEditing({ service_slug: '', active: true, verified: false })
    setImageFile(null); setImagePreview(''); setSaveError('')
  }

  const openEdit = (l: Listing) => {
    // Partners can only edit draft or rejected listings
    if (l.status === 'submitted' || l.status === 'approved') return
    setEditing(l)
    setImageFile(null); setImagePreview(l.image_url || ''); setSaveError('')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `listings/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('listing-images').upload(path, file, { upsert: true })
    if (error) throw new Error(error.message)
    const { data } = supabase.storage.from('listing-images').getPublicUrl(path)
    return data.publicUrl
  }

  const save = async (submit: boolean) => {
    if (!editing) return
    setSaving(true); setSaveError('')
    try {
      let image_url = editing.image_url || ''
      if (imageFile) image_url = await uploadImage(imageFile)

      const status = submit ? 'submitted' : 'draft'
      if (editing.id) {
        const { id, created_at, partner_id, verified, ...rest } = editing as Listing
        await supabase.from('listings').update({ ...rest, image_url, status }).eq('id', id)
      } else {
        await supabase.from('listings').insert({
          title: editing.title, service_slug: editing.service_slug,
          price: editing.price, location: editing.location,
          area: editing.area, description: editing.description,
          image_url, partner_id: partner.id, status, active: true, verified: false,
        })
      }
      setEditing(null); setImageFile(null); setImagePreview('')
      load()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const cfg = editing?.service_slug ? P_SERVICE_CFG[editing.service_slug] : null

  return (
    <div>
      {/* Info banner */}
      <div className="bg-[#f0fdf9] border border-[#1D9E75]/20 rounded-xl px-5 py-3 mb-5 text-sm text-[#0F6E56]">
        Listings you submit go to admin for review. Once approved, they appear on <strong>expatsdanang.com</strong>.
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={openNew} className="text-sm font-medium bg-[#1D9E75] text-white px-4 py-2 rounded-full hover:bg-[#0F6E56]">
          + New listing
        </button>
      </div>

      {editing && (
        <div className="border border-[#E5E7EB] rounded-xl p-6 mb-6 bg-white space-y-5">

          {/* Service selector */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block uppercase tracking-wide">Service</label>
            <select
              value={editing.service_slug || ''}
              onChange={e => setEditing(prev => ({ ...prev, service_slug: e.target.value }))}
              className="w-full sm:w-72 border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75] bg-white"
            >
              <option value="">— Select a service —</option>
              {partner.services.map(s => (
                <option key={s} value={s}>{SERVICES.find(x => x.slug === s)?.title || s}</option>
              ))}
            </select>
          </div>

          {cfg && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-400 mb-1 block">Listing title</label>
                <input
                  placeholder={cfg.titlePlaceholder}
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
                  value={editing.title || ''}
                  onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">{cfg.priceLabel}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                  <input
                    type="number" min="0" step="0.01"
                    placeholder={cfg.pricePlaceholder}
                    className="w-full border border-[#E5E7EB] rounded-lg pl-7 pr-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
                    value={editing.price ?? ''}
                    onChange={e => setEditing(p => ({ ...p, price: e.target.value }))}
                  />
                </div>
              </div>

              {/* Area (conditional) */}
              {cfg.showArea && (
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{cfg.areaLabel}</label>
                  <input
                    placeholder={cfg.areaPlaceholder}
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
                    value={editing.area || ''}
                    onChange={e => setEditing(p => ({ ...p, area: e.target.value }))}
                  />
                </div>
              )}

              {/* Location (conditional) */}
              {cfg.showLocation && (
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Location (Ward / Area)</label>
                  <select
                    value={editing.location || ''}
                    onChange={e => setEditing(p => ({ ...p, location: e.target.value }))}
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75] bg-white text-gray-700"
                  >
                    <option value="">ex: Select ward / area</option>
                    {P_DA_NANG_LOCATIONS.map(g => (
                      <optgroup key={g.group} label={g.group}>
                        {g.wards.map(w => <option key={w} value={w}>{w}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
              )}

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-400 mb-1 flex items-center justify-between">
                  <span>Description</span>
                  <span className={clsx('text-[11px]', (editing.description?.length ?? 0) > 180 ? 'text-amber-500' : 'text-gray-300')}>
                    {editing.description?.length ?? 0} / 200
                  </span>
                </label>
                <textarea
                  rows={5} maxLength={200}
                  placeholder={cfg.descriptionPlaceholder}
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75] resize-none leading-relaxed"
                  value={editing.description || ''}
                  onChange={e => setEditing(p => ({ ...p, description: e.target.value }))}
                />
              </div>

              {/* Image upload */}
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-400 mb-1 block">Image</label>
                <div className="flex items-start gap-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="preview" className="w-24 h-24 object-cover rounded-lg border border-[#E5E7EB] flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="text-sm border border-dashed border-[#D1D5DB] text-gray-500 hover:border-[#1D9E75] hover:text-[#1D9E75] px-4 py-2.5 rounded-lg transition-colors w-full text-left"
                    >
                      {imagePreview ? '↑ Change image' : '+ Upload image'}
                    </button>
                    <p className="text-[11px] text-gray-400 mt-1">JPG, PNG or WebP · max 5 MB</p>
                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {saveError && <p className="text-sm text-red-500">{saveError}</p>}

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={() => save(true)}
              disabled={saving || !editing.service_slug}
              className="bg-[#1D9E75] text-white text-sm px-5 py-2 rounded-full hover:bg-[#0F6E56] disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Submit for approval'}
            </button>
            <button
              onClick={() => save(false)}
              disabled={saving || !editing.service_slug}
              className="border border-[#D1D5DB] text-gray-600 text-sm px-5 py-2 rounded-full hover:bg-gray-50 disabled:opacity-50"
            >
              Save draft
            </button>
            <button
              onClick={() => { setEditing(null); setImageFile(null); setImagePreview('') }}
              className="text-gray-400 text-sm px-3 py-2 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {listings.length === 0 && <p className="text-center py-12 text-gray-400 text-sm">No listings yet. Create one above.</p>}
        {listings.map(l => {
          const meta = STATUS_META[l.status] ?? STATUS_META.draft
          const canEdit = l.status === 'draft' || l.status === 'rejected'
          return (
            <div key={l.id} className="border border-[#E5E7EB] rounded-xl p-5 bg-white">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{l.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {SERVICES.find(x => x.slug === l.service_slug)?.title || l.service_slug}
                    {l.price ? ` · $${l.price}` : ''}
                    {l.location ? ` · ${l.location}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap', meta.color)}>
                    {meta.label}
                  </span>
                  {canEdit && (
                    <button onClick={() => openEdit(l)} className="text-xs text-[#1D9E75] hover:underline whitespace-nowrap">
                      Edit
                    </button>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">{meta.hint}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

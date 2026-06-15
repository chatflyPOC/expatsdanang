'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
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
// My listings — partner-owned service info, submitted for admin approval
// ---------------------------------------------------------------------------
function ListingsTab({ partner }: { partner: Partner }) {
  const supabase = useMemo(() => createClient(), [])
  const [listings, setListings] = useState<Listing[]>([])
  const [editing, setEditing] = useState<Partial<Listing> | null>(null)

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('listings').select('*').eq('partner_id', partner.id).order('created_at', { ascending: false })
    setListings((data as Listing[]) || [])
  }, [supabase, partner.id])

  useEffect(() => { load() }, [load])

  const save = async (submit: boolean) => {
    if (!editing) return
    const status = submit ? 'submitted' : 'draft'
    if (editing.id) {
      const { id, created_at, partner_id, verified, ...rest } = editing as Listing
      await supabase.from('listings').update({ ...rest, status }).eq('id', id)
    } else {
      await supabase.from('listings').insert({
        title: editing.title, service_slug: editing.service_slug, price: editing.price,
        location: editing.location, area: editing.area, description: editing.description,
        image_url: editing.image_url, partner_id: partner.id, status, active: true, verified: false,
      })
    }
    setEditing(null)
    load()
  }

  const FIELDS = ['title', 'service_slug', 'price', 'location', 'area', 'description', 'image_url'] as const
  const STATUS_COLORS: Record<string, string> = {
    approved: 'bg-green-100 text-green-700',
    submitted: 'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-600',
    draft: 'bg-gray-100 text-gray-500',
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setEditing({})}
          className="text-sm font-medium bg-[#1D9E75] text-white px-4 py-2 rounded-full hover:bg-[#0F6E56]"
        >
          + New listing
        </button>
      </div>

      {editing && (
        <div className="border border-[#E5E7EB] rounded-xl p-6 mb-6 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FIELDS.map(f => (
            <div key={f} className={f === 'description' ? 'col-span-full' : ''}>
              <label className="text-xs text-gray-400 mb-1 block capitalize">{f.replace(/_/g, ' ')}</label>
              {f === 'service_slug' ? (
                <select
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
                  value={(editing as Record<string, string>)[f] || ''}
                  onChange={e => setEditing(prev => ({ ...prev, [f]: e.target.value }))}
                >
                  <option value="">Select service…</option>
                  {partner.services.map(s => (
                    <option key={s} value={s}>{SERVICES.find(x => x.slug === s)?.title || s}</option>
                  ))}
                </select>
              ) : (
                <input
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
                  value={(editing as Record<string, string>)[f] || ''}
                  onChange={e => setEditing(prev => ({ ...prev, [f]: e.target.value }))}
                />
              )}
            </div>
          ))}
          <div className="col-span-full flex gap-3 pt-2">
            <button onClick={() => save(true)} className="bg-[#1D9E75] text-white text-sm px-5 py-2 rounded-full hover:bg-[#0F6E56]">Submit for approval</button>
            <button onClick={() => save(false)} className="border border-[#D1D5DB] text-gray-600 text-sm px-5 py-2 rounded-full hover:bg-gray-50">Save draft</button>
            <button onClick={() => setEditing(null)} className="text-gray-400 text-sm px-3 py-2 hover:text-gray-600">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {listings.length === 0 && <p className="text-center py-12 text-gray-400 text-sm">No listings yet.</p>}
        {listings.map(l => (
          <div key={l.id} className="border border-[#E5E7EB] rounded-xl p-5 bg-white flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{l.title}</p>
              <p className="text-xs text-gray-500">{SERVICES.find(x => x.slug === l.service_slug)?.title || l.service_slug} · {l.price}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', STATUS_COLORS[l.status])}>{l.status}</span>
              <button onClick={() => setEditing(l)} className="text-xs text-[#1D9E75] hover:underline">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

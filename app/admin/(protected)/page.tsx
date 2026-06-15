'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ServiceRequest, Listing, Review, SiteStat, Partner } from '@/types'
import { SERVICES } from '@/lib/services'
import { clsx } from 'clsx'
import {
  LayoutDashboard, Inbox, Users, ClipboardList, Star, SlidersHorizontal,
  Search, Menu, LogOut, Bell, type LucideIcon,
} from 'lucide-react'

type Tab = 'overview' | 'requests' | 'partners' | 'listings' | 'reviews' | 'stats'

const NAV: { group: string; items: { id: Tab; label: string; icon: LucideIcon }[] }[] = [
  { group: 'Main', items: [{ id: 'overview', label: 'Overview', icon: LayoutDashboard }] },
  {
    group: 'Operations',
    items: [
      { id: 'requests', label: 'Requests', icon: Inbox },
      { id: 'partners', label: 'Partners', icon: Users },
      { id: 'listings', label: 'Listings', icon: ClipboardList },
      { id: 'reviews', label: 'Reviews', icon: Star },
    ],
  },
  { group: 'Site', items: [{ id: 'stats', label: 'Stats', icon: SlidersHorizontal }] },
]

const TITLES: Record<Tab, string> = {
  overview: 'Overview', requests: 'Service requests', partners: 'Partners',
  listings: 'Listings', reviews: 'Reviews', stats: 'Site stats',
}

export default function AdminPage() {
  const supabase = useMemo(() => createClient(), [])
  const [tab, setTab] = useState<Tab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ''))
  }, [supabase])

  const go = (t: Tab) => { setTab(t); setSidebarOpen(false) }

  return (
    <div className="min-h-screen flex bg-[#f7f8fc]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        'fixed md:static inset-y-0 left-0 z-40 w-60 bg-[#222e3c] flex flex-col transition-transform',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        <div className="h-16 flex items-center gap-2 px-6 border-b border-white/5">
          <span className="w-7 h-7 rounded-lg bg-[#1D9E75] flex items-center justify-center text-white font-bold text-sm">E</span>
          <span className="text-white font-semibold">Expats Da Nang</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {NAV.map(section => (
            <div key={section.group} className="mb-4">
              <p className="px-6 mb-2 text-[11px] uppercase tracking-wider text-gray-500">{section.group}</p>
              {section.items.map(item => {
                const Icon = item.icon
                const active = tab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    className={clsx(
                      'w-full flex items-center gap-3 px-6 py-2.5 text-sm transition-colors border-l-2',
                      active
                        ? 'bg-black/20 text-white border-[#1D9E75]'
                        : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon size={18} /> {item.label}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-[#edf0f5] flex items-center gap-4 px-4 sm:px-6 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(o => !o)} className="md:hidden text-gray-500" aria-label="Toggle menu">
            <Menu size={22} />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search…"
              className="w-full bg-[#f7f8fc] border border-transparent rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-[#1D9E75] focus:bg-white"
            />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600" aria-label="Notifications"><Bell size={20} /></button>
            <form action="/api/auth/signout" method="post">
              <button type="submit" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
                <LogOut size={16} /> <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
            <span className="w-9 h-9 rounded-full bg-[#1D9E75] text-white flex items-center justify-center text-sm font-medium uppercase">
              {email ? email[0] : 'A'}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-screen-2xl w-full mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{TITLES[tab]}</h1>
              <p className="text-sm text-gray-400">Expats Da Nang admin</p>
            </div>
          </div>

          {tab === 'overview' && <OverviewTab onGo={go} />}
          {tab === 'requests' && <RequestsTab />}
          {tab === 'partners' && <PartnersTab />}
          {tab === 'listings' && <ListingsTab />}
          {tab === 'reviews' && <ReviewsTab />}
          {tab === 'stats' && <StatsTab />}
        </main>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Overview — real-data stat cards + recent activity
// ---------------------------------------------------------------------------
function StatCard({ label, value, icon: Icon, sub, accent }: {
  label: string; value: number | string; icon: LucideIcon; sub?: string; accent: string
}) {
  return (
    <div className="bg-white rounded-xl border border-[#edf0f5] p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-2">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <span className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}1a`, color: accent }}>
          <Icon size={20} />
        </span>
      </div>
      {sub && <p className="text-xs text-gray-400 mt-3">{sub}</p>}
    </div>
  )
}

function OverviewTab({ onGo }: { onGo: (t: Tab) => void }) {
  const supabase = useMemo(() => createClient(), [])
  const [counts, setCounts] = useState({ requests: 0, pool: 0, partners: 0, listings: 0, pendingReviews: 0, submittedListings: 0 })
  const [recent, setRecent] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const head = { count: 'exact' as const, head: true }
      const [reqs, pool, partners, listings, reviews, subListings, recentReqs] = await Promise.all([
        supabase.from('service_requests').select('*', head),
        supabase.from('service_requests').select('*', head).eq('assignment_status', 'pool'),
        supabase.from('partners').select('*', head).eq('status', 'active'),
        supabase.from('listings').select('*', head).eq('active', true).eq('status', 'approved'),
        supabase.from('reviews').select('*', head).eq('status', 'pending'),
        supabase.from('listings').select('*', head).eq('status', 'submitted'),
        supabase.from('service_requests').select('*').order('created_at', { ascending: false }).limit(6),
      ])
      setCounts({
        requests: reqs.count ?? 0, pool: pool.count ?? 0, partners: partners.count ?? 0,
        listings: listings.count ?? 0, pendingReviews: reviews.count ?? 0, submittedListings: subListings.count ?? 0,
      })
      setRecent((recentReqs.data as ServiceRequest[]) || [])
      setLoading(false)
    })()
  }, [supabase])

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total requests" value={counts.requests} icon={Inbox} accent="#1D9E75"
          sub={`${counts.pool} waiting in pool`} />
        <StatCard label="Active partners" value={counts.partners} icon={Users} accent="#3b82f6" />
        <StatCard label="Live listings" value={counts.listings} icon={ClipboardList} accent="#8b5cf6"
          sub={counts.submittedListings ? `${counts.submittedListings} awaiting approval` : 'all reviewed'} />
        <StatCard label="Pending reviews" value={counts.pendingReviews} icon={Star} accent="#f59e0b"
          sub={counts.pendingReviews ? 'needs moderation' : 'all clear'} />
      </div>

      {/* Action needed */}
      {(counts.pool > 0 || counts.submittedListings > 0 || counts.pendingReviews > 0) && (
        <div className="flex flex-wrap gap-3">
          {counts.pool > 0 && (
            <button onClick={() => onGo('requests')} className="text-xs bg-[#f0fdf9] text-[#0F6E56] border border-[#1D9E75]/30 px-3 py-1.5 rounded-full hover:bg-[#e1f5ee]">
              {counts.pool} unclaimed request{counts.pool > 1 ? 's' : ''} →
            </button>
          )}
          {counts.submittedListings > 0 && (
            <button onClick={() => onGo('listings')} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full hover:bg-amber-100">
              {counts.submittedListings} listing{counts.submittedListings > 1 ? 's' : ''} to approve →
            </button>
          )}
          {counts.pendingReviews > 0 && (
            <button onClick={() => onGo('reviews')} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full hover:bg-amber-100">
              {counts.pendingReviews} review{counts.pendingReviews > 1 ? 's' : ''} to moderate →
            </button>
          )}
        </div>
      )}

      {/* Recent requests */}
      <div className="bg-white rounded-xl border border-[#edf0f5] shadow-sm">
        <div className="px-5 py-4 border-b border-[#edf0f5] flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Recent requests</h2>
          <button onClick={() => onGo('requests')} className="text-xs text-[#1D9E75] hover:underline">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-[#edf0f5]">
                <th className="px-5 py-2.5 font-medium">Date</th>
                <th className="px-5 py-2.5 font-medium">Name</th>
                <th className="px-5 py-2.5 font-medium">Services</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No requests yet</td></tr>
              )}
              {recent.map(r => (
                <tr key={r.id} className="border-b border-[#f3f5f9] last:border-0">
                  <td className="px-5 py-3 text-gray-400">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3 font-medium text-gray-700">{r.name}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{r.services.slice(0, 2).join(', ')}</td>
                  <td className="px-5 py-3">
                    <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', ASSIGN_COLORS[r.assignment_status])}>
                      {r.assignment_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const ASSIGN_COLORS: Record<string, string> = {
  pool: 'bg-gray-100 text-gray-500',
  claimed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  released: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-100 text-red-600',
}

function RequestsTab() {
  const supabase = useMemo(() => createClient(), [])
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [partners, setPartners] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<ServiceRequest | null>(null)

  const load = useCallback(async () => {
    const [{ data: reqs }, { data: prts }] = await Promise.all([
      supabase.from('service_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('partners').select('id, name'),
    ])
    setRequests(reqs || [])
    setPartners(Object.fromEntries((prts || []).map((p: { id: string; name: string }) => [p.id, p.name])))
  }, [supabase])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, status: ServiceRequest['status']) => {
    await supabase.from('service_requests').update({ status }).eq('id', id)
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev)
    load()
  }

  // Admin override: pull a stuck/claimed request back into the open pool
  const reclaim = async (id: string) => {
    await supabase.from('service_requests')
      .update({ assignment_status: 'pool', assigned_partner_id: null, claimed_at: null })
      .eq('id', id)
    setSelected(null)
    load()
  }

  const STATUS_COLORS: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-amber-100 text-amber-700',
    done: 'bg-green-100 text-green-700',
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB] text-left">
              <th className="pb-3 font-medium text-gray-500">Date</th>
              <th className="pb-3 font-medium text-gray-500">Name</th>
              <th className="pb-3 font-medium text-gray-500">Services</th>
              <th className="pb-3 font-medium text-gray-500">Assigned</th>
              <th className="pb-3 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-gray-400 text-sm">No requests yet</td></tr>
            )}
            {requests.map(r => (
              <tr
                key={r.id}
                onClick={() => setSelected(r)}
                className={clsx(
                  'border-b border-[#E5E7EB] cursor-pointer hover:bg-gray-50',
                  selected?.id === r.id && 'bg-[#f0fdf9]'
                )}
              >
                <td className="py-3 text-gray-400">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="py-3 font-medium">{r.name}</td>
                <td className="py-3 text-gray-500 text-xs">{r.services.slice(0, 2).join(', ')}</td>
                <td className="py-3">
                  <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', ASSIGN_COLORS[r.assignment_status])}>
                    {r.assignment_status}
                  </span>
                  {r.assigned_partner_id && (
                    <span className="block text-[11px] text-gray-400 mt-0.5">{partners[r.assigned_partner_id] || '—'}</span>
                  )}
                </td>
                <td className="py-3">
                  <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[r.status])}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="border border-[#E5E7EB] rounded-xl p-6 space-y-4">
          <div className="flex items-start justify-between">
            <h2 className="font-semibold text-gray-900">{selected.name}</h2>
            <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
          </div>
          <div className="text-sm space-y-2">
            <p><span className="text-gray-400">Services:</span> {selected.services.join(', ')}</p>
            <p><span className="text-gray-400">Timeline:</span> {selected.timeline}</p>
            <p><span className="text-gray-400">Contact:</span> {selected.contact_pref} — {selected.contact_value}</p>
            {selected.details && <p><span className="text-gray-400">Details:</span> {selected.details}</p>}
            {selected.quote && <p><span className="text-gray-400">Quote:</span> {selected.quote}</p>}
            {selected.partner_notes && <p><span className="text-gray-400">Partner notes:</span> {selected.partner_notes}</p>}
            <p className="text-xs text-gray-300">{new Date(selected.created_at).toLocaleString()}</p>
          </div>

          <div className="border-t border-[#E5E7EB] pt-4">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Assignment</p>
            <div className="flex items-center gap-3">
              <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', ASSIGN_COLORS[selected.assignment_status])}>
                {selected.assignment_status}
              </span>
              {selected.assigned_partner_id && (
                <span className="text-sm text-gray-600">{partners[selected.assigned_partner_id] || '—'}</span>
              )}
              {selected.assigned_partner_id && selected.assignment_status !== 'completed' && (
                <button
                  onClick={() => reclaim(selected.id)}
                  className="ml-auto text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-50"
                >
                  Return to pool
                </button>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Update status</p>
            <div className="flex gap-2">
              {(['new', 'in-progress', 'done'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected.id, s)}
                  className={clsx(
                    'text-xs px-3 py-1.5 rounded-full border transition-colors',
                    selected.status === s
                      ? 'bg-[#1D9E75] text-white border-[#1D9E75]'
                      : 'border-[#D1D5DB] text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PartnersTab() {
  const supabase = useMemo(() => createClient(), [])
  const [partners, setPartners] = useState<Partner[]>([])
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<{ name: string; contact_email: string; contact_phone: string; password: string; services: string[] }>(
    { name: '', contact_email: '', contact_phone: '', password: '', services: [] }
  )
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const { data } = await supabase.from('partners').select('*').order('created_at', { ascending: false })
    setPartners((data as Partner[]) || [])
  }, [supabase])

  useEffect(() => { load() }, [load])

  const toggleService = (slug: string) =>
    setForm(f => ({ ...f, services: f.services.includes(slug) ? f.services.filter(s => s !== slug) : [...f.services, slug] }))

  const create = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Failed to create partner'); return }
      setCreating(false)
      setForm({ name: '', contact_email: '', contact_phone: '', password: '', services: [] })
      load()
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (p: Partner) => {
    await supabase.from('partners')
      .update({ status: p.status === 'active' ? 'suspended' : 'active' }).eq('id', p.id)
    load()
  }

  const updateServices = async (p: Partner, slug: string) => {
    const next = p.services.includes(slug) ? p.services.filter(s => s !== slug) : [...p.services, slug]
    await supabase.from('partners').update({ services: next }).eq('id', p.id)
    load()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setCreating(c => !c)}
          className="text-sm font-medium bg-[#1D9E75] text-white px-4 py-2 rounded-full hover:bg-[#0F6E56]">
          {creating ? 'Close' : '+ New partner'}
        </button>
      </div>

      {creating && (
        <div className="border border-[#E5E7EB] rounded-xl p-6 mb-6 bg-white space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Partner name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Login email</label>
              <input type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Phone (optional)</label>
              <input value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Temp password</label>
              <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Services this partner can serve</label>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map(s => (
                <button key={s.slug} type="button" onClick={() => toggleService(s.slug)}
                  className={clsx('text-xs px-3 py-1.5 rounded-full border transition-colors',
                    form.services.includes(s.slug)
                      ? 'bg-[#1D9E75] text-white border-[#1D9E75]'
                      : 'border-[#D1D5DB] text-gray-600 hover:bg-gray-50')}>
                  {s.title}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button onClick={create} disabled={saving}
            className="bg-[#1D9E75] text-white text-sm px-5 py-2 rounded-full hover:bg-[#0F6E56] disabled:opacity-50">
            {saving ? 'Creating…' : 'Create partner + login'}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {partners.length === 0 && <p className="text-center py-12 text-gray-400 text-sm">No partners yet</p>}
        {partners.map(p => (
          <div key={p.id} className="border border-[#E5E7EB] rounded-xl p-5 bg-white">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-500">{p.contact_email}{p.contact_phone ? ` · ${p.contact_phone}` : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium',
                  p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600')}>
                  {p.status}
                </span>
                <button onClick={() => toggleStatus(p)} className="text-xs text-gray-500 hover:text-gray-900">
                  {p.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SERVICES.map(s => (
                <button key={s.slug} onClick={() => updateServices(p, s.slug)}
                  className={clsx('text-[11px] px-2 py-0.5 rounded-full border transition-colors',
                    p.services.includes(s.slug)
                      ? 'bg-[#f0fdf9] text-[#0F6E56] border-[#1D9E75]/30'
                      : 'border-[#E5E7EB] text-gray-400 hover:bg-gray-50')}>
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ListingsTab() {
  const supabase = useMemo(() => createClient(), [])
  const [listings, setListings] = useState<Listing[]>([])
  const [editing, setEditing] = useState<Partial<Listing> | null>(null)

  const load = useCallback(async () => {
    const { data } = await supabase.from('listings').select('*').order('sort_order')
    setListings(data || [])
  }, [supabase])

  useEffect(() => { load() }, [load])

  const moderate = async (id: string, status: 'approved' | 'rejected') => {
    await supabase.from('listings').update({ status }).eq('id', id)
    load()
  }

  const save = async () => {
    if (!editing) return
    if (editing.id) {
      const { id, created_at, ...rest } = editing as Listing
      await supabase.from('listings').update(rest).eq('id', id)
    } else {
      await supabase.from('listings').insert(editing)
    }
    setEditing(null)
    load()
  }

  const toggle = async (id: string, field: 'active' | 'verified', val: boolean) => {
    await supabase.from('listings').update({ [field]: val }).eq('id', id)
    load()
  }

  const FIELDS = ['title', 'service_slug', 'price', 'location', 'area', 'description', 'image_url'] as const

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setEditing({ active: true, verified: false, sort_order: 0 })}
          className="text-sm font-medium bg-[#1D9E75] text-white px-4 py-2 rounded-full hover:bg-[#0F6E56]"
        >
          + New listing
        </button>
      </div>

      {editing && (
        <div className="border border-[#E5E7EB] rounded-xl p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FIELDS.map(f => (
            <div key={f}>
              <label className="text-xs text-gray-400 mb-1 block capitalize">{f.replace(/_/g, ' ')}</label>
              <input
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
                value={(editing as Record<string, string>)[f] || ''}
                onChange={e => setEditing(prev => ({ ...prev, [f]: e.target.value }))}
              />
            </div>
          ))}
          <div className="col-span-full flex gap-3 pt-2">
            <button onClick={save} className="bg-[#1D9E75] text-white text-sm px-5 py-2 rounded-full hover:bg-[#0F6E56]">Save</button>
            <button onClick={() => setEditing(null)} className="border border-[#D1D5DB] text-gray-600 text-sm px-5 py-2 rounded-full hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB] text-left">
              <th className="pb-3 font-medium text-gray-500">Title</th>
              <th className="pb-3 font-medium text-gray-500">Service</th>
              <th className="pb-3 font-medium text-gray-500">Price</th>
              <th className="pb-3 font-medium text-gray-500">Status</th>
              <th className="pb-3 font-medium text-gray-500">Verified</th>
              <th className="pb-3 font-medium text-gray-500">Active</th>
              <th className="pb-3 font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-gray-400 text-sm">No listings yet</td></tr>
            )}
            {listings.map(l => (
              <tr key={l.id} className="border-b border-[#E5E7EB]">
                <td className="py-3 font-medium">{l.title}</td>
                <td className="py-3 text-gray-500">{l.service_slug}</td>
                <td className="py-3 text-gray-500">{l.price}</td>
                <td className="py-3">
                  <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium',
                    l.status === 'approved' ? 'bg-green-100 text-green-700' :
                    l.status === 'submitted' ? 'bg-amber-100 text-amber-700' :
                    l.status === 'rejected' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-500')}>
                    {l.status}
                  </span>
                  {l.status === 'submitted' && (
                    <span className="block mt-1 space-x-2">
                      <button onClick={() => moderate(l.id, 'approved')} className="text-[11px] text-green-700 hover:underline">Approve</button>
                      <button onClick={() => moderate(l.id, 'rejected')} className="text-[11px] text-red-600 hover:underline">Reject</button>
                    </span>
                  )}
                </td>
                <td className="py-3">
                  <input type="checkbox" checked={l.verified} onChange={e => toggle(l.id, 'verified', e.target.checked)} className="accent-[#1D9E75]" />
                </td>
                <td className="py-3">
                  <input type="checkbox" checked={l.active} onChange={e => toggle(l.id, 'active', e.target.checked)} className="accent-[#1D9E75]" />
                </td>
                <td className="py-3">
                  <button onClick={() => setEditing(l)} className="text-xs text-[#1D9E75] hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ReviewsTab() {
  const supabase = useMemo(() => createClient(), [])
  const [reviews, setReviews] = useState<Review[]>([])

  const load = useCallback(async () => {
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
    setReviews(data || [])
  }, [supabase])

  useEffect(() => { load() }, [load])

  const setStatus = async (id: string, status: 'approved' | 'rejected') => {
    await supabase.from('reviews').update({ status }).eq('id', id)
    load()
  }

  return (
    <div className="space-y-4">
      {reviews.length === 0 && (
        <p className="text-center py-12 text-gray-400 text-sm">No reviews yet</p>
      )}
      {reviews.map(r => (
        <div key={r.id} className="border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-amber-400 mb-1 text-sm">{'★'.repeat(r.rating)}</p>
              <p className="text-sm text-gray-700 italic mb-2">&ldquo;{r.quote}&rdquo;</p>
              <p className="text-xs font-medium text-gray-900">{r.author_name}</p>
              {r.author_info && <p className="text-xs text-gray-400">{r.author_info}</p>}
            </div>
            <span className={clsx(
              'text-xs px-2 py-0.5 rounded-full font-medium ml-4 flex-shrink-0',
              r.status === 'approved' ? 'bg-green-100 text-green-700' :
              r.status === 'rejected' ? 'bg-red-100 text-red-600' :
              'bg-amber-100 text-amber-700'
            )}>
              {r.status}
            </span>
          </div>
          {r.status === 'pending' && (
            <div className="flex gap-2 mt-4">
              <button onClick={() => setStatus(r.id, 'approved')} className="text-xs bg-green-50 text-green-700 border border-green-200 px-4 py-1.5 rounded-full hover:bg-green-100">Approve</button>
              <button onClick={() => setStatus(r.id, 'rejected')} className="text-xs bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-full hover:bg-red-100">Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function StatsTab() {
  const supabase = useMemo(() => createClient(), [])
  const [stats, setStats] = useState<SiteStat[]>([])
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('site_stats').select('*').then(({ data }) => setStats(data || []))
  }, [supabase])

  const update = async (key: string, value: string) => {
    setSaving(key)
    await supabase.from('site_stats').update({ value }).eq('key', key)
    setSaving(null)
  }

  return (
    <div className="max-w-md space-y-4">
      <p className="text-sm text-gray-500">Changes save on blur (clicking away from field).</p>
      {stats.map(s => (
        <div key={s.key} className="flex items-center gap-4">
          <label className="text-sm text-gray-500 w-36 flex-shrink-0">{s.label || s.key}</label>
          <input
            className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
            defaultValue={s.value}
            onBlur={e => {
              if (e.target.value !== s.value) update(s.key, e.target.value)
            }}
          />
          {saving === s.key && <span className="text-xs text-[#1D9E75]">✓ Saved</span>}
        </div>
      ))}
    </div>
  )
}

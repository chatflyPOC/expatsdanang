'use client'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Business, BusinessCategory, BusinessStatus, EnglishLevel, PaymentMethod,
  CATEGORIES, DISTRICTS, AMENITIES, PAYMENT_LABELS, ENGLISH_LEVEL_LABELS, englishLabel,
  verificationState,
} from '@/types/directory'
import { clsx } from 'clsx'
import {
  Plus, X, Upload, Pencil, Trash2, Eye, Loader2, ChevronDown, ChevronUp,
  Image as ImageIcon, ToggleLeft, ToggleRight, BadgeCheck,
} from 'lucide-react'
import { revalidatePublic } from '@/lib/revalidate'

type FullBusiness = Business & {
  owner_name?: string | null
  owner_phone?: string | null
  owner_zalo?: string | null
  admin_notes?: string | null
}

const ALL_COLUMNS = [
  'id', 'created_at', 'updated_at', 'slug', 'name', 'category',
  'short_description', 'description',
  'district', 'district_label', 'address', 'lat', 'lng',
  'phone', 'website', 'maps_url', 'facebook', 'zalo', 'email', 'hours',
  'english_level', 'price_level', 'payment_methods', 'amenities', 'good_for',
  'images', 'cover_image_index',
  'verified', 'verified_at', 'verified_note', 'claimed_by',
  'status', 'featured', 'sort_order', 'view_count',
  'owner_name', 'owner_phone', 'owner_zalo', 'admin_notes',
].join(', ')

const EMPTY: Partial<FullBusiness> = {
  slug: '', name: '', category: 'healthcare',
  short_description: '', description: '',
  district: 'an-thuong', district_label: 'An Thuong', address: '',
  phone: '', website: '', maps_url: '', facebook: '', zalo: '', email: '', hours: '',
  english_level: null, price_level: 1,
  payment_methods: ['cash'], amenities: [], good_for: [],
  images: [], cover_image_index: 0,
  verified: false, verified_at: null, verified_note: '',
  status: 'draft', featured: false, sort_order: 0,
}

const STATUS_META: Record<BusinessStatus, { label: string; color: string }> = {
  published: { label: 'Published', color: 'bg-green-100 text-green-700 border-green-200' },
  draft: { label: 'Draft', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  hidden: { label: 'Hidden', color: 'bg-gray-100 text-gray-500 border-gray-200' },
  closed: { label: 'Closed down', color: 'bg-red-100 text-red-600 border-red-200' },
}

const INPUT =
  'w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]/20 bg-white'

/** Mirrors the slug rules the public routes rely on: lowercase, dash-separated. */
function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function Section({
  title, children, defaultOpen = true,
}: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
      >
        {title}
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="p-4 space-y-4">{children}</div>}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
      {children}
    </div>
  )
}

function Toggle({
  checked, onChange, label,
}: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={clsx(
        'flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors',
        checked
          ? 'bg-[#E1F5EE] border-[#1D9E75] text-[#085041]'
          : 'border-[#E5E7EB] text-gray-500 hover:bg-gray-50'
      )}
    >
      {checked ? <ToggleRight size={16} className="text-[#1D9E75]" /> : <ToggleLeft size={16} className="text-gray-400" />}
      {label}
    </button>
  )
}

function MultiChips<T extends string>({
  options, selected, onChange,
}: {
  options: { value: T; label: string }[]
  selected: T[]
  onChange: (next: T[]) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = selected.includes(o.value)
        return (
          <button
            key={o.value}
            type="button"
            onClick={() =>
              onChange(active ? selected.filter((s) => s !== o.value) : [...selected, o.value])
            }
            className={clsx(
              'text-xs px-3 py-1.5 rounded-full border transition-colors',
              active
                ? 'bg-[#1D9E75] text-white border-[#1D9E75]'
                : 'border-[#E5E7EB] text-gray-600 bg-white hover:border-[#1D9E75]'
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function PhotoSection({
  images, coverIndex, onImagesChange, onCoverChange,
}: {
  images: string[]
  coverIndex: number
  onImagesChange: (imgs: string[]) => void
  onCoverChange: (idx: number) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [newUrl, setNewUrl] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const fd = new FormData()
          fd.append('file', file)
          fd.append('folder', 'directory/images')
          const res = await fetch('/api/upload', { method: 'POST', body: fd })
          if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            throw new Error(err.error ?? 'Upload failed')
          }
          const { url } = await res.json()
          return url as string
        })
      )
      onImagesChange([...images, ...urls])
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const removeImage = (i: number) => {
    const next = images.filter((_, idx) => idx !== i)
    onImagesChange(next)
    if (coverIndex >= next.length) onCoverChange(Math.max(0, next.length - 1))
  }

  return (
    <div className="space-y-3">
      {images.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {images.map((url, i) => (
            <div key={`${url}-${i}`} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`photo ${i + 1}`}
                onClick={() => onCoverChange(i)}
                className={clsx(
                  'w-full aspect-square object-cover rounded-lg border-2 cursor-pointer transition-all',
                  coverIndex === i
                    ? 'border-[#1D9E75] ring-2 ring-[#1D9E75]/30'
                    : 'border-[#E5E7EB] hover:border-[#1D9E75]/40'
                )}
              />
              {coverIndex === i && (
                <span className="absolute bottom-1 left-1 text-[9px] bg-[#1D9E75] text-white px-1.5 py-0.5 rounded font-semibold">
                  COVER
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full hidden group-hover:flex items-center justify-center"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400">
          <ImageIcon size={28} />
          <p className="text-xs">No photos yet — upload or paste a URL</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 text-sm border border-[#E5E7EB] px-3 py-2 rounded-lg text-gray-600 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          Upload photos
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
        <div className="flex gap-1.5 flex-1 min-w-[200px]">
          <input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://…"
            className={INPUT}
          />
          <button
            type="button"
            onClick={() => {
              if (!newUrl.trim()) return
              onImagesChange([...images, newUrl.trim()])
              setNewUrl('')
            }}
            className="text-sm border border-[#E5E7EB] px-3 rounded-lg text-gray-600 hover:border-[#1D9E75] transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export function DirectoryTab() {
  const supabase = useMemo(() => createClient(), [])
  const [rows, setRows] = useState<FullBusiness[]>([])
  const [editing, setEditing] = useState<Partial<FullBusiness> | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [statusFilter, setStatusFilter] = useState<BusinessStatus | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<BusinessCategory | 'all'>('all')

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('businesses')
      .select(ALL_COLUMNS)
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true })
    setRows((data as unknown as FullBusiness[]) || [])
  }, [supabase])

  useEffect(() => {
    load()
  }, [load])

  const set = <K extends keyof FullBusiness>(key: K, val: FullBusiness[K]) =>
    setEditing((prev) => (prev ? { ...prev, [key]: val } : prev))

  const openNew = () => {
    setEditing({ ...EMPTY })
    setSaveError('')
  }
  const openEdit = (row: FullBusiness) => {
    setEditing({ ...row })
    setSaveError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const togglePublished = async (row: FullBusiness) => {
    const next: BusinessStatus = row.status === 'published' ? 'hidden' : 'published'
    await supabase.from('businesses').update({ status: next }).eq('id', row.id)
    await revalidatePublic('directory')
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this business? This cannot be undone.')) return
    await supabase.from('businesses').delete().eq('id', id)
    await revalidatePublic('directory')
    if (editing && (editing as FullBusiness).id === id) setEditing(null)
    load()
  }

  const save = async () => {
    if (!editing) return
    setSaving(true)
    setSaveError('')
    try {
      if (!editing.name?.trim()) throw new Error('Name is required')

      const slug = slugify(editing.slug?.trim() || editing.name)
      if (!slug) throw new Error('Could not build a slug from that name — set one manually')

      const district = DISTRICTS.find((d) => d.value === editing.district)
      const payload = {
        ...editing,
        slug,
        district_label: district?.label ?? editing.district_label ?? '',
        // The badge is driven by the date, so a business marked verified
        // without one would show as unverified and look broken.
        verified_at: editing.verified
          ? editing.verified_at ?? new Date().toISOString().slice(0, 10)
          : null,
      }

      const {
        id, created_at, updated_at, view_count, claimed_by, ...rest
      } = payload as FullBusiness

      const { error } = editing.id
        ? await supabase.from('businesses').update(rest).eq('id', id)
        : await supabase.from('businesses').insert(rest)

      if (error) throw new Error(error.message)

      await revalidatePublic('directory')
      setEditing(null)
      load()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const filtered = rows.filter(
    (r) =>
      (statusFilter === 'all' || r.status === statusFilter) &&
      (categoryFilter === 'all' || r.category === categoryFilter)
  )

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap gap-2">
          {(['all', 'published', 'draft', 'hidden', 'closed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx(
                'text-xs px-3 py-1.5 rounded-full border transition-colors',
                statusFilter === s
                  ? 'bg-[#1D9E75] text-white border-[#1D9E75]'
                  : 'border-[#E5E7EB] text-gray-600 hover:bg-gray-50'
              )}
            >
              {s === 'all'
                ? `All (${rows.length})`
                : `${STATUS_META[s].label} (${rows.filter((r) => r.status === s).length})`}
            </button>
          ))}
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 text-sm font-medium bg-[#1D9E75] text-white px-4 py-2 rounded-full hover:bg-[#0F6E56] transition-colors"
        >
          <Plus size={15} /> Add business
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategoryFilter('all')}
          className={clsx(
            'text-xs px-3 py-1 rounded-full border transition-colors',
            categoryFilter === 'all'
              ? 'bg-gray-800 text-white border-gray-800'
              : 'border-[#E5E7EB] text-gray-500 hover:bg-gray-50'
          )}
        >
          All categories
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCategoryFilter(c.slug)}
            className={clsx(
              'text-xs px-3 py-1 rounded-full border transition-colors',
              categoryFilter === c.slug
                ? 'bg-gray-800 text-white border-gray-800'
                : 'border-[#E5E7EB] text-gray-500 hover:bg-gray-50'
            )}
          >
            {c.label} ({rows.filter((r) => r.category === c.slug).length})
          </button>
        ))}
      </div>

      {/* Form */}
      {editing && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] bg-gray-50">
            <div>
              <h2 className="font-semibold text-gray-900">
                {editing.id ? 'Edit business' : 'Add business'}
              </h2>
              {editing.slug && (
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  /directory/{editing.category}/{editing.slug}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <select
                value={editing.status ?? 'draft'}
                onChange={(e) => set('status', e.target.value as BusinessStatus)}
                className="text-xs border border-[#E5E7EB] rounded-lg px-2 py-1.5 outline-none focus:border-[#1D9E75] bg-white"
              >
                {Object.entries(STATUS_META).map(([v, m]) => (
                  <option key={v} value={v}>{m.label}</option>
                ))}
              </select>
              <button
                onClick={() => setEditing(null)}
                className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            <Section title="1. Identity">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name *">
                  <input
                    className={INPUT}
                    value={editing.name ?? ''}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="Clinic or shop name"
                  />
                </Field>
                <Field label="Category *">
                  <select
                    className={INPUT}
                    value={editing.category ?? 'healthcare'}
                    onChange={(e) => set('category', e.target.value as BusinessCategory)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="URL slug (blank = from name)">
                  <input
                    className={INPUT}
                    value={editing.slug ?? ''}
                    onChange={(e) => set('slug', e.target.value)}
                    onBlur={(e) => set('slug', slugify(e.target.value))}
                    placeholder="example-dental-clinic-an-thuong"
                  />
                </Field>
                <Field label="Sort order (lower shows first)">
                  <input
                    type="number"
                    className={INPUT}
                    value={editing.sort_order ?? 0}
                    onChange={(e) => set('sort_order', Number(e.target.value) || 0)}
                  />
                </Field>
                <Field label="One-line summary (shown on cards)">
                  <input
                    className={INPUT}
                    value={editing.short_description ?? ''}
                    onChange={(e) => set('short_description', e.target.value)}
                    placeholder="Dentist with English-speaking staff and posted prices."
                  />
                </Field>
                <Field label="Longer notes (detail page)">
                  <textarea
                    rows={3}
                    className={INPUT}
                    value={editing.description ?? ''}
                    onChange={(e) => set('description', e.target.value)}
                    placeholder="What we found, what to expect, anything an expat should know."
                  />
                </Field>
              </div>
            </Section>

            <Section title="2. Location & contact">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Area *">
                  <select
                    className={INPUT}
                    value={editing.district ?? 'an-thuong'}
                    onChange={(e) => {
                      const d = DISTRICTS.find((x) => x.value === e.target.value)
                      setEditing((prev) =>
                        prev ? { ...prev, district: e.target.value, district_label: d?.label ?? '' } : prev
                      )
                    }}
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Street address (public)">
                  <input
                    className={INPUT}
                    value={editing.address ?? ''}
                    onChange={(e) => set('address', e.target.value)}
                    placeholder="123 Nguyen Van Thoai"
                  />
                </Field>
                <Field label="Google Maps link">
                  <input
                    className={INPUT}
                    value={editing.maps_url ?? ''}
                    onChange={(e) => set('maps_url', e.target.value)}
                  />
                </Field>
                <Field label="Opening hours (free text)">
                  <input
                    className={INPUT}
                    value={editing.hours ?? ''}
                    onChange={(e) => set('hours', e.target.value)}
                    placeholder="Mon-Sat 08:00-18:00"
                  />
                </Field>
                <Field label="Phone">
                  <input className={INPUT} value={editing.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
                </Field>
                <Field label="Zalo">
                  <input className={INPUT} value={editing.zalo ?? ''} onChange={(e) => set('zalo', e.target.value)} />
                </Field>
                <Field label="Website">
                  <input className={INPUT} value={editing.website ?? ''} onChange={(e) => set('website', e.target.value)} />
                </Field>
                <Field label="Facebook">
                  <input className={INPUT} value={editing.facebook ?? ''} onChange={(e) => set('facebook', e.target.value)} />
                </Field>
                <Field label="Email">
                  <input className={INPUT} value={editing.email ?? ''} onChange={(e) => set('email', e.target.value)} />
                </Field>
                <Field label="Latitude / Longitude">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      className={INPUT}
                      value={editing.lat ?? ''}
                      onChange={(e) => set('lat', e.target.value === '' ? null : Number(e.target.value))}
                      placeholder="16.0544"
                    />
                    <input
                      type="number"
                      step="any"
                      className={INPUT}
                      value={editing.lng ?? ''}
                      onChange={(e) => set('lng', e.target.value === '' ? null : Number(e.target.value))}
                      placeholder="108.2022"
                    />
                  </div>
                </Field>
              </div>
            </Section>

            <Section title="3. Expat attributes">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="English level">
                  <select
                    className={INPUT}
                    value={editing.english_level ?? ''}
                    onChange={(e) =>
                      set('english_level', (e.target.value || null) as EnglishLevel | null)
                    }
                  >
                    {/* Blank is the honest default: the card drops the chip
                        rather than showing a level nobody has checked. */}
                    <option value="">Not checked yet</option>
                    {Object.entries(ENGLISH_LEVEL_LABELS).map(([v, label]) => (
                      <option key={v} value={v}>{label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Price level">
                  <select
                    className={INPUT}
                    value={editing.price_level ?? ''}
                    onChange={(e) => set('price_level', e.target.value === '' ? null : Number(e.target.value))}
                  >
                    <option value="">Not recorded</option>
                    <option value="1">$ — cheap</option>
                    <option value="2">$$ — mid</option>
                    <option value="3">$$$ — expensive</option>
                  </select>
                </Field>
              </div>
              <Field label="Payment methods">
                <MultiChips
                  options={(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((v) => ({
                    value: v,
                    label: PAYMENT_LABELS[v],
                  }))}
                  selected={(editing.payment_methods ?? []) as PaymentMethod[]}
                  onChange={(next) => set('payment_methods', next)}
                />
              </Field>
              <Field label="Confirmed attributes">
                <MultiChips
                  options={AMENITIES.map((a) => ({ value: a.key, label: a.label }))}
                  selected={editing.amenities ?? []}
                  onChange={(next) => set('amenities', next)}
                />
              </Field>
              <Field label="Good for (comma-separated chips)">
                <input
                  className={INPUT}
                  value={(editing.good_for ?? []).join(', ')}
                  onChange={(e) =>
                    set(
                      'good_for',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  placeholder="Check-ups, Fillings"
                />
              </Field>
            </Section>

            <Section title="4. Verification">
              <div className="flex flex-wrap items-end gap-4">
                <Toggle
                  checked={!!editing.verified}
                  onChange={(v) => set('verified', v)}
                  label="✅ Verified by us"
                />
                <Field label="Verified on">
                  <input
                    type="date"
                    className={INPUT}
                    value={editing.verified_at ?? ''}
                    onChange={(e) => set('verified_at', e.target.value || null)}
                  />
                </Field>
                <Toggle
                  checked={!!editing.featured}
                  onChange={(v) => set('featured', v)}
                  label="⭐ Featured"
                />
              </div>
              <Field label="Notes from the visit (shown publicly)">
                <textarea
                  rows={2}
                  className={INPUT}
                  value={editing.verified_note ?? ''}
                  onChange={(e) => set('verified_note', e.target.value)}
                  placeholder="Visited Oct 2026 — reception speaks English, card machine working, prices on the wall."
                />
              </Field>
              <p className="text-xs text-gray-400">
                The public badge reads the date, and drops off by itself once the check is
                more than six months old.
              </p>
            </Section>

            <Section title="5. Photos">
              <PhotoSection
                images={editing.images ?? []}
                coverIndex={editing.cover_image_index ?? 0}
                onImagesChange={(imgs) => set('images', imgs)}
                onCoverChange={(idx) => set('cover_image_index', idx)}
              />
            </Section>

            <Section title="6. Admin only (not shown publicly)" defaultOpen={false}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Owner name">
                  <input className={INPUT} value={editing.owner_name ?? ''} onChange={(e) => set('owner_name', e.target.value)} />
                </Field>
                <Field label="Owner phone">
                  <input className={INPUT} value={editing.owner_phone ?? ''} onChange={(e) => set('owner_phone', e.target.value)} />
                </Field>
                <Field label="Owner Zalo">
                  <input className={INPUT} value={editing.owner_zalo ?? ''} onChange={(e) => set('owner_zalo', e.target.value)} />
                </Field>
                <Field label="Internal notes">
                  <textarea rows={2} className={INPUT} value={editing.admin_notes ?? ''} onChange={(e) => set('admin_notes', e.target.value)} />
                </Field>
              </div>
            </Section>

            {saveError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                {saveError}
              </div>
            )}

            <div className="flex gap-3 pt-2 border-t border-[#E5E7EB]">
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 bg-[#1D9E75] text-white text-sm px-6 py-2.5 rounded-full hover:bg-[#0F6E56] disabled:opacity-50 transition-colors"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? 'Saving…' : editing.id ? 'Update business' : 'Create business'}
              </button>
              <button
                onClick={() => setEditing(null)}
                className="border border-[#D1D5DB] text-gray-600 text-sm px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-sm">No businesses match this filter</p>
            <p className="text-xs mt-1">
              Run migration 007_directory.sql in Supabase if the table is missing
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-[#E5E7EB]">
                <tr className="text-left text-gray-500 text-xs">
                  <th className="px-4 py-3 font-medium">Business</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Area</th>
                  <th className="px-4 py-3 font-medium">English</th>
                  <th className="px-4 py-3 font-medium">Verified</th>
                  <th className="px-4 py-3 font-medium">Views</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Publish</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const meta = STATUS_META[row.status]
                  const verification = verificationState(row)
                  const published = row.status === 'published'
                  return (
                    <tr key={row.id} className="border-b border-[#F3F5F9] last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {row.images?.[row.cover_image_index ?? 0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={row.images[row.cover_image_index ?? 0]}
                              alt=""
                              className="w-10 h-10 object-cover rounded-lg border border-[#E5E7EB] flex-none"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg border border-[#E5E7EB] flex-none flex items-center justify-center">
                              <ImageIcon size={14} className="text-gray-300" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{row.name}</p>
                            <p className="text-xs text-gray-400 font-mono truncate max-w-[200px]">{row.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {CATEGORIES.find((c) => c.slug === row.category)?.label ?? row.category}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{row.district_label}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {englishLabel(row.english_level) ?? (
                          <span className="text-gray-300">not checked</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {verification.current ? (
                          <span className="inline-flex items-center gap-1 text-[#0F6E56]">
                            <BadgeCheck size={12} /> {verification.label}
                          </span>
                        ) : verification.stale ? (
                          <span className="text-amber-600">Stale ({verification.label})</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        <span className="flex items-center gap-1">
                          <Eye size={12} /> {row.view_count ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={clsx('text-[11px] px-2 py-0.5 rounded-full border font-medium', meta.color)}>
                          {meta.label}
                        </span>
                        {row.featured && <span className="ml-1 text-[10px] text-amber-600">⭐</span>}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => togglePublished(row)}
                          title={published ? 'Unpublish' : 'Publish'}
                          className={clsx(
                            'flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border transition-colors',
                            published
                              ? 'bg-green-50 border-green-200 text-green-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
                              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-green-50 hover:border-green-200 hover:text-green-700'
                          )}
                        >
                          {published ? <><ToggleRight size={13} /> Live</> : <><ToggleLeft size={13} /> Off</>}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openEdit(row)}
                            className="flex items-center gap-1 text-xs text-[#1D9E75] hover:underline"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            onClick={() => remove(row.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

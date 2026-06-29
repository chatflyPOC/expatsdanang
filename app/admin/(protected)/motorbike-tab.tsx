'use client'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  MotorbikeListing, MotorbikeStatus, MotorbikeType, MotorbikeCondition,
  DISTRICTS, MOTORBIKE_TYPES, CONDITION_LABELS,
} from '@/types/motorbike'
import { clsx } from 'clsx'
import {
  Plus, X, Upload, Video, Eye, Pencil, ChevronDown, ChevronUp,
  Image as ImageIcon, Loader2, ToggleLeft, ToggleRight, Trash2,
} from 'lucide-react'

// ── Admin-extended type ──────────────────────────────────────────────────────
type FullListing = MotorbikeListing & {
  owner_name?: string | null
  owner_phone?: string | null
  owner_zalo?: string | null
  pickup_address_exact?: string | null
  commission_note?: string | null
  admin_notes?: string | null
}

const ALL_COLUMNS = [
  'id', 'created_at', 'title', 'brand', 'model', 'type', 'engine_cc', 'year_made',
  'condition', 'color', 'district', 'district_label',
  'price_per_day_usd', 'price_per_week_usd', 'price_per_month_usd', 'deposit_usd',
  'helmet_included', 'lock_included', 'raincoat_included', 'insurance_included',
  'delivery_available', 'delivery_fee_usd',
  'gps_tracker', 'phone_holder', 'usb_charger', 'top_box',
  'min_rental_days', 'available_date', 'notes',
  'images', 'video_url', 'cover_image_index',
  'status', 'featured', 'view_count', 'inquiry_count',
  'owner_name', 'owner_phone', 'owner_zalo',
  'pickup_address_exact', 'commission_note', 'admin_notes',
].join(', ')

const EMPTY: Partial<FullListing> = {
  title: '', brand: '', model: '',
  type: 'scooter', condition: 'like-new', color: '',
  engine_cc: null, year_made: null,
  district: 'an-thuong', district_label: 'An Thuong',
  price_per_day_usd: 0, price_per_week_usd: null, price_per_month_usd: null, deposit_usd: 50,
  helmet_included: false, lock_included: false, raincoat_included: false, insurance_included: false,
  delivery_available: false, delivery_fee_usd: null,
  gps_tracker: false, phone_holder: false, usb_charger: false, top_box: false,
  min_rental_days: 1, available_date: null, notes: null,
  images: [], video_url: null, cover_image_index: 0,
  status: 'available', featured: false,
}

const STATUS_META: Record<MotorbikeStatus, { label: string; color: string }> = {
  available:   { label: 'Available',    color: 'bg-green-100 text-green-700 border-green-200' },
  rented:      { label: 'Rented',       color: 'bg-blue-100 text-blue-700 border-blue-200' },
  maintenance: { label: 'Maintenance',  color: 'bg-amber-100 text-amber-700 border-amber-200' },
  hidden:      { label: 'Hidden',       color: 'bg-gray-100 text-gray-500 border-gray-200' },
}

// ── UI helpers ───────────────────────────────────────────────────────────────
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
      <button type="button" onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
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

const INPUT = "w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]/20 bg-white"

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={clsx(
        'flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors',
        checked ? 'bg-[#E1F5EE] border-[#1D9E75] text-[#085041]' : 'border-[#E5E7EB] text-gray-500 hover:bg-gray-50'
      )}>
      {checked ? <ToggleRight size={16} className="text-[#1D9E75]" /> : <ToggleLeft size={16} className="text-gray-400" />}
      {label}
    </button>
  )
}

// ── Media ────────────────────────────────────────────────────────────────────
function MediaSection({ images, videoUrl, coverIndex, onImagesChange, onVideoChange, onCoverChange }: {
  images: string[]
  videoUrl: string | null
  coverIndex: number
  onImagesChange: (imgs: string[]) => void
  onVideoChange: (url: string | null) => void
  onCoverChange: (idx: number) => void
}) {
  const imgRef = useRef<HTMLInputElement>(null)
  const vidRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<'image' | 'video' | null>(null)
  const [newUrl, setNewUrl] = useState('')

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', `motorbike/${folder}`)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? 'Upload failed')
    }
    const { url } = await res.json()
    return url
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading('image')
    try {
      const urls = await Promise.all(files.map(f => uploadFile(f, 'images')))
      onImagesChange([...images, ...urls])
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(null)
      if (imgRef.current) imgRef.current.value = ''
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading('video')
    try {
      onVideoChange(await uploadFile(file, 'videos'))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(null)
      if (vidRef.current) vidRef.current.value = ''
    }
  }

  const removeImage = (i: number) => {
    const next = images.filter((_, idx) => idx !== i)
    onImagesChange(next)
    if (coverIndex >= next.length) onCoverChange(Math.max(0, next.length - 1))
  }

  return (
    <div className="space-y-5">
      {/* Photos */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Photos</p>
        {images.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
            {images.map((url, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`photo ${i + 1}`}
                  className={clsx('w-full aspect-square object-cover rounded-lg border-2 cursor-pointer transition-all',
                    coverIndex === i ? 'border-[#1D9E75] ring-2 ring-[#1D9E75]/30' : 'border-[#E5E7EB] hover:border-[#1D9E75]/40')}
                  onClick={() => onCoverChange(i)} />
                {coverIndex === i && (
                  <span className="absolute bottom-1 left-1 text-[9px] bg-[#1D9E75] text-white px-1.5 py-0.5 rounded font-semibold">COVER</span>
                )}
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full hidden group-hover:flex items-center justify-center">
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 mb-3">
            <ImageIcon size={28} />
            <p className="text-xs">No photos yet — upload or paste URL below</p>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => imgRef.current?.click()} disabled={uploading === 'image'}
            className="flex items-center gap-2 text-sm border border-[#E5E7EB] px-3 py-2 rounded-lg text-gray-600 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors disabled:opacity-50">
            {uploading === 'image' ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            Upload photos
          </button>
          <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          <div className="flex gap-1.5 flex-1 min-w-[200px]">
            <input value={newUrl} onChange={e => setNewUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), newUrl.trim() && (onImagesChange([...images, newUrl.trim()]), setNewUrl('')))}
              placeholder="Paste image URL…"
              className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]" />
            <button type="button" onClick={() => { if (newUrl.trim()) { onImagesChange([...images, newUrl.trim()]); setNewUrl('') } }}
              disabled={!newUrl.trim()}
              className="px-3 py-2 bg-[#1D9E75] text-white rounded-lg text-sm hover:bg-[#0F6E56] disabled:opacity-40 transition-colors">
              <Plus size={14} />
            </button>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 mt-1.5">Click a photo to set as cover.</p>
      </div>

      {/* Video */}
      <div className="border-t border-[#E5E7EB] pt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Video tour</p>
        {videoUrl && (
          <div className="flex items-center gap-3 bg-gray-50 border border-[#E5E7EB] rounded-lg px-3 py-2.5 mb-3">
            <Video size={16} className="text-[#1D9E75] flex-none" />
            <a href={videoUrl} target="_blank" rel="noopener noreferrer"
              className="flex-1 text-xs text-blue-600 underline truncate">{videoUrl}</a>
            <button type="button" onClick={() => onVideoChange(null)} className="text-gray-400 hover:text-red-500 transition-colors">
              <X size={14} />
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => vidRef.current?.click()} disabled={uploading === 'video'}
            className="flex items-center gap-2 text-sm border border-[#E5E7EB] px-3 py-2 rounded-lg text-gray-600 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors disabled:opacity-50">
            {uploading === 'video' ? <Loader2 size={14} className="animate-spin" /> : <Video size={14} />}
            Upload video
          </button>
          <input ref={vidRef} type="file" accept="video/mp4,video/webm,video/mov" className="hidden" onChange={handleVideoUpload} />
          <input value={videoUrl ?? ''} onChange={e => onVideoChange(e.target.value || null)}
            placeholder="Or paste YouTube / Vimeo URL…"
            className="flex-1 min-w-[200px] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]" />
        </div>
        <p className="text-[11px] text-gray-400 mt-1.5">MP4, WebM, MOV — max 100 MB. Or paste a YouTube/Vimeo URL.</p>
      </div>
    </div>
  )
}

// ── Main MotorbikeTab ────────────────────────────────────────────────────────
export function MotorbikeTab() {
  const supabase = useMemo(() => createClient(), [])
  const [listings, setListings] = useState<FullListing[]>([])
  const [editing, setEditing] = useState<Partial<FullListing> | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [filter, setFilter] = useState<MotorbikeStatus | 'all'>('all')

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('motorbike_listings')
      .select(ALL_COLUMNS)
      .order('created_at', { ascending: false })
    setListings((data as unknown as FullListing[]) || [])
  }, [supabase])

  useEffect(() => { load() }, [load])

  const openNew = () => { setEditing({ ...EMPTY }); setSaveError('') }
  const openEdit = (l: FullListing) => { setEditing({ ...l }); setSaveError(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const set = <K extends keyof FullListing>(key: K, val: FullListing[K]) =>
    setEditing(prev => prev ? { ...prev, [key]: val } : prev)

  const toggleStatus = async (id: string, current: MotorbikeStatus) => {
    const next: MotorbikeStatus = current === 'available' ? 'hidden' : 'available'
    await supabase.from('motorbike_listings').update({ status: next }).eq('id', id)
    load()
  }

  const deleteListing = async (id: string) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return
    await supabase.from('motorbike_listings').delete().eq('id', id)
    if (editing && (editing as FullListing).id === id) setEditing(null)
    load()
  }

  const save = async () => {
    if (!editing) return
    setSaving(true); setSaveError('')
    try {
      const districtObj = DISTRICTS.find(d => d.value === editing.district)
      const payload = { ...editing, district_label: districtObj?.label ?? editing.district_label ?? '' }
      if (editing.id) {
        const { id, created_at, view_count, inquiry_count, ...rest } = payload as FullListing
        await supabase.from('motorbike_listings').update(rest).eq('id', id)
      } else {
        const { id, created_at, view_count, inquiry_count, ...rest } = payload as FullListing
        await supabase.from('motorbike_listings').insert(rest)
      }
      setEditing(null); load()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const filtered = filter === 'all' ? listings : listings.filter(l => l.status === filter)

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap gap-2">
          {(['all', 'available', 'rented', 'maintenance', 'hidden'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={clsx('text-xs px-3 py-1.5 rounded-full border transition-colors',
                filter === s ? 'bg-[#1D9E75] text-white border-[#1D9E75]' : 'border-[#E5E7EB] text-gray-600 hover:bg-gray-50')}>
              {s === 'all'
                ? `All (${listings.length})`
                : `${STATUS_META[s].label} (${listings.filter(l => l.status === s).length})`}
            </button>
          ))}
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 text-sm font-medium bg-[#1D9E75] text-white px-4 py-2 rounded-full hover:bg-[#0F6E56] transition-colors">
          <Plus size={15} /> Add bike
        </button>
      </div>

      {/* Form */}
      {editing && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] bg-gray-50">
            <div>
              <h2 className="font-semibold text-gray-900">{editing.id ? 'Edit bike' : 'Add new bike'}</h2>
              {editing.id && <p className="text-xs text-gray-400 font-mono mt-0.5">{editing.id}</p>}
            </div>
            <div className="flex items-center gap-3">
              <select value={editing.status ?? 'available'} onChange={e => set('status', e.target.value as MotorbikeStatus)}
                className="text-xs border border-[#E5E7EB] rounded-lg px-2 py-1.5 outline-none focus:border-[#1D9E75] bg-white">
                {Object.entries(STATUS_META).map(([v, m]) => (
                  <option key={v} value={v}>{m.label}</option>
                ))}
              </select>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">

            {/* 1. Bike info */}
            <Section title="1. Bike info">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Title *">
                  <input className={INPUT} value={editing.title ?? ''} onChange={e => set('title', e.target.value)}
                    placeholder="Honda Air Blade 125 — Automatic Scooter" />
                </Field>
                <Field label="Type *">
                  <select className={INPUT} value={editing.type ?? 'scooter'} onChange={e => set('type', e.target.value as MotorbikeType)}>
                    {MOTORBIKE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label} — {t.desc}</option>)}
                  </select>
                </Field>
                <Field label="Brand *">
                  <input className={INPUT} value={editing.brand ?? ''} onChange={e => set('brand', e.target.value)} placeholder="Honda" />
                </Field>
                <Field label="Model *">
                  <input className={INPUT} value={editing.model ?? ''} onChange={e => set('model', e.target.value)} placeholder="Air Blade 125" />
                </Field>
                <Field label="Engine (cc)">
                  <input type="number" className={INPUT} value={editing.engine_cc ?? ''} onChange={e => set('engine_cc', Number(e.target.value) || null)} placeholder="125" />
                </Field>
                <Field label="Year made">
                  <input type="number" className={INPUT} value={editing.year_made ?? ''} onChange={e => set('year_made', Number(e.target.value) || null)} placeholder="2023" />
                </Field>
                <Field label="Condition *">
                  <select className={INPUT} value={editing.condition ?? 'like-new'} onChange={e => set('condition', e.target.value as MotorbikeCondition)}>
                    {Object.entries(CONDITION_LABELS).map(([v, m]) => <option key={v} value={v}>{m.label}</option>)}
                  </select>
                </Field>
                <Field label="Color">
                  <input className={INPUT} value={editing.color ?? ''} onChange={e => set('color', e.target.value || null)} placeholder="Pearl White" />
                </Field>
              </div>
            </Section>

            {/* 2. Location */}
            <Section title="2. Pickup location">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Pickup area *">
                  <select className={INPUT} value={editing.district ?? 'an-thuong'}
                    onChange={e => {
                      const d = DISTRICTS.find(x => x.value === e.target.value)
                      setEditing(prev => prev ? { ...prev, district: e.target.value, district_label: d?.label ?? '' } : prev)
                    }}>
                    {DISTRICTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </Field>
                <Field label="Exact pickup address (admin only)">
                  <input className={INPUT} value={editing.pickup_address_exact ?? ''} onChange={e => set('pickup_address_exact', e.target.value || null)} placeholder="123 Nguyen Van Linh, My Khe" />
                </Field>
              </div>
            </Section>

            {/* 3. Pricing */}
            <Section title="3. Pricing">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Field label="Price / day (USD) *">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" className={INPUT + ' pl-6'} value={editing.price_per_day_usd ?? ''} onChange={e => set('price_per_day_usd', Number(e.target.value))} placeholder="7" />
                  </div>
                </Field>
                <Field label="Price / week (USD)">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" className={INPUT + ' pl-6'} value={editing.price_per_week_usd ?? ''} onChange={e => set('price_per_week_usd', Number(e.target.value) || null)} placeholder="40" />
                  </div>
                </Field>
                <Field label="Price / month (USD)">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" className={INPUT + ' pl-6'} value={editing.price_per_month_usd ?? ''} onChange={e => set('price_per_month_usd', Number(e.target.value) || null)} placeholder="120" />
                  </div>
                </Field>
                <Field label="Deposit (USD) *">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" className={INPUT + ' pl-6'} value={editing.deposit_usd ?? ''} onChange={e => set('deposit_usd', Number(e.target.value))} placeholder="50" />
                  </div>
                </Field>
              </div>
              <div className="flex flex-wrap items-end gap-4">
                <Toggle checked={!!editing.delivery_available} onChange={v => set('delivery_available', v)} label="🛵 Delivery available" />
                {editing.delivery_available && (
                  <Field label="Delivery fee (USD, blank = free)">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input type="number" className={INPUT + ' pl-6 w-36'} value={editing.delivery_fee_usd ?? ''} onChange={e => set('delivery_fee_usd', Number(e.target.value) || null)} placeholder="0" />
                    </div>
                  </Field>
                )}
              </div>
            </Section>

            {/* 4. Equipment */}
            <Section title="4. Equipment & extras">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Standard equipment</p>
                <div className="flex flex-wrap gap-2">
                  <Toggle checked={!!editing.helmet_included} onChange={v => set('helmet_included', v)} label="🪖 Helmet" />
                  <Toggle checked={!!editing.lock_included} onChange={v => set('lock_included', v)} label="🔒 Lock" />
                  <Toggle checked={!!editing.raincoat_included} onChange={v => set('raincoat_included', v)} label="🧥 Raincoat" />
                  <Toggle checked={!!editing.insurance_included} onChange={v => set('insurance_included', v)} label="🛡 Insurance" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Optional extras</p>
                <div className="flex flex-wrap gap-2">
                  <Toggle checked={!!editing.gps_tracker} onChange={v => set('gps_tracker', v)} label="📍 GPS tracker" />
                  <Toggle checked={!!editing.phone_holder} onChange={v => set('phone_holder', v)} label="📱 Phone holder" />
                  <Toggle checked={!!editing.usb_charger} onChange={v => set('usb_charger', v)} label="🔌 USB charger" />
                  <Toggle checked={!!editing.top_box} onChange={v => set('top_box', v)} label="📦 Top box" />
                </div>
              </div>
            </Section>

            {/* 5. Rental terms */}
            <Section title="5. Rental terms">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Min. rental days">
                  <input type="number" min={1} className={INPUT} value={editing.min_rental_days ?? 1} onChange={e => set('min_rental_days', Number(e.target.value) || 1)} placeholder="1" />
                </Field>
                <Field label="Available from">
                  <input type="date" className={INPUT} value={editing.available_date ?? ''} onChange={e => set('available_date', e.target.value || null)} />
                </Field>
                <Field label="Owner notes (shown publicly)">
                  <textarea rows={3} className={INPUT} value={editing.notes ?? ''} onChange={e => set('notes', e.target.value || null)} placeholder="Any special notes for renters..." />
                </Field>
              </div>
            </Section>

            {/* 6. Media */}
            <Section title="6. Photos & Video">
              <MediaSection
                images={editing.images ?? []}
                videoUrl={editing.video_url ?? null}
                coverIndex={editing.cover_image_index ?? 0}
                onImagesChange={imgs => set('images', imgs)}
                onVideoChange={url => set('video_url', url)}
                onCoverChange={idx => set('cover_image_index', idx)}
              />
            </Section>

            {/* 7. Admin only */}
            <Section title="7. Admin only (not shown publicly)" defaultOpen={false}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Owner name">
                  <input className={INPUT} value={editing.owner_name ?? ''} onChange={e => set('owner_name', e.target.value || null)} placeholder="Nguyen Van A" />
                </Field>
                <Field label="Owner phone">
                  <input className={INPUT} value={editing.owner_phone ?? ''} onChange={e => set('owner_phone', e.target.value || null)} placeholder="0909 xxx xxx" />
                </Field>
                <Field label="Owner Zalo">
                  <input className={INPUT} value={editing.owner_zalo ?? ''} onChange={e => set('owner_zalo', e.target.value || null)} placeholder="0909 xxx xxx" />
                </Field>
                <Field label="Commission note">
                  <input className={INPUT} value={editing.commission_note ?? ''} onChange={e => set('commission_note', e.target.value || null)} placeholder="1 day commission" />
                </Field>
                <Field label="Admin notes">
                  <textarea rows={2} className={INPUT} value={editing.admin_notes ?? ''} onChange={e => set('admin_notes', e.target.value || null)} placeholder="Internal notes..." />
                </Field>
              </div>
              <Toggle checked={!!editing.featured} onChange={v => set('featured', v)} label="⭐ Featured listing" />
            </Section>

            {saveError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">{saveError}</div>
            )}

            <div className="flex gap-3 pt-2 border-t border-[#E5E7EB]">
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 bg-[#1D9E75] text-white text-sm px-6 py-2.5 rounded-full hover:bg-[#0F6E56] disabled:opacity-50 transition-colors">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? 'Saving…' : (editing.id ? 'Update bike' : 'Create listing')}
              </button>
              <button onClick={() => setEditing(null)}
                className="border border-[#D1D5DB] text-gray-600 text-sm px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
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
            <p className="text-sm">No bikes yet{filter !== 'all' ? ` with status "${STATUS_META[filter as MotorbikeStatus]?.label}"` : ''}</p>
            <p className="text-xs mt-1">Run migration 005_motorbike_listings.sql in Supabase if the table is missing</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-[#E5E7EB]">
                <tr className="text-left text-gray-500 text-xs">
                  <th className="px-4 py-3 font-medium">Bike</th>
                  <th className="px-4 py-3 font-medium">Area</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Views/Inq</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Toggle</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const meta = STATUS_META[l.status]
                  const cond = CONDITION_LABELS[l.condition]
                  const isActive = l.status === 'available'
                  return (
                    <tr key={l.id} className="border-b border-[#F3F5F9] last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {l.images?.[l.cover_image_index ?? 0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={l.images[l.cover_image_index ?? 0]} alt="" className="w-10 h-10 object-cover rounded-lg border border-[#E5E7EB] flex-none" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg border border-[#E5E7EB] flex-none flex items-center justify-center">
                              <ImageIcon size={14} className="text-gray-300" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate max-w-[180px]">{l.title}</p>
                            <p className="text-xs text-gray-400">{l.brand} {l.model} · {l.engine_cc ? `${l.engine_cc}cc` : '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{l.district_label}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#0F6E56] text-xs">${l.price_per_day_usd}/day</p>
                        {l.price_per_month_usd && <p className="text-[11px] text-gray-400">${l.price_per_month_usd}/mo</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600">{l.type}</span>
                        <span className={clsx('ml-1 text-[10px] px-1.5 py-0.5 rounded-full border', cond.color)}>{cond.label}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        <span className="flex items-center gap-2">
                          <Eye size={12} /> {l.view_count ?? 0}
                          <span className="text-gray-300">·</span>
                          {l.inquiry_count ?? 0} inq
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={clsx('text-[11px] px-2 py-0.5 rounded-full border font-medium', meta.color)}>
                          {meta.label}
                        </span>
                        {l.featured && <span className="ml-1 text-[10px] text-amber-600">⭐</span>}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleStatus(l.id, l.status)}
                          title={isActive ? 'Hide listing' : 'Make available'}
                          className={clsx('flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border transition-colors',
                            isActive
                              ? 'bg-green-50 border-green-200 text-green-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
                              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-green-50 hover:border-green-200 hover:text-green-700')}>
                          {isActive ? <><ToggleRight size={13} /> Open</> : <><ToggleLeft size={13} /> Off</>}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => openEdit(l)} className="flex items-center gap-1 text-xs text-[#1D9E75] hover:underline">
                            <Pencil size={12} /> Edit
                          </button>
                          <button onClick={() => deleteListing(l.id)} className="text-gray-300 hover:text-red-500 transition-colors">
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

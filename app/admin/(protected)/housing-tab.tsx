'use client'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { HousingListingPublic, HousingStatus, HousingType, HousingFurnishing, DISTRICTS, HOUSING_TYPES } from '@/types/housing'
import { clsx } from 'clsx'
import {
  Plus, X, Upload, Video, Eye, EyeOff, Pencil, Wifi, Zap, Droplets,
  Car, PawPrint, ShieldCheck, FileText, UserCheck, ChevronDown, ChevronUp,
  Image as ImageIcon, Loader2, ToggleLeft, ToggleRight, Trash2,
} from 'lucide-react'

type FullListing = HousingListingPublic & {
  landlord_name?: string | null
  landlord_phone?: string | null
  landlord_zalo?: string | null
  exact_address?: string | null
  commission_note?: string | null
  admin_notes?: string | null
  listing_source?: string | null
}

const EMPTY: Partial<FullListing> = {
  title_vn: '', title_en: '',
  type: 'studio', furnishing: 'full',
  district: 'an-thuong', district_label: 'An Thuong',
  price_usd: 0, deposit_months: 2,
  water_included: false, internet_included: false,
  pets_allowed: false, temp_residence_support: false, english_contract: false,
  has_ac: false, has_washer: false, has_water_heater: false,
  has_fridge: false, has_microwave: false, has_tv: false, has_desk: false, has_balcony: false,
  has_pool: false, has_gym: false, has_elevator: false, has_security: false,
  has_motorbike_parking: false, has_car_parking: false, has_reception: false,
  images: [], video_url: null, cover_image_index: 0,
  status: 'available', featured: false,
}

const STATUS_META: Record<HousingStatus, { label: string; labelVi: string; color: string }> = {
  available: { label: 'Available', labelVi: 'Đang cho thuê', color: 'bg-green-100 text-green-700 border-green-200' },
  pending:   { label: 'Pending',   labelVi: 'Đang xem',      color: 'bg-amber-100 text-amber-700 border-amber-200' },
  rented:    { label: 'Rented',    labelVi: 'Đã thuê',       color: 'bg-blue-100 text-blue-700 border-blue-200' },
  hidden:    { label: 'Hidden',    labelVi: 'Ẩn',            color: 'bg-gray-100 text-gray-500 border-gray-200' },
  expired:   { label: 'Expired',   labelVi: 'Hết hạn',       color: 'bg-red-100 text-red-600 border-red-200' },
}

const ALL_COLUMNS = [
  'id', 'created_at', 'title_vn', 'title_en', 'type', 'area_sqm', 'bedrooms', 'bathrooms',
  'floor_number', 'furnishing', 'views', 'district', 'district_label', 'distance_to_beach_m',
  'nearby_refs', 'price_usd', 'price_vnd', 'short_term_price_usd', 'deposit_months',
  'electricity_note', 'water_included', 'internet_included', 'management_fee_usd',
  'cleaning_fee_usd', 'parking_note', 'min_duration', 'pets_allowed',
  'temp_residence_support', 'english_contract', 'available_date',
  'has_ac', 'has_washer', 'has_water_heater', 'kitchen_type', 'has_fridge', 'has_microwave',
  'has_tv', 'has_desk', 'has_balcony', 'has_pool', 'has_gym', 'has_elevator', 'has_security',
  'has_motorbike_parking', 'has_car_parking', 'has_reception',
  'images', 'video_url', 'cover_image_index', 'status', 'featured', 'view_count', 'inquiry_count',
  // admin-only
  'landlord_name', 'landlord_phone', 'landlord_zalo', 'exact_address',
  'commission_note', 'admin_notes', 'listing_source',
].join(', ')

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
      >
        {title}
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="p-4 space-y-4">{children}</div>}
    </div>
  )
}

// ── Field helpers ────────────────────────────────────────────────────────────
function Field({ label, labelVi, children }: { label: string; labelVi?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-1 block">
        {label}{labelVi && <span className="text-gray-400 font-normal ml-1">/ {labelVi}</span>}
      </label>
      {children}
    </div>
  )
}

const INPUT = "w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]/20 bg-white"

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={clsx(
        'flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors',
        checked ? 'bg-[#E1F5EE] border-[#1D9E75] text-[#085041]' : 'border-[#E5E7EB] text-gray-500 hover:bg-gray-50'
      )}
    >
      {checked ? <ToggleRight size={16} className="text-[#1D9E75]" /> : <ToggleLeft size={16} className="text-gray-400" />}
      {label}
    </button>
  )
}

// ── Media section ────────────────────────────────────────────────────────────
function MediaSection({
  images, videoUrl, coverIndex,
  onImagesChange, onVideoChange, onCoverChange,
}: {
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
    fd.append('folder', `housing/${folder}`)
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
      const url = await uploadFile(file, 'videos')
      onVideoChange(url)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(null)
      if (vidRef.current) vidRef.current.value = ''
    }
  }

  const addUrl = () => {
    const url = newUrl.trim()
    if (!url) return
    onImagesChange([...images, url])
    setNewUrl('')
  }

  const removeImage = (i: number) => {
    const next = images.filter((_, idx) => idx !== i)
    onImagesChange(next)
    if (coverIndex >= next.length) onCoverChange(Math.max(0, next.length - 1))
  }

  return (
    <div className="space-y-5">
      {/* Images */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Photos</p>

        {/* Thumbnails grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
            {images.map((url, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`photo ${i + 1}`}
                  className={clsx(
                    'w-full aspect-square object-cover rounded-lg border-2 cursor-pointer transition-all',
                    coverIndex === i ? 'border-[#1D9E75] ring-2 ring-[#1D9E75]/30' : 'border-[#E5E7EB] hover:border-[#1D9E75]/40'
                  )}
                  onClick={() => onCoverChange(i)}
                />
                {coverIndex === i && (
                  <span className="absolute bottom-1 left-1 text-[9px] bg-[#1D9E75] text-white px-1.5 py-0.5 rounded font-semibold">COVER</span>
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
        )}

        {images.length === 0 && (
          <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 mb-3">
            <ImageIcon size={28} />
            <p className="text-xs">No photos yet — upload or add URLs below</p>
          </div>
        )}

        {/* Upload button */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => imgRef.current?.click()}
            disabled={uploading === 'image'}
            className="flex items-center gap-2 text-sm border border-[#E5E7EB] px-3 py-2 rounded-lg text-gray-600 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors disabled:opacity-50"
          >
            {uploading === 'image' ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            Upload photos
          </button>
          <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />

          {/* Add URL */}
          <div className="flex gap-1.5 flex-1 min-w-[200px]">
            <input
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())}
              placeholder="Paste image URL…"
              className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
            />
            <button
              type="button"
              onClick={addUrl}
              disabled={!newUrl.trim()}
              className="px-3 py-2 bg-[#1D9E75] text-white rounded-lg text-sm hover:bg-[#0F6E56] disabled:opacity-40 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 mt-1.5">Click a photo to set it as cover. Upload multiple at once or paste URL.</p>
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
          <button
            type="button"
            onClick={() => vidRef.current?.click()}
            disabled={uploading === 'video'}
            className="flex items-center gap-2 text-sm border border-[#E5E7EB] px-3 py-2 rounded-lg text-gray-600 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors disabled:opacity-50"
          >
            {uploading === 'video' ? <Loader2 size={14} className="animate-spin" /> : <Video size={14} />}
            Upload video
          </button>
          <input ref={vidRef} type="file" accept="video/mp4,video/webm,video/mov" className="hidden" onChange={handleVideoUpload} />

          <input
            value={videoUrl ?? ''}
            onChange={e => onVideoChange(e.target.value || null)}
            placeholder="Or paste YouTube / video URL…"
            className="flex-1 min-w-[200px] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-1.5">MP4, WebM, MOV — max 100 MB. Or paste a YouTube/Vimeo URL.</p>
      </div>
    </div>
  )
}

// ── Main HousingTab ─────────────────────────────────────────────────────────
export function HousingTab() {
  const supabase = useMemo(() => createClient(), [])
  const [listings, setListings] = useState<FullListing[]>([])
  const [editing, setEditing] = useState<Partial<FullListing> | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [filter, setFilter] = useState<HousingStatus | 'all'>('all')

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('housing_listings')
      .select(ALL_COLUMNS)
      .order('created_at', { ascending: false })
    setListings((data as unknown as FullListing[]) || [])
  }, [supabase])

  useEffect(() => { load() }, [load])

  const openNew = () => {
    setEditing({ ...EMPTY })
    setSaveError('')
  }

  const openEdit = (l: FullListing) => {
    setEditing({ ...l })
    setSaveError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const set = <K extends keyof FullListing>(key: K, val: FullListing[K]) =>
    setEditing(prev => prev ? { ...prev, [key]: val } : prev)

  const toggleStatus = async (id: string, current: HousingStatus) => {
    const next: HousingStatus = current === 'available' ? 'hidden' : 'available'
    await supabase.from('housing_listings').update({ status: next }).eq('id', id)
    load()
  }

  const deleteListing = async (id: string) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return
    await supabase.from('housing_listings').delete().eq('id', id)
    if (editing && (editing as FullListing).id === id) setEditing(null)
    load()
  }

  const save = async () => {
    if (!editing) return
    setSaving(true)
    setSaveError('')
    try {
      // Find district label from value
      const districtObj = DISTRICTS.find(d => d.value === editing.district)
      const payload = {
        ...editing,
        district_label: districtObj?.label ?? editing.district_label ?? '',
      }
      if (editing.id) {
        const { id, created_at, view_count, inquiry_count, ...rest } = payload as FullListing
        await supabase.from('housing_listings').update(rest).eq('id', id)
      } else {
        const { id, created_at, view_count, inquiry_count, ...rest } = payload as FullListing
        await supabase.from('housing_listings').insert(rest)
      }
      setEditing(null)
      load()
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
          {(['all', 'available', 'pending', 'rented', 'hidden', 'expired'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={clsx(
                'text-xs px-3 py-1.5 rounded-full border transition-colors',
                filter === s ? 'bg-[#1D9E75] text-white border-[#1D9E75]' : 'border-[#E5E7EB] text-gray-600 hover:bg-gray-50'
              )}
            >
              {s === 'all' ? `All (${listings.length})` : `${STATUS_META[s]?.labelVi ?? s} (${listings.filter(l => l.status === s).length})`}
            </button>
          ))}
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 text-sm font-medium bg-[#1D9E75] text-white px-4 py-2 rounded-full hover:bg-[#0F6E56] transition-colors"
        >
          <Plus size={15} /> Thêm nhà
        </button>
      </div>

      {/* Edit / New form */}
      {editing && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
          {/* Form header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] bg-gray-50">
            <div>
              <h2 className="font-semibold text-gray-900">{editing.id ? 'Chỉnh sửa nhà' : 'Thêm nhà mới'}</h2>
              {editing.id && <p className="text-xs text-gray-400 font-mono mt-0.5">{editing.id}</p>}
            </div>
            <div className="flex items-center gap-3">
              {/* Status quick-set */}
              <select
                value={editing.status ?? 'available'}
                onChange={e => set('status', e.target.value as HousingStatus)}
                className="text-xs border border-[#E5E7EB] rounded-lg px-2 py-1.5 outline-none focus:border-[#1D9E75] bg-white"
              >
                {Object.entries(STATUS_META).map(([v, m]) => (
                  <option key={v} value={v}>{m.labelVi} ({m.label})</option>
                ))}
              </select>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">

            {/* 1. Basic info */}
            <Section title="1. Thông tin cơ bản">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Tiêu đề tiếng Việt" labelVi="title_vn">
                  <input className={INPUT} value={editing.title_vn ?? ''} onChange={e => set('title_vn', e.target.value)} placeholder="Căn hộ 2PN view biển An Thượng" />
                </Field>
                <Field label="English title" labelVi="title_en">
                  <input className={INPUT} value={editing.title_en ?? ''} onChange={e => set('title_en', e.target.value)} placeholder="2BR Seaview Apartment — An Thuong" />
                </Field>
                <Field label="Loại nhà" labelVi="type">
                  <select className={INPUT} value={editing.type ?? 'studio'} onChange={e => set('type', e.target.value as HousingType)}>
                    {HOUSING_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </Field>
                <Field label="Nội thất" labelVi="furnishing">
                  <select className={INPUT} value={editing.furnishing ?? 'full'} onChange={e => set('furnishing', e.target.value as HousingFurnishing)}>
                    <option value="full">Đầy đủ nội thất / Fully furnished</option>
                    <option value="partial">Một phần / Partial</option>
                    <option value="unfurnished">Không có / Unfurnished</option>
                  </select>
                </Field>
                <Field label="Diện tích (m²)" labelVi="area_sqm">
                  <input type="number" className={INPUT} value={editing.area_sqm ?? ''} onChange={e => set('area_sqm', Number(e.target.value) || null)} placeholder="65" />
                </Field>
                <Field label="Số phòng ngủ" labelVi="bedrooms">
                  <input type="number" className={INPUT} min={0} value={editing.bedrooms ?? ''} onChange={e => set('bedrooms', Number(e.target.value))} placeholder="0 = Studio" />
                </Field>
                <Field label="Số phòng tắm" labelVi="bathrooms">
                  <input type="number" className={INPUT} min={1} value={editing.bathrooms ?? ''} onChange={e => set('bathrooms', Number(e.target.value))} placeholder="1" />
                </Field>
                <Field label="Tầng" labelVi="floor_number">
                  <input type="number" className={INPUT} value={editing.floor_number ?? ''} onChange={e => set('floor_number', Number(e.target.value) || null)} placeholder="5" />
                </Field>
              </div>
              <Field label="Views" labelVi="views">
                <div className="flex flex-wrap gap-2 mt-1">
                  {[
                    { value: 'sea', label: '🌊 Sea view' },
                    { value: 'river', label: '🏞 River view' },
                    { value: 'city', label: '🏙 City view' },
                    { value: 'garden', label: '🌿 Garden view' },
                  ].map(v => {
                    const selected = (editing.views ?? []).includes(v.value)
                    return (
                      <button
                        key={v.value}
                        type="button"
                        onClick={() => {
                          const cur = editing.views ?? []
                          set('views', selected ? cur.filter(x => x !== v.value) : [...cur, v.value])
                        }}
                        className={clsx(
                          'text-xs px-3 py-1.5 rounded-full border transition-colors',
                          selected ? 'bg-[#1D9E75] text-white border-[#1D9E75]' : 'border-[#E5E7EB] text-gray-600 hover:border-[#1D9E75]'
                        )}
                      >
                        {v.label}
                      </button>
                    )
                  })}
                </div>
              </Field>
            </Section>

            {/* 2. Location */}
            <Section title="2. Vị trí">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Khu vực" labelVi="district">
                  <select className={INPUT} value={editing.district ?? 'an-thuong'}
                    onChange={e => {
                      const d = DISTRICTS.find(x => x.value === e.target.value)
                      setEditing(prev => prev ? { ...prev, district: e.target.value, district_label: d?.label ?? '' } : prev)
                    }}
                  >
                    {DISTRICTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </Field>
                <Field label="Khoảng cách biển (m)" labelVi="distance_to_beach_m">
                  <input type="number" className={INPUT} value={editing.distance_to_beach_m ?? ''} onChange={e => set('distance_to_beach_m', Number(e.target.value) || null)} placeholder="400" />
                </Field>
                <Field label="Địa chỉ chính xác (admin only)">
                  <input className={INPUT} value={editing.exact_address ?? ''} onChange={e => set('exact_address', e.target.value)} placeholder="123 Trần Phú, P. Mỹ An" />
                </Field>
                <Field label="Tọa độ lat (admin only)">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" step="any" className={INPUT} placeholder="lat" />
                    <input type="number" step="any" className={INPUT} placeholder="lng" />
                  </div>
                </Field>
                <Field label="Nearby landmarks (nearby_refs)" labelVi="1 dòng = 1 địa điểm">
                  <textarea
                    rows={3}
                    className={INPUT}
                    value={(editing.nearby_refs ?? []).join('\n')}
                    onChange={e => set('nearby_refs', e.target.value.split('\n').map(s => s.trim()).filter(Boolean))}
                    placeholder={"500m to Bamboo2 Bar\n200m to My Khe Beach\n1km to An Thuong Market"}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Each line = one landmark. Shown on the area map.</p>
                </Field>
              </div>
            </Section>

            {/* 3. Pricing */}
            <Section title="3. Giá thuê & chi phí">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Giá/tháng (USD)*">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" className={INPUT + ' pl-6'} value={editing.price_usd ?? ''} onChange={e => set('price_usd', Number(e.target.value))} placeholder="450" />
                  </div>
                </Field>
                <Field label="Giá/tháng (VND)" labelVi="price_vnd">
                  <input type="number" className={INPUT} value={editing.price_vnd ?? ''} onChange={e => set('price_vnd', Number(e.target.value) || null)} placeholder="11250000" />
                </Field>
                <Field label="Giá ngắn hạn/tuần (USD)">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" className={INPUT + ' pl-6'} value={editing.short_term_price_usd ?? ''} onChange={e => set('short_term_price_usd', Number(e.target.value) || null)} placeholder="120" />
                  </div>
                </Field>
                <Field label="Đặt cọc (tháng)" labelVi="deposit_months">
                  <input type="number" min={0} className={INPUT} value={editing.deposit_months ?? 2} onChange={e => set('deposit_months', Number(e.target.value))} placeholder="2" />
                </Field>
                <Field label="Phí quản lý (USD/tháng)">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" className={INPUT + ' pl-6'} value={editing.management_fee_usd ?? ''} onChange={e => set('management_fee_usd', Number(e.target.value) || null)} placeholder="20" />
                  </div>
                </Field>
                <Field label="Phí vệ sinh (USD)">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" className={INPUT + ' pl-6'} value={editing.cleaning_fee_usd ?? ''} onChange={e => set('cleaning_fee_usd', Number(e.target.value) || null)} placeholder="30" />
                  </div>
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Điện" labelVi="electricity_note">
                  <input className={INPUT} value={editing.electricity_note ?? ''} onChange={e => set('electricity_note', e.target.value)} placeholder="Giá nhà nước ~3.000 VND/kWh" />
                </Field>
                <Field label="Ghi chú đậu xe" labelVi="parking_note">
                  <input className={INPUT} value={editing.parking_note ?? ''} onChange={e => set('parking_note', e.target.value)} placeholder="1 xe máy miễn phí, ô tô +$30/tháng" />
                </Field>
              </div>
              <div className="flex flex-wrap gap-2">
                <Toggle checked={!!editing.water_included} onChange={v => set('water_included', v)} label="Nước bao gồm" />
                <Toggle checked={!!editing.internet_included} onChange={v => set('internet_included', v)} label="WiFi bao gồm" />
              </div>
            </Section>

            {/* 4. Terms */}
            <Section title="4. Điều khoản thuê">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Thời hạn tối thiểu" labelVi="min_duration">
                  <select className={INPUT} value={editing.min_duration ?? ''} onChange={e => set('min_duration', (e.target.value as HousingListingPublic['min_duration']) || null)}>
                    <option value="">Linh hoạt / Flexible</option>
                    <option value="1m">1 tháng</option>
                    <option value="3m">3 tháng</option>
                    <option value="6m">6 tháng</option>
                    <option value="1y">1 năm</option>
                  </select>
                </Field>
                <Field label="Ngày có thể vào ở" labelVi="available_date">
                  <input type="date" className={INPUT} value={editing.available_date ?? ''} onChange={e => set('available_date', e.target.value || null)} />
                </Field>
              </div>
              <div className="flex flex-wrap gap-2">
                <Toggle checked={!!editing.pets_allowed} onChange={v => set('pets_allowed', v)} label="🐾 Cho nuôi thú cưng" />
                <Toggle checked={!!editing.english_contract} onChange={v => set('english_contract', v)} label="📄 Hợp đồng EN" />
                <Toggle checked={!!editing.temp_residence_support} onChange={v => set('temp_residence_support', v)} label="✅ Hỗ trợ tạm trú" />
              </div>
            </Section>

            {/* 5. Amenities */}
            <Section title="5. Tiện nghi" defaultOpen={false}>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trong căn / In-unit</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'has_ac', label: '❄️ Điều hòa' },
                    { key: 'has_washer', label: '🧺 Máy giặt' },
                    { key: 'has_water_heater', label: '🚿 Bình nóng lạnh' },
                    { key: 'has_fridge', label: '🧊 Tủ lạnh' },
                    { key: 'has_microwave', label: '📡 Lò vi sóng' },
                    { key: 'has_tv', label: '📺 TV' },
                    { key: 'has_desk', label: '🖥️ Bàn làm việc' },
                    { key: 'has_balcony', label: '🌅 Ban công' },
                  ].map(({ key, label }) => (
                    <Toggle key={key} checked={!!(editing as Record<string, unknown>)[key]} onChange={v => set(key as keyof FullListing, v as never)} label={label} />
                  ))}
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Bếp / Kitchen type</label>
                  <select className="border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#1D9E75] bg-white"
                    value={editing.kitchen_type ?? ''} onChange={e => set('kitchen_type', (e.target.value as HousingListingPublic['kitchen_type']) || null)}>
                    <option value="">Không có / None</option>
                    <option value="gas">Gas</option>
                    <option value="electric">Electric</option>
                    <option value="induction">Induction</option>
                  </select>
                </div>

                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2">Tòa nhà / Building</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'has_pool', label: '🏊 Hồ bơi' },
                    { key: 'has_gym', label: '💪 Phòng gym' },
                    { key: 'has_elevator', label: '🛗 Thang máy' },
                    { key: 'has_security', label: '🔒 Bảo vệ' },
                    { key: 'has_motorbike_parking', label: '🛵 Đậu xe máy' },
                    { key: 'has_car_parking', label: '🚗 Đậu ô tô' },
                    { key: 'has_reception', label: '🏢 Lễ tân' },
                  ].map(({ key, label }) => (
                    <Toggle key={key} checked={!!(editing as Record<string, unknown>)[key]} onChange={v => set(key as keyof FullListing, v as never)} label={label} />
                  ))}
                </div>
              </div>
            </Section>

            {/* 6. Media */}
            <Section title="6. Hình ảnh & Video">
              <MediaSection
                images={editing.images ?? []}
                videoUrl={editing.video_url ?? null}
                coverIndex={editing.cover_image_index ?? 0}
                onImagesChange={imgs => set('images', imgs)}
                onVideoChange={url => set('video_url', url)}
                onCoverChange={idx => set('cover_image_index', idx)}
              />
            </Section>

            {/* 7. Admin-only */}
            <Section title="7. Admin only (không hiển thị công khai)" defaultOpen={false}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Tên chủ nhà">
                  <input className={INPUT} value={editing.landlord_name ?? ''} onChange={e => set('landlord_name', e.target.value || null)} placeholder="Nguyễn Văn A" />
                </Field>
                <Field label="SĐT chủ nhà">
                  <input className={INPUT} value={editing.landlord_phone ?? ''} onChange={e => set('landlord_phone', e.target.value || null)} placeholder="0909 xxx xxx" />
                </Field>
                <Field label="Zalo chủ nhà">
                  <input className={INPUT} value={editing.landlord_zalo ?? ''} onChange={e => set('landlord_zalo', e.target.value || null)} placeholder="0909 xxx xxx" />
                </Field>
                <Field label="Nguồn" labelVi="listing_source">
                  <input className={INPUT} value={editing.listing_source ?? ''} onChange={e => set('listing_source', e.target.value || null)} placeholder="Facebook group, partner, direct" />
                </Field>
                <Field label="Hoa hồng" labelVi="commission_note">
                  <input className={INPUT} value={editing.commission_note ?? ''} onChange={e => set('commission_note', e.target.value || null)} placeholder="1 tháng tiền thuê" />
                </Field>
                <Field label="Ghi chú nội bộ" labelVi="admin_notes">
                  <textarea rows={2} className={INPUT} value={editing.admin_notes ?? ''} onChange={e => set('admin_notes', e.target.value || null)} placeholder="Ghi chú nội bộ..." />
                </Field>
              </div>
              <Toggle checked={!!editing.featured} onChange={v => set('featured', v)} label="⭐ Featured listing" />
            </Section>

            {saveError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">{saveError}</div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-[#E5E7EB]">
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 bg-[#1D9E75] text-white text-sm px-6 py-2.5 rounded-full hover:bg-[#0F6E56] disabled:opacity-50 transition-colors"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? 'Đang lưu…' : (editing.id ? 'Cập nhật' : 'Tạo listing')}
              </button>
              <button
                onClick={() => setEditing(null)}
                className="border border-[#D1D5DB] text-gray-600 text-sm px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listing table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-sm">Chưa có nhà nào{filter !== 'all' ? ` ở trạng thái "${STATUS_META[filter as HousingStatus]?.labelVi}"` : ''}</p>
            <p className="text-xs mt-1">Nhớ chạy migration SQL trong Supabase nếu chưa có bảng</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-[#E5E7EB]">
                <tr className="text-left text-gray-500 text-xs">
                  <th className="px-4 py-3 font-medium">Nhà</th>
                  <th className="px-4 py-3 font-medium">Khu vực</th>
                  <th className="px-4 py-3 font-medium">Giá</th>
                  <th className="px-4 py-3 font-medium">Phòng</th>
                  <th className="px-4 py-3 font-medium">Views/Inq</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium">Kết nối</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const meta = STATUS_META[l.status]
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
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{l.title_en}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[200px]">{l.title_vn}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{l.district_label}</td>
                      <td className="px-4 py-3 font-medium text-[#0F6E56]">${l.price_usd}/mo</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {l.bedrooms === 0 ? 'Studio' : `${l.bedrooms ?? '—'}BR`} / {l.bathrooms ?? '—'}BA
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
                          {meta.labelVi}
                        </span>
                        {l.featured && <span className="ml-1 text-[10px] text-amber-600">⭐</span>}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleStatus(l.id, l.status)}
                          title={isActive ? 'Ngừng kết nối' : 'Mở lại'}
                          className={clsx(
                            'flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border transition-colors',
                            isActive
                              ? 'bg-green-50 border-green-200 text-green-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
                              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-green-50 hover:border-green-200 hover:text-green-700'
                          )}
                        >
                          {isActive
                            ? <><ToggleRight size={13} /> Open</>
                            : <><ToggleLeft size={13} /> Off</>
                          }
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => openEdit(l)} className="flex items-center gap-1 text-xs text-[#1D9E75] hover:underline">
                            <Pencil size={12} /> Sửa
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

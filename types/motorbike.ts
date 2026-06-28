export type MotorbikeType = 'scooter' | 'semi-auto' | 'manual' | 'trail'
export type MotorbikeCondition = 'new' | 'like-new' | 'good'
export type MotorbikeStatus = 'available' | 'rented' | 'maintenance' | 'hidden'

export interface MotorbikeListing {
  id: string
  created_at: string
  title: string
  brand: string
  model: string
  type: MotorbikeType
  engine_cc: number | null
  year_made: number | null
  condition: MotorbikeCondition
  color: string | null
  district: string
  district_label: string
  price_per_day_usd: number
  price_per_week_usd: number | null
  price_per_month_usd: number | null
  deposit_usd: number
  helmet_included: boolean
  lock_included: boolean
  raincoat_included: boolean
  insurance_included: boolean
  delivery_available: boolean
  delivery_fee_usd: number | null
  gps_tracker: boolean
  phone_holder: boolean
  usb_charger: boolean
  top_box: boolean
  min_rental_days: number
  available_date: string | null
  notes: string | null
  images: string[] | null
  video_url: string | null
  cover_image_index: number
  status: MotorbikeStatus
  featured: boolean
  view_count: number
  inquiry_count: number
}

export interface MotorbikeInquiryInput {
  listing_id: string
  listing_title: string
  name: string
  contact_channel: 'zalo' | 'whatsapp' | 'telegram' | 'email'
  contact_value: string
  start_date?: string
  duration_days?: number
  message?: string
  hp?: string
}

export interface MotorbikeFilters {
  types: MotorbikeType[]
  districts: string[]
  maxPricePerDay: number | null
  helmetIncluded: boolean
  insuranceIncluded: boolean
  deliveryAvailable: boolean
  minEngineCC: number | null
}

export type MotorbikeSortKey = 'newest' | 'price_asc' | 'price_desc'

export const DISTRICTS = [
  { value: 'an-thuong', label: 'An Thuong' },
  { value: 'my-khe', label: 'My Khe' },
  { value: 'son-tra', label: 'Son Tra' },
  { value: 'hai-chau', label: 'Hai Chau' },
  { value: 'ngu-hanh-son', label: 'Ngu Hanh Son' },
  { value: 'cam-le', label: 'Cam Le' },
] as const

export const MOTORBIKE_TYPES: { value: MotorbikeType; label: string; desc: string }[] = [
  { value: 'scooter', label: 'Scooter', desc: 'Automatic, easy to ride' },
  { value: 'semi-auto', label: 'Semi-auto', desc: 'No clutch, foot gear' },
  { value: 'manual', label: 'Manual', desc: 'Full clutch & gear' },
  { value: 'trail', label: 'Trail / Offroad', desc: 'Adventure & off-road' },
]

export const CONDITION_LABELS: Record<MotorbikeCondition, { label: string; color: string }> = {
  new: { label: 'New', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  'like-new': { label: 'Like new', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  good: { label: 'Good', color: 'text-gray-700 bg-gray-100 border-gray-200' },
}

export function typeLabel(type: MotorbikeType): string {
  return MOTORBIKE_TYPES.find(t => t.value === type)?.label ?? type
}

export function fmtDayPrice(usd: number): string {
  return `$${usd}/day`
}

export const PUBLIC_COLUMNS = [
  'id', 'created_at', 'title', 'brand', 'model', 'type', 'engine_cc', 'year_made',
  'condition', 'color', 'district', 'district_label',
  'price_per_day_usd', 'price_per_week_usd', 'price_per_month_usd', 'deposit_usd',
  'helmet_included', 'lock_included', 'raincoat_included', 'insurance_included',
  'delivery_available', 'delivery_fee_usd',
  'gps_tracker', 'phone_holder', 'usb_charger', 'top_box',
  'min_rental_days', 'available_date', 'notes',
  'images', 'video_url', 'cover_image_index',
  'status', 'featured', 'view_count', 'inquiry_count',
].join(', ')

export type HousingType = 'studio' | '1br' | '2br' | '3br' | 'house' | 'villa'
export type HousingFurnishing = 'full' | 'partial' | 'unfurnished'
export type HousingStatus = 'available' | 'pending' | 'rented' | 'hidden' | 'expired'
export type HousingMinDuration = '1m' | '3m' | '6m' | '1y'
export type ContactChannel = 'zalo' | 'whatsapp' | 'telegram' | 'email'

export interface HousingListingPublic {
  id: string
  created_at: string
  title_vn: string
  title_en: string
  type: HousingType
  area_sqm: number | null
  bedrooms: number | null
  bathrooms: number | null
  floor_number: number | null
  furnishing: HousingFurnishing | null
  views: string[] | null
  district: string
  district_label: string
  distance_to_beach_m: number | null
  nearby_refs: string[] | null
  price_usd: number
  price_vnd: number | null
  short_term_price_usd: number | null
  deposit_months: number
  electricity_note: string | null
  water_included: boolean
  internet_included: boolean
  management_fee_usd: number | null
  cleaning_fee_usd: number | null
  parking_note: string | null
  min_duration: HousingMinDuration | null
  pets_allowed: boolean
  temp_residence_support: boolean
  english_contract: boolean
  available_date: string | null
  has_ac: boolean
  has_washer: boolean
  has_water_heater: boolean
  kitchen_type: 'gas' | 'electric' | 'induction' | null
  has_fridge: boolean
  has_microwave: boolean
  has_tv: boolean
  has_desk: boolean
  has_balcony: boolean
  has_pool: boolean
  has_gym: boolean
  has_elevator: boolean
  has_security: boolean
  has_motorbike_parking: boolean
  has_car_parking: boolean
  has_reception: boolean
  images: string[] | null
  video_url: string | null
  cover_image_index: number
  status: HousingStatus
  featured: boolean
  view_count: number
  inquiry_count: number
}

export interface HousingInquiryInput {
  listing_id: string
  listing_title: string
  name: string
  contact_channel: ContactChannel
  contact_value: string
  rental_duration?: string
  preferred_viewing_date?: string
  message?: string
  hp?: string
}

export interface HousingSearchRequestInput {
  name: string
  contact_channel: ContactChannel
  contact_value: string
  budget_usd_max?: number
  districts?: string[]
  type_preferences?: string[]
  min_bedrooms?: number
  move_in_date?: string
  duration?: string
  notes?: string
  hp?: string
}

export interface HousingFilters {
  districts: string[]
  priceMin: number
  priceMax: number
  types: string[]
  minBedrooms: number | null
  minDuration: string | null
  petsAllowed: boolean
  hasPool: boolean
  hasSeaview: boolean
  fullyFurnished: boolean
}

export type HousingSortKey = 'newest' | 'price_asc' | 'price_desc' | 'nearest_beach'

export const DISTRICTS = [
  { value: 'an-thuong', label: 'An Thuong', labelVn: 'An Thượng' },
  { value: 'my-khe', label: 'My Khe', labelVn: 'Mỹ Khê' },
  { value: 'son-tra', label: 'Son Tra', labelVn: 'Sơn Trà' },
  { value: 'hai-chau', label: 'Hai Chau', labelVn: 'Hải Châu' },
  { value: 'ngu-hanh-son', label: 'Ngu Hanh Son', labelVn: 'Ngũ Hành Sơn' },
  { value: 'cam-le', label: 'Cam Le', labelVn: 'Cẩm Lệ' },
] as const

export const HOUSING_TYPES: { value: HousingType; label: string }[] = [
  { value: 'studio', label: 'Studio' },
  { value: '1br', label: '1 BR' },
  { value: '2br', label: '2 BR' },
  { value: '3br', label: '3 BR' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
]

export const MIN_DURATIONS: { value: HousingMinDuration; label: string }[] = [
  { value: '1m', label: '1 month' },
  { value: '3m', label: '3 months' },
  { value: '6m', label: '6 months' },
  { value: '1y', label: '1 year' },
]

export const USD_TO_VND = 25000

export function fmtPrice(usd: number, inVnd: boolean): string {
  if (inVnd) {
    const vnd = usd * USD_TO_VND
    return vnd >= 1_000_000
      ? `${(vnd / 1_000_000).toFixed(1).replace('.0', '')}M ₫`
      : `${vnd.toLocaleString()} ₫`
  }
  return `$${usd.toLocaleString()}`
}

export function typeLabel(type: HousingType): string {
  return HOUSING_TYPES.find(t => t.value === type)?.label ?? type.toUpperCase()
}

export function durationLabel(dur: HousingMinDuration | null): string {
  if (!dur) return 'Flexible'
  return MIN_DURATIONS.find(d => d.value === dur)?.label ?? dur
}

export const PUBLIC_COLUMNS = [
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
].join(', ')

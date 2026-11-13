import type { LucideIcon } from 'lucide-react'
import {
  Stethoscope, Coffee, Dumbbell, UtensilsCrossed,
  GraduationCap, Scissors, PawPrint, Wrench,
} from 'lucide-react'

export type BusinessCategory =
  | 'healthcare'
  | 'cafe-coworking'
  | 'fitness'
  | 'restaurants'
  | 'education'
  | 'beauty'
  | 'pets'
  | 'essentials'

export type EnglishLevel = 'fluent' | 'basic' | 'none'
export type BusinessStatus = 'published' | 'draft' | 'hidden' | 'closed'
export type PaymentMethod = 'cash' | 'card' | 'bank-transfer' | 'e-wallet'

export interface Business {
  id: string
  created_at: string
  updated_at: string
  slug: string
  name: string
  category: BusinessCategory
  short_description: string | null
  description: string | null
  district: string
  district_label: string
  address: string | null
  lat: number | null
  lng: number | null
  phone: string | null
  website: string | null
  maps_url: string | null
  facebook: string | null
  zalo: string | null
  email: string | null
  hours: string | null
  /** Null means nobody has checked yet — not "no English". */
  english_level: EnglishLevel | null
  price_level: number | null
  payment_methods: PaymentMethod[] | null
  amenities: string[] | null
  good_for: string[] | null
  images: string[] | null
  cover_image_index: number
  verified: boolean
  verified_at: string | null
  verified_note: string | null
  claimed_by: string | null
  status: BusinessStatus
  featured: boolean
  sort_order: number
  view_count: number
}

export type BusinessSortKey = 'recommended' | 'newest' | 'name'

/** Columns the public API and pages may select — excludes every owner_* field. */
export const PUBLIC_COLUMNS = [
  'id', 'created_at', 'updated_at', 'slug', 'name', 'category',
  'short_description', 'description',
  'district', 'district_label', 'address', 'lat', 'lng',
  'phone', 'website', 'maps_url', 'facebook', 'zalo', 'email', 'hours',
  'english_level', 'price_level', 'payment_methods', 'amenities', 'good_for',
  'images', 'cover_image_index',
  'verified', 'verified_at', 'verified_note', 'claimed_by',
  'status', 'featured', 'sort_order', 'view_count',
].join(', ')

export const DISTRICTS = [
  { value: 'an-thuong', label: 'An Thuong' },
  { value: 'my-khe', label: 'My Khe' },
  { value: 'son-tra', label: 'Son Tra' },
  { value: 'hai-chau', label: 'Hai Chau' },
  { value: 'thanh-khe', label: 'Thanh Khe' },
  { value: 'ngu-hanh-son', label: 'Ngu Hanh Son' },
  { value: 'cam-le', label: 'Cam Le' },
] as const

export interface CategoryConfig {
  slug: BusinessCategory
  label: string
  /** Plural noun used in copy: "12 clinics", "No cafes yet". */
  noun: string
  icon: LucideIcon
  blurb: string
  /** Page title + meta description for /directory/<slug>. */
  metaTitle: string
  metaDescription: string
  keywords: string[]
  /** schema.org type for the detail page's LocalBusiness subtype. */
  schemaType: string
  /** Amenity keys surfaced as quick filters on this category's page. */
  highlightAmenities: string[]
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: 'healthcare',
    label: 'Healthcare & dental',
    noun: 'clinics',
    icon: Stethoscope,
    blurb: 'Clinics, dentists and specialists that treat foreign patients.',
    metaTitle: 'English-Speaking Doctors & Dentists in Da Nang',
    metaDescription:
      'Clinics and dental practices in Da Nang with English-speaking staff, published prices and international insurance accepted. Verified ones carry a badge.',
    keywords: [
      'English speaking doctor Da Nang', 'dentist Da Nang expat',
      'international clinic Da Nang', 'Da Nang healthcare foreigners',
    ],
    schemaType: 'MedicalBusiness',
    highlightAmenities: ['international-insurance', 'english-staff', 'appointment-needed'],
  },
  {
    slug: 'cafe-coworking',
    label: 'Cafes & coworking',
    noun: 'places',
    icon: Coffee,
    blurb: 'Where to work: measured wifi, power outlets and laptop policy.',
    metaTitle: 'Best Cafes & Coworking Spaces to Work From in Da Nang',
    metaDescription:
      'Laptop-friendly cafes and coworking spaces in Da Nang with real wifi speeds, power outlets and English menus. Verified ones carry a badge.',
    keywords: [
      'coworking Da Nang', 'laptop friendly cafe Da Nang',
      'work from cafe Da Nang', 'digital nomad Da Nang wifi',
    ],
    schemaType: 'CafeOrCoffeeShop',
    highlightAmenities: ['wifi-fast', 'laptop-friendly', 'power-outlets'],
  },
  {
    slug: 'fitness',
    label: 'Gyms & fitness',
    noun: 'gyms',
    icon: Dumbbell,
    blurb: 'Gyms, yoga and martial arts with month-to-month terms.',
    metaTitle: 'Gyms, Yoga & Fitness Studios in Da Nang for Expats',
    metaDescription:
      'Gyms, yoga studios and martial arts clubs in Da Nang with English-speaking staff, monthly terms and no lock-in contracts. Verified ones carry a badge.',
    keywords: [
      'gym Da Nang', 'yoga Da Nang', 'fitness Da Nang expat',
      'monthly gym membership Da Nang',
    ],
    schemaType: 'ExerciseGym',
    highlightAmenities: ['no-lock-in-contract', 'drop-in-welcome', 'english-staff'],
  },
  {
    slug: 'restaurants',
    label: 'Restaurants',
    noun: 'restaurants',
    icon: UtensilsCrossed,
    blurb: 'Places with an English menu and prices on the wall.',
    metaTitle: 'Expat-Friendly Restaurants in Da Nang',
    metaDescription:
      'Restaurants in Da Nang with English menus, listed prices, vegan and halal options. Verified ones carry a badge.',
    keywords: [
      'restaurants Da Nang expat', 'English menu Da Nang',
      'vegan Da Nang', 'halal Da Nang',
    ],
    schemaType: 'Restaurant',
    highlightAmenities: ['english-menu', 'vegan-options', 'halal'],
  },
  {
    slug: 'education',
    label: 'Schools & lessons',
    noun: 'schools',
    icon: GraduationCap,
    blurb: 'International schools, kindergartens and Vietnamese lessons.',
    metaTitle: 'International Schools & Vietnamese Lessons in Da Nang',
    metaDescription:
      'International schools, kindergartens and Vietnamese language teachers in Da Nang, with fees and enrolment paperwork explained. Verified ones carry a badge.',
    keywords: [
      'international school Da Nang', 'Vietnamese lessons Da Nang',
      'kindergarten Da Nang expat', 'language school Da Nang',
    ],
    schemaType: 'EducationalOrganization',
    highlightAmenities: ['english-staff', 'invoice-vat', 'appointment-needed'],
  },
  {
    slug: 'beauty',
    label: 'Salons & spas',
    noun: 'salons',
    icon: Scissors,
    blurb: 'Hair, nails and massage where the price list is posted.',
    metaTitle: 'Hair Salons, Nails & Spas in Da Nang for Foreigners',
    metaDescription:
      'Hair salons, nail bars and spas in Da Nang with posted price lists and English-speaking staff. Verified ones carry a badge.',
    keywords: [
      'hair salon Da Nang foreigners', 'spa Da Nang', 'nails Da Nang',
      'barber Da Nang expat',
    ],
    schemaType: 'BeautySalon',
    highlightAmenities: ['english-staff', 'appointment-needed', 'card-accepted'],
  },
  {
    slug: 'pets',
    label: 'Vets & pet care',
    noun: 'vets',
    icon: PawPrint,
    blurb: 'Vets, grooming and boarding, including export paperwork.',
    metaTitle: 'Vets & Pet Care in Da Nang',
    metaDescription:
      'Veterinary clinics, grooming and boarding in Da Nang, including pet export and import paperwork. Verified ones carry a badge.',
    keywords: [
      'vet Da Nang', 'pet care Da Nang', 'dog grooming Da Nang',
      'pet export Vietnam',
    ],
    schemaType: 'VeterinaryCare',
    highlightAmenities: ['english-staff', 'appointment-needed', 'pet-friendly'],
  },
  {
    slug: 'essentials',
    label: 'Everyday services',
    noun: 'services',
    icon: Wrench,
    blurb: 'Laundry, repairs, movers, lawyers and accountants.',
    metaTitle: 'Everyday Services for Expats in Da Nang',
    metaDescription:
      'Laundry, bike repair, movers, lawyers and accountants in Da Nang used by expats, with English-speaking contacts. Verified ones carry a badge.',
    keywords: [
      'laundry Da Nang', 'movers Da Nang', 'lawyer Da Nang expat',
      'accountant Da Nang foreigner',
    ],
    schemaType: 'LocalBusiness',
    highlightAmenities: ['english-staff', 'invoice-vat', 'delivery'],
  },
]

export function getCategory(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function categoryLabel(slug: BusinessCategory): string {
  return getCategory(slug)?.label ?? slug
}

/**
 * The attribute vocabulary. Stored as text keys in `businesses.amenities` so a
 * new attribute is a code change and a data edit, not a migration — but every
 * key the UI renders has to live here, otherwise it shows as a raw slug.
 */
export const AMENITIES: { key: string; label: string }[] = [
  { key: 'english-staff', label: 'English-speaking staff' },
  { key: 'english-menu', label: 'English menu' },
  { key: 'card-accepted', label: 'Cards accepted' },
  { key: 'international-insurance', label: 'International insurance' },
  { key: 'invoice-vat', label: 'VAT invoice available' },
  { key: 'wifi-fast', label: 'Fast wifi' },
  { key: 'laptop-friendly', label: 'Laptop-friendly' },
  { key: 'power-outlets', label: 'Power outlets' },
  { key: 'meeting-room', label: 'Meeting room' },
  { key: 'air-con', label: 'Air conditioning' },
  { key: 'outdoor-seating', label: 'Outdoor seating' },
  { key: 'parking', label: 'Parking' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'appointment-needed', label: 'Appointment needed' },
  { key: 'drop-in-welcome', label: 'Drop-ins welcome' },
  { key: 'no-lock-in-contract', label: 'No lock-in contract' },
  { key: 'pet-friendly', label: 'Pet-friendly' },
  { key: 'kid-friendly', label: 'Kid-friendly' },
  { key: 'vegan-options', label: 'Vegan options' },
  { key: 'halal', label: 'Halal' },
  { key: 'wheelchair-access', label: 'Wheelchair access' },
]

export function amenityLabel(key: string): string {
  return AMENITIES.find((a) => a.key === key)?.label ?? key
}

export const ENGLISH_LEVEL_LABELS: Record<EnglishLevel, string> = {
  fluent: 'Fluent English',
  basic: 'Basic English',
  none: 'Vietnamese only',
}

/**
 * Label for a row's English level, or null when nobody has recorded one.
 * Callers are expected to drop the chip entirely on null: an unchecked
 * business must not read as "Basic English".
 */
export function englishLabel(level: EnglishLevel | null): string | null {
  return level ? ENGLISH_LEVEL_LABELS[level] : null
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: 'Cash',
  card: 'Card',
  'bank-transfer': 'Bank transfer',
  'e-wallet': 'E-wallet',
}

/** $ / $$ / $$$, or null when the price level was never recorded. */
export function priceLevelLabel(level: number | null): string | null {
  if (!level || level < 1) return null
  return '$'.repeat(Math.min(level, 3))
}

/**
 * How long a verification is treated as current.
 *
 * A badge that never expires is the fastest way to lose the trust the badge
 * exists to carry: businesses change hands, drop their English-speaking
 * receptionist, or stop taking cards. Six months matches the re-verification
 * cadence the directory is run on.
 */
export const VERIFICATION_VALID_MONTHS = 6

export interface VerificationState {
  /** True only while the check is still inside its validity window. */
  current: boolean
  /** "Verified Oct 2026", or null when the business was never verified. */
  label: string | null
  /** True when it was verified once, but the check has aged out. */
  stale: boolean
}

export function verificationState(b: Pick<Business, 'verified' | 'verified_at'>): VerificationState {
  if (!b.verified || !b.verified_at) return { current: false, label: null, stale: false }
  const at = new Date(b.verified_at)
  if (Number.isNaN(at.getTime())) return { current: false, label: null, stale: false }

  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - VERIFICATION_VALID_MONTHS)
  const label = at.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  const current = at >= cutoff
  return { current, label, stale: !current }
}

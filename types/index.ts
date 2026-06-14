export interface ServiceRequest {
  id: string
  created_at: string
  name: string
  services: string[]
  timeline: string
  details?: string
  contact_pref: 'whatsapp' | 'email' | 'telegram'
  contact_value: string
  status: 'new' | 'in-progress' | 'done'
  admin_notes?: string
}

export interface Listing {
  id: string
  created_at: string
  service_slug: string
  title: string
  description?: string
  price?: string
  location?: string
  area?: string
  tags?: string[]
  image_url?: string
  verified: boolean
  active: boolean
  sort_order: number
}

export interface Review {
  id: string
  created_at: string
  author_name: string
  author_info?: string
  rating: number
  quote: string
  status: 'pending' | 'approved' | 'rejected'
  sort_order: number
}

export interface SiteStat {
  key: string
  value: string
  label?: string
}

export interface ServiceConfig {
  slug: string
  title: string
  description: string
  price: string
  icon: string
  bullets: string[]
  metaDescription: string
}

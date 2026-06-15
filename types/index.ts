export type AssignmentStatus =
  | 'pool'
  | 'claimed'
  | 'in_progress'
  | 'completed'
  | 'released'
  | 'cancelled'

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
  // Pool / claim lifecycle (Phase 1)
  assigned_partner_id?: string | null
  assignment_status: AssignmentStatus
  claimed_at?: string | null
  quote?: string | null
  partner_notes?: string | null
}

// Anonymized pool row returned by list_available_requests() — no PII
export interface AvailableRequest {
  id: string
  created_at: string
  services: string[]
  timeline: string
  details_preview: string
}

export type ListingStatus = 'draft' | 'submitted' | 'approved' | 'rejected'

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
  partner_id?: string | null
  status: ListingStatus
}

export interface Partner {
  id: string
  created_at: string
  name: string
  contact_email?: string | null
  contact_phone?: string | null
  services: string[]
  areas?: string[]
  status: 'active' | 'suspended'
  commission_pct?: number | null
}

export interface Profile {
  user_id: string
  created_at: string
  role: 'admin' | 'partner'
  partner_id?: string | null
}

export interface RequestEvent {
  id: string
  created_at: string
  request_id: string
  actor_partner_id?: string | null
  actor_admin?: string | null
  type: string
  payload?: Record<string, unknown> | null
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

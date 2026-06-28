import { z } from 'zod'

export const serviceRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  services: z.array(z.string()).min(1, 'Select at least one service'),
  timeline: z.string().min(1, 'Timeline is required'),
  details: z.string().optional(),
  contact_pref: z.enum(['whatsapp', 'email', 'telegram']),
  contact_value: z.string().min(1, 'Contact info is required'),
})

export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>

export const reviewSchema = z.object({
  author_name: z.string().min(1, 'Name is required'),
  author_info: z.string().optional(),
  rating: z.number().int().min(1).max(5).default(5),
  quote: z.string().min(10, 'Review must be at least 10 characters'),
})

export type ReviewInput = z.infer<typeof reviewSchema>

export const housingInquirySchema = z.object({
  listing_id: z.string().uuid(),
  listing_title: z.string().min(1),
  name: z.string().min(1, 'Name is required'),
  contact_channel: z.enum(['zalo', 'whatsapp', 'telegram', 'email']),
  contact_value: z.string().min(1, 'Contact info is required'),
  rental_duration: z.string().optional(),
  preferred_viewing_date: z.string().optional(),
  message: z.string().max(1000).optional(),
  hp: z.string().max(0, 'Bot detected').optional(),
})

export type HousingInquiryInput = z.infer<typeof housingInquirySchema>

export const housingSearchRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact_channel: z.enum(['zalo', 'whatsapp', 'telegram', 'email']),
  contact_value: z.string().min(1, 'Contact info is required'),
  budget_usd_max: z.number().positive().optional(),
  districts: z.array(z.string()).optional(),
  type_preferences: z.array(z.string()).optional(),
  min_bedrooms: z.number().int().min(0).optional(),
  move_in_date: z.string().optional(),
  duration: z.string().optional(),
  notes: z.string().max(1000).optional(),
  hp: z.string().max(0, 'Bot detected').optional(),
})

export type HousingSearchRequestInput = z.infer<typeof housingSearchRequestSchema>

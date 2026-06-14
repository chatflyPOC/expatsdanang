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

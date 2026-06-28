import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
  listing_id: z.string().uuid(),
  listing_title: z.string().min(1),
  name: z.string().min(1),
  contact_channel: z.enum(['zalo', 'whatsapp', 'telegram', 'email']),
  contact_value: z.string().min(1),
  start_date: z.string().optional(),
  duration_days: z.number().int().positive().optional(),
  delivery_method: z.enum(['store_pickup', 'home_delivery']).default('store_pickup'),
  delivery_address: z.string().max(300).optional(),
  message: z.string().max(500).optional(),
  hp: z.string().max(0, 'Bot detected').optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { hp, ...data } = result.data

  // Honeypot: silently accept but don't save
  if (hp) return NextResponse.json({ ok: true })

  const supabase = createAdminClient()

  const { error } = await supabase.from('motorbike_inquiries').insert(data)
  if (error) {
    console.error('[motorbike/inquiries]', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }

  // Increment inquiry_count
  supabase.from('motorbike_listings')
    .select('inquiry_count').eq('id', data.listing_id).single()
    .then(({ data: d }) => {
      if (d) {
        supabase.from('motorbike_listings')
          .update({ inquiry_count: (d as unknown as { inquiry_count: number }).inquiry_count + 1 })
          .eq('id', data.listing_id).then(() => {})
      }
    })

  return NextResponse.json({ ok: true })
}

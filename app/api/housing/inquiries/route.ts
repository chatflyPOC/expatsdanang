import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { housingInquirySchema } from '@/lib/validations'
import { sendHousingInquiryNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = housingInquirySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { hp, ...data } = parsed.data

    // Honeypot — silently accept but don't persist
    if (hp) return NextResponse.json({ success: true })

    const supabase = createAdminClient()
    const { data: row, error } = await supabase
      .from('housing_inquiries')
      .insert(data)
      .select('id')
      .single()

    if (error) throw error

    // Increment inquiry count on the listing (fire and forget)
    supabase
      .from('housing_listings')
      .select('inquiry_count')
      .eq('id', data.listing_id)
      .single()
      .then(({ data: l }) => {
        if (l) {
          supabase
            .from('housing_listings')
            .update({ inquiry_count: (l as { inquiry_count: number }).inquiry_count + 1 })
            .eq('id', data.listing_id)
            .then(({ error: e }) => { if (e) console.error('[inquiry_count]', e) })
        }
      })

    // Notify admin
    sendHousingInquiryNotification({ ...data, id: row.id }).catch(e =>
      console.error('[housing inquiry email]', e)
    )

    return NextResponse.json({ success: true, id: row.id })
  } catch (err) {
    console.error('[housing/inquiries]', err)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}

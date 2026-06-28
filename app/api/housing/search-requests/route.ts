import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { housingSearchRequestSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = housingSearchRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { hp, ...data } = parsed.data
    if (hp) return NextResponse.json({ success: true })

    const supabase = createAdminClient()
    const { error } = await supabase.from('housing_search_requests').insert(data)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[housing/search-requests]', err)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}

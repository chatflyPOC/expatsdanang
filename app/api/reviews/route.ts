import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { reviewSchema } from '@/lib/validations'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'approved')
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = reviewSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('reviews')
      .insert({ ...parsed.data, status: 'pending' })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('Review error:', err)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}

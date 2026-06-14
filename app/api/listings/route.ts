import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const service_slug = searchParams.get('service_slug')
  const area = searchParams.get('area')
  const price_range = searchParams.get('price_range')

  const supabase = await createClient()
  let query = supabase.from('listings').select('*').eq('active', true)

  if (service_slug) query = query.eq('service_slug', service_slug)
  if (area) query = query.eq('area', area)

  const { data, error } = await query.order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

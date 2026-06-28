import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { PUBLIC_COLUMNS } from '@/types/motorbike'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const supabase = createAdminClient()

  let query = supabase
    .from('motorbike_listings')
    .select(PUBLIC_COLUMNS)
    .eq('status', 'available')

  const district = searchParams.get('district')
  if (district) query = query.eq('district', district)

  const type = searchParams.get('type')
  if (type) query = query.eq('type', type)

  const maxPrice = searchParams.get('maxPricePerDay')
  if (maxPrice) query = query.lte('price_per_day_usd', Number(maxPrice))

  if (searchParams.get('helmetIncluded') === 'true') query = query.eq('helmet_included', true)
  if (searchParams.get('insuranceIncluded') === 'true') query = query.eq('insurance_included', true)
  if (searchParams.get('deliveryAvailable') === 'true') query = query.eq('delivery_available', true)

  const minCC = searchParams.get('minEngineCC')
  if (minCC) query = query.gte('engine_cc', Number(minCC))

  const sort = searchParams.get('sort') ?? 'newest'
  if (sort === 'price_asc') query = query.order('price_per_day_usd', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price_per_day_usd', { ascending: false })
  else query = query.order('featured', { ascending: false }).order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('[motorbike/listings]', error)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }

  return NextResponse.json({ listings: data ?? [] })
}

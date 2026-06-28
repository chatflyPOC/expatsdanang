import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { PUBLIC_COLUMNS } from '@/types/housing'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const district = searchParams.get('district')
  const type = searchParams.get('type')
  const priceMin = searchParams.get('price_min')
  const priceMax = searchParams.get('price_max')
  const minBedrooms = searchParams.get('min_bedrooms')
  const minDuration = searchParams.get('min_duration')
  const petsAllowed = searchParams.get('pets_allowed')
  const hasPool = searchParams.get('has_pool')
  const hasSeaview = searchParams.get('has_seaview')
  const fullyFurnished = searchParams.get('fully_furnished')
  const sort = searchParams.get('sort') ?? 'newest'
  const featured = searchParams.get('featured')

  const supabase = createAdminClient()
  let query = supabase
    .from('housing_listings')
    .select(PUBLIC_COLUMNS)
    .eq('status', 'available')
    .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())

  if (district) query = query.eq('district', district)
  if (type) query = query.eq('type', type)
  if (priceMin) query = query.gte('price_usd', Number(priceMin))
  if (priceMax) query = query.lte('price_usd', Number(priceMax))
  if (minBedrooms) query = query.gte('bedrooms', Number(minBedrooms))
  if (minDuration) query = query.eq('min_duration', minDuration)
  if (petsAllowed === 'true') query = query.eq('pets_allowed', true)
  if (hasPool === 'true') query = query.eq('has_pool', true)
  if (hasSeaview === 'true') query = query.contains('views', ['sea'])
  if (fullyFurnished === 'true') query = query.eq('furnishing', 'full')
  if (featured === 'true') query = query.eq('featured', true)

  switch (sort) {
    case 'price_asc':
      query = query.order('price_usd', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price_usd', { ascending: false })
      break
    case 'nearest_beach':
      query = query.order('distance_to_beach_m', { ascending: true, nullsFirst: false })
      break
    default:
      query = query.order('featured', { ascending: false }).order('created_at', { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error('[housing/listings]', error)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { PUBLIC_COLUMNS } from '@/types/directory'

/**
 * Filtered directory search, called by DirectoryBrowser on every filter change.
 *
 * Amenity filters use `contains` (PostgREST `cs`) so several amenities AND
 * together — a visitor asking for cards accepted *and* fast wifi means both,
 * not either.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const supabase = createAdminClient()

  let query = supabase
    .from('businesses')
    .select(PUBLIC_COLUMNS)
    .eq('status', 'published')

  const category = searchParams.get('category')
  if (category) query = query.eq('category', category)

  const district = searchParams.get('district')
  if (district) query = query.eq('district', district)

  if (searchParams.get('englishFluent') === 'true') {
    query = query.eq('english_level', 'fluent')
  }
  if (searchParams.get('verifiedOnly') === 'true') {
    query = query.eq('verified', true)
  }

  // Parsed defensively: a non-numeric value reaches Postgres as NaN and the
  // whole query fails with a 500, so anything unparseable is simply ignored.
  const maxPrice = Number(searchParams.get('maxPriceLevel'))
  if (Number.isFinite(maxPrice) && maxPrice > 0) {
    query = query.lte('price_level', maxPrice)
  }

  const amenities = searchParams.getAll('amenity').filter(Boolean)
  if (amenities.length) query = query.contains('amenities', amenities)

  const q = searchParams.get('q')?.trim()
  if (q) {
    // Keep the pattern harmless inside PostgREST's `or` list: a comma would
    // split it into extra filters and a paren would unbalance the group.
    const safe = q.replace(/[,()*]/g, ' ').trim()
    if (safe) {
      query = query.or(
        `name.ilike.%${safe}%,short_description.ilike.%${safe}%,address.ilike.%${safe}%`
      )
    }
  }

  const sort = searchParams.get('sort') ?? 'recommended'
  if (sort === 'newest') {
    query = query.order('created_at', { ascending: false })
  } else if (sort === 'name') {
    query = query.order('name', { ascending: true })
  } else {
    query = query
      .order('featured', { ascending: false })
      .order('verified', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error('[directory/businesses]', error)
    return NextResponse.json({ error: 'Failed to fetch businesses' }, { status: 500 })
  }

  return NextResponse.json({ businesses: data ?? [] })
}

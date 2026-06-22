import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('guide_rating_aggregates')
    .select('rating_value, review_count')
    .eq('guide_slug', slug)
    .single()

  if (error || !data) {
    return NextResponse.json({ ratingValue: null, reviewCount: 0 })
  }
  return NextResponse.json({
    ratingValue: Number(data.rating_value),
    reviewCount: Number(data.review_count),
  })
}

export async function POST(req: NextRequest) {
  const { slug, rating } = await req.json()
  if (!slug || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('guide_ratings')
    .insert({ guide_slug: slug, rating: Number(rating) })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Return the updated aggregate
  const { data } = await supabase
    .from('guide_rating_aggregates')
    .select('rating_value, review_count')
    .eq('guide_slug', slug)
    .single()

  return NextResponse.json({
    ratingValue: data ? Number(data.rating_value) : rating,
    reviewCount: data ? Number(data.review_count) : 1,
  })
}

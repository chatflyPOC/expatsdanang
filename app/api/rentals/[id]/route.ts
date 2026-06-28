import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { PUBLIC_COLUMNS } from '@/types/housing'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('housing_listings')
    .select(PUBLIC_COLUMNS)
    .eq('id', id)
    .in('status', ['available', 'pending'])
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Increment view_count asynchronously (fire-and-forget, never blocks response)
  supabase.rpc('increment_view_count', { listing_id: id }).then(() => {})

  return NextResponse.json({ listing: data })
}

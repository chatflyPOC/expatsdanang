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
    .eq('status', 'available')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const listing = data as unknown as { view_count: number }

  // Increment view count asynchronously — don't block response
  supabase
    .from('housing_listings')
    .update({ view_count: (listing.view_count ?? 0) + 1 })
    .eq('id', id)
    .then(({ error: e }) => { if (e) console.error('[view_count]', e) })

  return NextResponse.json(data)
}

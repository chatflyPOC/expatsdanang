import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { PUBLIC_COLUMNS } from '@/types/motorbike'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('motorbike_listings')
    .select(PUBLIC_COLUMNS)
    .eq('id', id)
    .eq('status', 'available')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Increment view count async (fire-and-forget)
  supabase.from('motorbike_listings')
    .select('view_count').eq('id', id).single()
    .then(({ data: d }) => {
      if (d) {
        supabase.from('motorbike_listings')
          .update({ view_count: (d as unknown as { view_count: number }).view_count + 1 })
          .eq('id', id).then(() => {})
      }
    })

  return NextResponse.json({ listing: data })
}

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 86400 // 24h ISR

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_stats').select('*')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

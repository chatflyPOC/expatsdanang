import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { serviceRequestSchema } from '@/lib/validations'
import { sendAdminNotification, sendUserConfirmation } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = serviceRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('service_requests')
      .insert(parsed.data)
      .select()
      .single()

    if (error) throw error

    const emailResults = await Promise.allSettled([
      sendAdminNotification({ ...parsed.data, id: data.id }),
      sendUserConfirmation(parsed.data),
    ])
    emailResults.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`[email] ${i === 0 ? 'admin notification' : 'user confirmation'} failed:`, r.reason)
      }
    })

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('Request error:', err)
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSsrClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

// Verify the caller is a logged-in admin before any privileged action.
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, status: 401, error: 'Not authenticated' }
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('user_id', user.id).single()
  if (profile?.role !== 'admin') return { ok: false as const, status: 403, error: 'Admin only' }
  return { ok: true as const }
}

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createSsrClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

// POST — create a partner (org + login + profile link) in one step.
export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const svc = serviceClient()
  if (!svc) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY is not set — required to create partner logins.' },
      { status: 500 }
    )
  }

  const body = await req.json()
  const { name, contact_email, contact_phone, services, password } = body as {
    name: string; contact_email: string; contact_phone?: string; services: string[]; password: string
  }

  if (!name || !contact_email || !password) {
    return NextResponse.json({ error: 'name, contact_email and password are required' }, { status: 400 })
  }

  // 1. Create the auth user (email pre-confirmed so they can log in immediately)
  const { data: created, error: userErr } = await svc.auth.admin.createUser({
    email: contact_email,
    password,
    email_confirm: true,
  })
  if (userErr || !created.user) {
    return NextResponse.json({ error: userErr?.message || 'Failed to create login' }, { status: 400 })
  }

  // 2. Create the partner org
  const { data: partner, error: pErr } = await svc
    .from('partners')
    .insert({ name, contact_email, contact_phone, services: services || [] })
    .select()
    .single()
  if (pErr) {
    // Roll back the orphaned auth user so a retry can reuse the email
    await svc.auth.admin.deleteUser(created.user.id)
    return NextResponse.json({ error: pErr.message }, { status: 400 })
  }

  // 3. Link the login to the partner with role 'partner'
  const { error: profErr } = await svc
    .from('profiles')
    .insert({ user_id: created.user.id, role: 'partner', partner_id: partner.id })
  if (profErr) {
    await svc.auth.admin.deleteUser(created.user.id)
    await svc.from('partners').delete().eq('id', partner.id)
    return NextResponse.json({ error: profErr.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, partner })
}

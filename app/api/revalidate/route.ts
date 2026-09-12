import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/**
 * On-demand cache invalidation for the listing pages.
 *
 * The admin tabs write to Supabase straight from the browser, so a delete or an
 * edit never passes through the Next.js server — which means nothing was ever
 * invalidating the ISR caches on /housing, /motorbike-rental and /sitemap.xml.
 * An admin could remove a bike and still see it on the public site for up to an
 * hour, with no way to tell whether the delete had failed.
 *
 * The tabs now call this after every mutation. Per the Next.js docs, calling
 * revalidatePath from a route handler marks the path so the next visitor gets a
 * fresh render, rather than rebuilding immediately.
 */

const REVALIDATABLE: Record<string, string[]> = {
  motorbike: ['/motorbike-rental', '/sitemap.xml'],
  housing: ['/housing', '/sitemap.xml'],
  guides: ['/guides', '/sitemap.xml'],
}

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, status: 401, error: 'Not authenticated' }
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('user_id', user.id).single()
  if (profile?.role !== 'admin') return { ok: false as const, status: 403, error: 'Admin only' }
  return { ok: true as const }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let scope: string
  try {
    scope = (await req.json())?.scope
  } catch {
    return NextResponse.json({ error: 'Body must be JSON' }, { status: 400 })
  }

  const paths = REVALIDATABLE[scope]
  if (!paths) {
    return NextResponse.json(
      { error: `Unknown scope. Expected one of: ${Object.keys(REVALIDATABLE).join(', ')}` },
      { status: 400 }
    )
  }

  paths.forEach((p) => revalidatePath(p))
  return NextResponse.json({ revalidated: paths })
}

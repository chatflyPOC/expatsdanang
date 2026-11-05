import { createAdminClient } from '@/lib/supabase/server'
import { Business, BusinessCategory, PUBLIC_COLUMNS } from '@/types/directory'

/**
 * Server-side reads for the directory pages.
 *
 * Same reasoning as lib/listings.ts: the browser component refetches through
 * /api/directory on every filter change, but the first paint has to contain
 * real rows and real detail links for crawlers that never run the JS.
 *
 * Every query here is wrapped so an unreachable Supabase degrades to an empty
 * directory instead of failing the prerender — these pages are statically
 * generated, and a build that dies on a missing env var is worse than a page
 * that fills in on the next revalidation.
 */

export async function getBusinesses(
  category?: BusinessCategory
): Promise<Business[]> {
  try {
    const supabase = createAdminClient()
    let query = supabase
      .from('businesses')
      .select(PUBLIC_COLUMNS)
      .eq('status', 'published')
    if (category) query = query.eq('category', category)

    const { data, error } = await query
      .order('featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[directory] getBusinesses:', error.message)
      return []
    }
    return (data as unknown as Business[] | null) ?? []
  } catch (error) {
    console.error('[directory] getBusinesses failed:', error)
    return []
  }
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('businesses')
      .select(PUBLIC_COLUMNS)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    return (data as unknown as Business | null) ?? null
  } catch {
    return null
  }
}

/**
 * Other published places in the same category, district first.
 *
 * Ordering happens in SQL rather than by scoring in JS (as the motorbike page
 * does) because the only signals that matter here are same-district and
 * verified — there is no price or spec to weigh.
 */
export async function getRelatedBusinesses(business: Business, limit = 4): Promise<Business[]> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('businesses')
      .select(PUBLIC_COLUMNS)
      .eq('status', 'published')
      .eq('category', business.category)
      .neq('id', business.id)
      .limit(24)
    const rows = (data as unknown as Business[] | null) ?? []
    return rows
      .map((row) => ({
        row,
        score:
          (row.district === business.district ? 2 : 0) +
          (row.verified ? 1 : 0) +
          (row.featured ? 1 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ row }) => row)
  } catch {
    return []
  }
}

/** Per-category counts for the hub's category grid. */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('businesses')
      .select('category')
      .eq('status', 'published')
    const counts: Record<string, number> = {}
    for (const row of (data as { category: string }[] | null) ?? []) {
      counts[row.category] = (counts[row.category] ?? 0) + 1
    }
    return counts
  } catch {
    return {}
  }
}

/** Slug + updated_at for every published business, for the sitemap. */
export async function getBusinessSitemapRows(): Promise<
  { slug: string; category: string; updated_at: string | null }[]
> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('businesses')
      .select('slug, category, updated_at')
      .eq('status', 'published')
    if (error) {
      console.error('[directory] sitemap rows:', error.message)
      return []
    }
    return (data as { slug: string; category: string; updated_at: string | null }[] | null) ?? []
  } catch {
    return []
  }
}

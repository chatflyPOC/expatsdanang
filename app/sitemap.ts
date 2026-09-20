import { MetadataRoute } from 'next'
import { SERVICES } from '@/lib/services'
import { GUIDES } from '@/lib/guides'
import { SITE } from '@/lib/seo'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * Regenerate hourly rather than pinning listings to build time, so newly
 * published inventory reaches the sitemap within the hour instead of waiting
 * for the next deploy.
 */
export const revalidate = 3600

interface ListingRow {
  id: string
  created_at: string | null
}

/**
 * Listing rows for the sitemap, or empty if the database can't be reached.
 *
 * This route is prerendered, so an unreachable Supabase (missing env vars in a
 * preview environment, an outage mid-deploy) used to throw and fail the whole
 * build. A sitemap missing its dynamic entries is recoverable on the next
 * revalidation; a blocked deploy is not.
 */
async function getListingRows(): Promise<{
  housing: ListingRow[]
  motorbike: ListingRow[]
}> {
  try {
    const supabase = createAdminClient()
    const [housingRes, motorbikeRes] = await Promise.all([
      supabase.from('housing_listings').select('id, created_at').eq('status', 'available'),
      supabase.from('motorbike_listings').select('id, created_at').eq('status', 'available'),
    ])
    // Supabase reports a bad column as `error`, not a thrown exception. Reading
    // only `data` meant a query naming a non-existent column returned null and
    // silently produced a listing-free sitemap — which is exactly what happened
    // with `updated_at`, a column neither table has. Log it loudly instead.
    for (const [table, res] of [
      ['housing_listings', housingRes],
      ['motorbike_listings', motorbikeRes],
    ] as const) {
      if (res.error) {
        console.error(`[sitemap] ${table} query failed: ${res.error.message}`)
      }
    }
    return { housing: housingRes.data ?? [], motorbike: motorbikeRes.data ?? [] }
  } catch (error) {
    console.error('[sitemap] listing lookup failed, emitting static routes only:', error)
    return { housing: [], motorbike: [] }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const { housing: housingListings, motorbike: motorbikeListings } =
    await getListingRows()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/get-help`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE.url}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE.url}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/housing`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE.url}/motorbike-rental`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
  ]

  const servicePages: MetadataRoute.Sitemap = SERVICES.filter((s) => !s.hubPath).map((s) => ({
    url: `${SITE.url}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const guidePages: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${SITE.url}/guides/${g.slug}`,
    // Use publication date if available; fall back to September 2026 for new content
    lastModified: g.updated === 'September 2026' ? now : new Date('2026-06-22'),
    changeFrequency: 'weekly',
    priority: g.updated === 'September 2026' ? 0.9 : 0.85, // Boost priority for fresh content
  }))

  const housingPages: MetadataRoute.Sitemap = (housingListings ?? []).map((l) => ({
    url: `${SITE.url}/rentals/${l.id}`,
    lastModified: l.created_at ? new Date(l.created_at) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const motorbikePages: MetadataRoute.Sitemap = (motorbikeListings ?? []).map((l) => ({
    url: `${SITE.url}/motorbike-rental/${l.id}`,
    lastModified: l.created_at ? new Date(l.created_at) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...servicePages, ...guidePages, ...housingPages, ...motorbikePages]
}

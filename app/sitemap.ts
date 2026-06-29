import { MetadataRoute } from 'next'
import { SERVICES } from '@/lib/services'
import { GUIDES } from '@/lib/guides'
import { SITE } from '@/lib/seo'
import { createAdminClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const supabase = createAdminClient()

  const [{ data: housingListings }, { data: motorbikeListings }] = await Promise.all([
    supabase.from('housing_listings').select('id, updated_at').eq('status', 'active'),
    supabase.from('motorbike_listings').select('id, updated_at').eq('status', 'active'),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/get-help`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE.url}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE.url}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/housing`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE.url}/motorbike-rental`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
  ]

  const servicePages: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${SITE.url}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const guidePages: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${SITE.url}/guides/${g.slug}`,
    lastModified: new Date('2026-06-22'),
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  const housingPages: MetadataRoute.Sitemap = (housingListings ?? []).map((l) => ({
    url: `${SITE.url}/housing/${l.id}`,
    lastModified: l.updated_at ? new Date(l.updated_at) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const motorbikePages: MetadataRoute.Sitemap = (motorbikeListings ?? []).map((l) => ({
    url: `${SITE.url}/motorbike-rental/${l.id}`,
    lastModified: l.updated_at ? new Date(l.updated_at) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...servicePages, ...guidePages, ...housingPages, ...motorbikePages]
}

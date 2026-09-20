import { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Default rules for all bots
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/admin',
          '/api/',
          '/dashboard',
          // Prevent crawling query string duplicates (filters, sorting, pagination)
          '/*?sort=',
          '/*?filter=',
          '/*?page=',
          // Prevent crawling session/tracking parameters
          '/*?utm_',
          '/*?fbclid',
          '/*?gclid',
        ],
        crawlDelay: 1, // Polite crawl rate for general bots
      },
      {
        // Give Googlebot faster access (Google respects crawlDelay)
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/admin', '/api/', '/dashboard'],
        crawlDelay: 0.1,
      },
      {
        // Bing crawler
        userAgent: 'Bingbot',
        allow: ['/'],
        disallow: ['/admin', '/api/', '/dashboard'],
        crawlDelay: 1,
      },
      {
        // Block low-quality/aggressive bots
        userAgent: 'MJ12bot',
        disallow: ['/'],
      },
      {
        userAgent: 'SemrushBot',
        disallow: ['/'],
      },
      {
        userAgent: 'DotBot',
        disallow: ['/'],
      },
      {
        userAgent: 'AhrefsBot',
        disallow: ['/'],
      },
    ],
    sitemap: [
      `${SITE.url}/sitemap.xml`,
    ],
    host: SITE.url,
  }
}

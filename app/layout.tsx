import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SiteChrome } from '@/components/SiteChrome'
import { SITE } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Expats Da Nang — Your Local Assistant in Da Nang, Vietnam',
    template: '%s | Expats Da Nang',
  },
  description: SITE.description,
  applicationName: SITE.name,
  category: 'travel',
  keywords: [
    'expat services Da Nang', 'Da Nang concierge', 'living in Da Nang', 'expat Da Nang',
    'foreigner services Da Nang', 'Da Nang housing', 'Da Nang visa', 'moving to Da Nang',
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: '/' },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Expats Da Nang — Your Local Assistant',
    description: 'Trusted local services for expats in Da Nang, Vietnam. Housing, visas, transfers and more.',
    type: 'website',
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    images: [{ url: '/og.svg', width: 1200, height: 630, alt: 'Expats Da Nang — Your local assistant in Da Nang, Vietnam' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Expats Da Nang — Your Local Assistant',
    description: 'Trusted local services for expats in Da Nang, Vietnam.',
    images: ['/og.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export const viewport: Viewport = {
  themeColor: '#1D9E75',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-gray-900 bg-white`}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}

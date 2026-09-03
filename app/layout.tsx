import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { SiteChrome } from '@/components/SiteChrome'
import { SITE } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

/** Google Tag Manager container. Override per-environment if a staging container is added. */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-N9VF2W8W'

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
      <head>
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        {/* End Google Tag Manager */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","xb1xofgqy2");`,
          }}
        />
      </head>
      <body className={`${inter.className} text-gray-900 bg-white`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}

'use client'
import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { FloatingActions } from '@/components/FloatingActions'
import { JsonLd } from '@/components/JsonLd'
import { organizationLd, websiteLd, localBusinessLd } from '@/lib/seo'

/**
 * Renders the public marketing chrome (navbar, footer, floating chat, SEO JSON-LD)
 * everywhere EXCEPT the admin and partner consoles, which provide their own shell.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const bare = pathname?.startsWith('/admin') || pathname?.startsWith('/partner')

  if (bare) return <>{children}</>

  return (
    <>
      <JsonLd data={[organizationLd(), websiteLd(), localBusinessLd()]} />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingActions />
    </>
  )
}

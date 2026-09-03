import type { Metadata } from 'next'

/**
 * The partner console is an authenticated internal tool, not customer-facing.
 * The root layout opts the whole site into `index, follow`, so these routes
 * need an explicit override — robots.txt already disallows /admin but not
 * /partner, and /partner/login was being served as indexable.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

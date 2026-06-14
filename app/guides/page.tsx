import Link from 'next/link'
import { GuidesBrowser } from '@/components/GuidesBrowser'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Expat Guides for Da Nang',
  description:
    'Practical guides for expats living in Da Nang — visas, banking, housing, transport, cost of living and healthcare. Written by people who live here.',
  path: '/guides',
  keywords: ['Da Nang expat guides', 'living in Da Nang', 'moving to Da Nang', 'Da Nang guide'],
})

export default function GuidesPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75] mb-3">Resources</p>
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">Expat guides for Da Nang</h1>
        <p className="text-gray-600 max-w-xl">
          Practical, no-fluff guides written by people who actually live here. Everything you need to know to settle in smoothly.
        </p>
      </div>

      <GuidesBrowser />

      <div className="bg-[#f0fdf9] border border-[#E1F5EE] rounded-2xl p-8 text-center mt-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Have a specific question?</h2>
        <p className="text-gray-600 mb-6">We know Da Nang inside out. Just ask us directly.</p>
        <Link
          href="/get-help"
          className="inline-flex items-center bg-[#1D9E75] text-white font-medium px-6 py-3 rounded-full hover:bg-[#0F6E56] transition-colors"
        >
          Ask us anything →
        </Link>
      </div>
    </div>
  )
}

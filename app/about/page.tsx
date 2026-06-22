import Link from 'next/link'
import { MapPin, Heart, ShieldCheck, MessageCircle } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'About Us',
  description: 'We are expats and locals who live in Da Nang. We built the service we wished existed when we first arrived — trusted, local help for foreigners settling in.',
  path: '/about',
  keywords: ['about Expats Da Nang', 'expat help Da Nang', 'living in Da Nang'],
})

const VALUES = [
  {
    icon: MapPin,
    title: 'We actually live here',
    body: 'We are not a booking platform run from abroad. Our team is based in Da Nang — we know the landlords, the banks, and the shortcuts.',
  },
  {
    icon: ShieldCheck,
    title: 'Vetted partners only',
    body: 'Every provider we recommend has been personally tested or comes with verified track records from our community. No kickbacks, no fake reviews.',
  },
  {
    icon: Heart,
    title: 'Expat-first mindset',
    body: 'We have been through the confusion of arriving in a new country. Everything we do is designed to remove friction for the expat, not add to it.',
  },
  {
    icon: MessageCircle,
    title: 'Real humans, fast replies',
    body: 'No bots, no auto-responders. You get a real person who replies within 2 hours and follows up until your problem is solved.',
  },
]

const STATS = [
  { value: '200+', label: 'Expats helped' },
  { value: '4.9/5', label: 'Average rating' },
  { value: '2 hrs', label: 'Average reply time' },
  { value: '6', label: 'Services covered' },
]

export default function AboutPage() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '84000000000'

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#f0fdf9] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75] mb-4">About us</p>
          <h1 className="text-4xl font-semibold text-gray-900 leading-tight mb-5">
            The local team that makes Da Nang easy for expats
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We are a small team of expats and Da Nang locals who got tired of watching new arrivals waste weeks navigating bureaucracy, getting overcharged, or living in the wrong neighbourhood because no one gave them straight answers.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mt-4">
            So we built the service we wished existed when we first arrived.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#E5E7EB] bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-semibold text-[#1D9E75] mb-1">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-10">What we stand for</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-5">
              <div className="w-10 h-10 rounded-xl bg-[#E1F5EE] flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-[#1D9E75]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="bg-gray-50 border-t border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">Our story</p>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Da Nang has become one of Southeast Asia&apos;s most popular destinations for digital nomads and expats — great weather, affordable cost of living, fast internet, and a growing international community.
            </p>
            <p>
              But arriving here without local connections is hard. Landlords who only speak Vietnamese, banks that turn foreigners away, visa rules that change without notice. The information online is often outdated or wrong.
            </p>
            <p>
              We started by helping friends and friends-of-friends figure things out. Word spread. Now we help hundreds of expats a year — from people arriving for the first time to long-timers who need specific things sorted.
            </p>
            <p>
              We keep things simple: you tell us what you need, we make it happen.
            </p>
          </div>
        </div>
      </section>

      {/* Company registration */}
      <section className="border-t border-[#E5E7EB] bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">Legal entity</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">Registered company</p>
              <p className="text-sm font-medium text-gray-800">CHATFLY COMPANY LIMITED</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Tax ID (Mã số thuế)</p>
              <p className="text-sm font-medium text-gray-800">0402211642</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Registered address</p>
              <p className="text-sm font-medium text-gray-800">
                Tầng 6 - Toà nhà PvcomBank, Số 2 Đường 30/4,<br />
                Phường Hoà Cường Bắc, Quận Hải Châu,<br />
                Thành phố Đà Nẵng, Việt Nam
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0F6E56] py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-semibold text-[#9FE1CB] mb-3">Want to get in touch?</h2>
        <p className="text-[#5DCAA5] mb-8">We reply within 2 hours, every day.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/get-help"
            className="inline-flex items-center bg-[#E1F5EE] text-[#085041] font-medium px-6 py-3 rounded-full hover:bg-white transition-colors"
          >
            Send us a message →
          </Link>
          <a
            href={`https://wa.me/${wa}?text=Hi!+I+have+a+question+about+living+in+Da+Nang.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center border border-[#5DCAA5] text-[#9FE1CB] font-medium px-6 py-3 rounded-full hover:bg-[#0a5a44] transition-colors"
          >
            WhatsApp us
          </a>
        </div>
      </section>
    </div>
  )
}

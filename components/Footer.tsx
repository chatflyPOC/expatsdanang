import Link from 'next/link'
import { Logo } from '@/components/Logo'

const SERVICES = [
  { label: 'Airport Transfer', href: '/services/airport-transfer' },
  { label: 'Housing & Rental', href: '/services/housing' },
  { label: 'Visa & Documents', href: '/services/visa-documents' },
  { label: 'Bank Account', href: '/services/bank-account' },
  { label: 'Motorbike Rental', href: '/services/motorbike-rental' },
  { label: 'Translation', href: '/services/translation' },
]

const RESOURCES = [
  { label: 'Guides', href: '/guides' },
  { label: 'FAQ', href: '/faq' },
  { label: 'About', href: '/about' },
  { label: 'Get Help', href: '/get-help' },
]

export function Footer() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '84000000000'
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0A3A5C] text-white">
      {/* Main footer body */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand col */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <Logo variant="dark" size="lg" />
            </Link>
            <p className="text-[#A8D4F0] text-sm leading-relaxed mb-6 max-w-xs">
              Helping foreigners settle into Da Nang since day one — from airport to apartment, visa to bank account.
            </p>
            {/* Tagline badge */}
            <div className="inline-flex items-center gap-2 border border-[#1AA5D8]/40 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
              <span className="text-xs font-medium tracking-widest text-[#A8D4F0] uppercase">
                Live, Work &amp; Connect
              </span>
            </div>
          </div>

          {/* Services col */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#1AA5D8] uppercase mb-4">Services</p>
            <ul className="space-y-2.5">
              {SERVICES.map(s => (
                <li key={s.href}>
                  <Link href={s.href} className="text-sm text-[#A8D4F0] hover:text-white transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources col */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#1AA5D8] uppercase mb-4">Resources</p>
            <ul className="space-y-2.5">
              {RESOURCES.map(r => (
                <li key={r.href}>
                  <Link href={r.href} className="text-sm text-[#A8D4F0] hover:text-white transition-colors">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact col */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#1AA5D8] uppercase mb-4">Contact</p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={`https://wa.me/${wa}?text=Hi!+I+found+your+site+and+need+some+help+in+Da+Nang.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#A8D4F0] hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L.057 23.57a.75.75 0 00.927.927l5.718-1.471A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 01-4.952-1.352l-.355-.211-3.673.944.962-3.568-.231-.368A9.714 9.714 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                  </svg>
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="tel:+840337788044"
                  className="text-sm text-[#A8D4F0] hover:text-white transition-colors"
                >
                  +84 033 778 8044
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@expatsdanang.com"
                  className="text-sm text-[#A8D4F0] hover:text-white transition-colors"
                >
                  hello@expatsdanang.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal / company info row */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-[#A8D4F0]/50 leading-relaxed text-center sm:text-left">
            <span className="font-medium text-[#A8D4F0]/70">CHATFLY COMPANY LIMITED</span>
            {' '}·{' '}
            MST: 0402211642
            {' '}·{' '}
            Floor 6, PvcomBank Building, 2 30/4 Street, Hoa Cuong Bac Ward, Hai Chau District, Da Nang City, Vietnam
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#A8D4F0]/60">
            © {year} Expats Da Nang · CHATFLY COMPANY LIMITED. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-xs text-[#A8D4F0]/60 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-[#A8D4F0]/60 hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

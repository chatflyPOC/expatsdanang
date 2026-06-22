'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, MessageCircle, ChevronDown } from 'lucide-react'
import { Logo } from '@/components/Logo'

const SERVICES_DROPDOWN = [
  { label: 'Airport Transfer', href: '/services/airport-transfer' },
  { label: 'Housing & Rental', href: '/services/housing' },
  { label: 'Visa & Documents', href: '/services/visa-documents' },
  { label: 'Bank Account', href: '/services/bank-account' },
  { label: 'Motorbike Rental', href: '/services/motorbike-rental' },
  { label: 'Translation', href: '/services/translation' },
]

const NAV_LINKS = [
  { label: 'Guides', href: '/guides', match: '/guides' },
  { label: 'FAQ', href: '/faq', match: '/faq' },
  { label: 'About', href: '/about', match: '/about' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const servicesRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '84000000000'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (match: string) => pathname === match || pathname.startsWith(match + '/')
  const isServicesActive = isActive('/services')

  return (
    <header className="sticky top-0 z-50">
      {/* Brand accent hairline */}
      <div className="h-[3px] bg-gradient-to-r from-[#1D9E75] via-[#1AA5D8] to-[#F5A623]" />

      <nav
        className={`backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 border-b border-[#E5E7EB] shadow-[0_4px_20px_-12px_rgba(10,58,92,0.25)]'
            : 'bg-white/70 border-b border-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center" aria-label="Expats Da Nang — home">
            <Logo />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">

            {/* Services dropdown */}
            <div
              ref={servicesRef}
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className={`relative flex items-center gap-1 px-3.5 py-2 text-sm rounded-full transition-colors ${
                  isServicesActive ? 'text-[#0F6E56] font-medium' : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                Services
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                />
                {isServicesActive && (
                  <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-0.5 rounded-full bg-[#1D9E75]" />
                )}
              </button>

              {/* Dropdown panel */}
              {servicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-52 bg-white rounded-2xl shadow-[0_8px_30px_-4px_rgba(10,58,92,0.18)] border border-[#E5E7EB] py-2 animate-fade-up">
                  {SERVICES_DROPDOWN.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className={`block px-4 py-2.5 text-sm transition-colors ${
                        pathname === s.href
                          ? 'text-[#0F6E56] font-medium bg-[#E1F5EE]'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => setServicesOpen(false)}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Other nav links */}
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-3.5 py-2 text-sm rounded-full transition-colors ${
                  isActive(l.match)
                    ? 'text-[#0F6E56] font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {l.label}
                {isActive(l.match) && (
                  <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-0.5 rounded-full bg-[#1D9E75]" />
                )}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href={`https://wa.me/${wa}?text=Hi!+I+need+some+help+in+Da+Nang.`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:text-[#1D9E75] hover:bg-[#E1F5EE] transition-colors"
            >
              <MessageCircle size={18} />
            </a>
            <Link
              href="/get-help"
              className="inline-flex items-center bg-[#1D9E75] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#0F6E56] transition-colors shadow-sm hover:shadow-md"
            >
              Get help →
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile panel */}
        {open && (
          <div className="md:hidden border-t border-[#E5E7EB] bg-white px-4 py-4 flex flex-col gap-1 animate-fade-up">
            {/* Services section in mobile */}
            <p className="px-3 pt-1 pb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">Services</p>
            {SERVICES_DROPDOWN.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className={`px-3 py-2.5 rounded-lg text-sm ${
                  pathname === s.href ? 'bg-[#E1F5EE] text-[#0F6E56] font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setOpen(false)}
              >
                {s.label}
              </Link>
            ))}
            <div className="my-1 border-t border-[#E5E7EB]" />
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2.5 rounded-lg text-sm ${
                  isActive(l.match) ? 'bg-[#E1F5EE] text-[#0F6E56] font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/get-help"
              className="mt-2 inline-flex items-center justify-center bg-[#1D9E75] text-white text-sm font-medium px-5 py-3 rounded-full"
              onClick={() => setOpen(false)}
            >
              Get help →
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { ArrowUp, MessageCircle, X } from 'lucide-react'

/**
 * Global floating actions:
 *  - WhatsApp quick-chat bubble (with a pulsing ring + expandable card)
 *  - Back-to-top button that appears after scrolling
 */
export function FloatingActions() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '84000000000'
  const [showTop, setShowTop] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 print:hidden">
      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="animate-fade-in w-11 h-11 rounded-full bg-white border border-[#E5E7EB] shadow-md text-gray-500 hover:text-[#1D9E75] hover:border-[#1D9E75]/40 flex items-center justify-center transition-colors"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* Expandable chat card */}
      {open && (
        <div className="animate-fade-up w-72 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden">
          <div className="bg-[#0A3A5C] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
              <p className="text-sm font-medium text-white">Expats Da Nang</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-white/70 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              👋 Hi! Need help with something in Da Nang? Message us on WhatsApp — we usually reply within a couple of hours.
            </p>
            <a
              href={`https://wa.me/${wa}?text=Hi!+I+found+your+site+and+need+some+help+in+Da+Nang.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-[#1ebe5e] transition-colors"
            >
              <MessageCircle size={16} /> Start a chat
            </a>
          </div>
        </div>
      )}

      {/* Main WhatsApp toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat on WhatsApp"
        className={`pulse-ring relative w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:bg-[#1ebe5e] transition-colors ${open ? 'rotate-0' : ''}`}
      >
        {open ? <X size={24} /> : <MessageCircle size={26} />}
      </button>
    </div>
  )
}

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/FRt3UeJfMw33rEpnBVC8XG'

export function CtaBanner() {
  return (
    <section className="bg-[#0F6E56] py-16 px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-2xl font-semibold text-[#9FE1CB] mb-3">Not sure where to start?</h2>
      <p className="text-[#5DCAA5] mb-8">Tell us your situation and we&apos;ll figure it out together.</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/get-help"
          className="inline-flex items-center bg-[#E1F5EE] text-[#085041] font-medium px-6 py-3 rounded-full hover:bg-white transition-colors"
        >
          Send us a message →
        </Link>
        <a
          href={WHATSAPP_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white font-medium px-6 py-3 rounded-full hover:bg-[#1ebe5e] transition-colors"
        >
          <MessageCircle size={18} /> Join Expats Da Nang on WhatsApp
        </a>
      </div>
    </section>
  )
}

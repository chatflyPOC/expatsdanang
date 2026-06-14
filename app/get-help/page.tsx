import { RequestForm } from '@/components/RequestForm'
import { MessageCircle, Clock, ShieldCheck } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Get Help',
  description: 'Tell us what you need in Da Nang and we\'ll connect you with trusted local providers within 2 hours — housing, visas, transfers, banking and more.',
  path: '/get-help',
  keywords: ['get help Da Nang', 'expat services Da Nang', 'Da Nang concierge'],
})

const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '84000000000'

export default function GetHelpPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Tell us what you need</h1>
        <p className="text-gray-600">Fill in the form and we&apos;ll get back to you within 2 hours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <RequestForm />
        </div>

        <aside className="space-y-6">
          <div className="border border-[#E5E7EB] rounded-xl p-6">
            <p className="font-semibold text-gray-900 mb-1">Prefer to chat?</p>
            <p className="text-sm text-gray-500 mb-4">Reach us directly on WhatsApp</p>
            <a
              href={`https://wa.me/${wa}?text=Hi!+I+need+some+help+in+Da+Nang.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-medium px-5 py-2.5 rounded-full hover:bg-[#1ebe5e] transition-colors text-sm"
            >
              <MessageCircle size={16} />
              Open WhatsApp
            </a>
          </div>

          <div className="border border-[#E5E7EB] rounded-xl p-6">
            <p className="font-semibold text-gray-900 mb-4">What happens next</p>
            <div className="space-y-4">
              {[
                { icon: Clock, text: 'We review your request within 2 hours' },
                { icon: ShieldCheck, text: 'We match you with the right local partner' },
                { icon: MessageCircle, text: 'We contact you via your preferred channel' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#E1F5EE] flex items-center justify-center flex-shrink-0">
                    <Icon size={12} className="text-[#1D9E75]" />
                  </div>
                  <p className="text-sm text-gray-600">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#E5E7EB] rounded-xl p-6">
            <p className="font-semibold text-gray-900 mb-4">Common questions</p>
            <div className="space-y-4">
              {[
                { q: 'Is this service free?', a: 'Our matchmaking is free. Service providers may charge fees, which we\'ll always disclose upfront.' },
                { q: 'How fast do you reply?', a: 'Within 2 hours during business hours (8am–10pm Da Nang time).' },
                { q: 'What if I have multiple needs?', a: 'Select all that apply — we\'ll handle everything in one go.' },
              ].map(({ q, a }) => (
                <div key={q}>
                  <p className="text-sm font-medium text-gray-900 mb-1">{q}</p>
                  <p className="text-sm text-gray-500">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

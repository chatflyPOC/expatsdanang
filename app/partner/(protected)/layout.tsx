import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== '' &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY !== ''

export default async function PartnerLayout({ children }: { children: React.ReactNode }) {
  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full border border-amber-200 bg-amber-50 rounded-xl p-8 text-center">
          <p className="text-2xl mb-3">⚙️</p>
          <h1 className="font-semibold text-gray-900 mb-2">Supabase not configured</h1>
          <Link href="/" className="text-sm text-[#1D9E75] hover:underline">← Back to site</Link>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/partner/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, partner_id')
    .eq('user_id', user.id)
    .single()

  // Admins belong in the admin console, not the partner portal
  if (profile?.role === 'admin') redirect('/admin')
  if (profile?.role !== 'partner' || !profile?.partner_id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full border border-amber-200 bg-amber-50 rounded-xl p-8 text-center">
          <p className="text-2xl mb-3">🔒</p>
          <h1 className="font-semibold text-gray-900 mb-2">No partner access</h1>
          <p className="text-sm text-gray-600 mb-6">This account isn&apos;t linked to a partner. Contact the Expats Da Nang team.</p>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="text-sm text-[#1D9E75] hover:underline">Sign out</button>
          </form>
        </div>
      </div>
    )
  }

  const { data: partner } = await supabase
    .from('partners')
    .select('name, status')
    .eq('id', profile.partner_id)
    .single()

  if (partner?.status === 'suspended') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full border border-red-200 bg-red-50 rounded-xl p-8 text-center">
          <p className="text-2xl mb-3">⛔</p>
          <h1 className="font-semibold text-gray-900 mb-2">Account suspended</h1>
          <p className="text-sm text-gray-600 mb-6">Your partner account is currently suspended. Contact the Expats Da Nang team.</p>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="text-sm text-[#1D9E75] hover:underline">Sign out</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900">Partner Portal</p>
          <p className="text-xs text-gray-400">{partner?.name}</p>
        </div>
        <form action="/api/auth/signout" method="post">
          <button type="submit" className="text-sm text-gray-500 hover:text-gray-900">Sign out</button>
        </form>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
    </div>
  )
}

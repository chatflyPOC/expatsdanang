import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== '' &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY !== ''

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full border border-amber-200 bg-amber-50 rounded-xl p-8 text-center">
          <p className="text-2xl mb-3">⚙️</p>
          <h1 className="font-semibold text-gray-900 mb-2">Supabase not configured</h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            Add your Supabase project URL and keys to <code className="bg-white border border-[#E5E7EB] rounded px-1 py-0.5 text-xs">.env.local</code> to enable the admin dashboard.
          </p>
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 text-left text-xs text-gray-500 font-mono leading-relaxed mb-6">
            NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co<br />
            NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...<br />
            SUPABASE_SERVICE_ROLE_KEY=eyJ...
          </div>
          <Link href="/" className="text-sm text-[#1D9E75] hover:underline">← Back to site</Link>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  // The admin shell (sidebar + topbar) is rendered by the page itself.
  return <>{children}</>
}

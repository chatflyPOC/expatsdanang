'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== ''

export default function PartnerLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full border border-amber-200 bg-amber-50 rounded-xl p-8 text-center">
          <p className="text-2xl mb-3">⚙️</p>
          <h1 className="font-semibold text-gray-900 mb-2">Supabase not configured</h1>
          <p className="text-sm text-gray-600 mb-6">Add your Supabase credentials to <code className="bg-white border border-[#E5E7EB] rounded px-1 py-0.5 text-xs">.env.local</code> to enable login.</p>
          <Link href="/" className="text-sm text-[#1D9E75] hover:underline">← Back to site</Link>
        </div>
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push('/partner')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="border border-[#E5E7EB] rounded-xl bg-white p-10 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Partner login</h1>
        <p className="text-sm text-gray-400 mb-6">Expats Da Nang — service partners</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1D9E75]"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1D9E75]"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1D9E75] text-white font-medium py-2.5 rounded-full hover:bg-[#0F6E56] transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

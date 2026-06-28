'use client'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Star, X, CheckCircle, PenLine } from 'lucide-react'

export function LeaveReviewButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-sm font-medium border border-[#D1D5DB] text-gray-600 px-4 py-2 rounded-full hover:border-[#1D9E75]/50 hover:text-[#1D9E75] transition-colors"
      >
        <PenLine size={15} /> Leave a review
      </button>
      {open && createPortal(<ReviewModal onClose={() => setOpen(false)} />, document.body)}
    </>
  )
}

function ReviewModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [name, setName] = useState('')
  const [info, setInfo] = useState('')
  const [quote, setQuote] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [err, setErr] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    if (quote.trim().length < 10) { setErr('Please write at least 10 characters.'); return }
    if (!name.trim()) { setErr('Please add your name.'); return }
    if (!info.trim()) { setErr('Please add where you are from.'); return }
    setState('sending')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author_name: name, author_info: info || undefined, rating, quote }),
      })
      if (!res.ok) throw new Error()
      setState('done')
    } catch {
      setState('error')
      setErr('Something went wrong. Please try again.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <p className="font-semibold text-gray-900">Share your experience</p>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        {state === 'done' ? (
          <div className="px-6 py-12 text-center">
            <CheckCircle size={44} className="text-[#1D9E75] mx-auto mb-4" />
            <p className="font-semibold text-gray-900 mb-1">Thank you!</p>
            <p className="text-sm text-gray-500 mb-6">Your review was submitted and will appear once approved.</p>
            <button onClick={onClose} className="text-sm font-medium bg-[#1D9E75] text-white px-5 py-2.5 rounded-full hover:bg-[#0F6E56] transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-6 py-5 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Your rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(n)}
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  >
                    <Star
                      size={28}
                      className={(hover || rating) >= n ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Your review</label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                rows={4}
                placeholder="What did we help you with? How was the experience?"
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tom H."
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Where from</label>
                <input
                  value={info}
                  onChange={(e) => setInfo(e.target.value)}
                  placeholder="UK, An Thuong"
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
                />
              </div>
            </div>

            {err && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{err}</p>}

            <button
              type="submit"
              disabled={state === 'sending'}
              className="w-full bg-[#1D9E75] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#0F6E56] transition-colors disabled:opacity-60"
            >
              {state === 'sending' ? 'Submitting…' : 'Submit review'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

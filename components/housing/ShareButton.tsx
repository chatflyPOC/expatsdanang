'use client'
import { Share2 } from 'lucide-react'

export function ShareButton({ title }: { title: string }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <button
      onClick={handleShare}
      title="Share listing"
      className="p-1.5 rounded-full border border-[#E5E7EB] text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
    >
      <Share2 size={16} />
    </button>
  )
}

import Link from 'next/link'
import { MapPin, ShieldCheck, ArrowRight, ImageIcon } from 'lucide-react'
import { Listing } from '@/types'

export function ListingCard({ listing }: { listing: Listing }) {
  const href = `/get-help?service=${listing.service_slug}&ref=${encodeURIComponent(listing.title)}`
  return (
    <Link
      href={href}
      className="lift group block border border-[#E5E7EB] rounded-xl overflow-hidden hover:border-[#1D9E75]/50 hover:shadow-[0_12px_30px_-14px_rgba(29,158,117,0.4)] bg-white"
    >
      <div className="h-40 bg-gray-100 flex items-center justify-center border-b border-[#E5E7EB] overflow-hidden">
        {listing.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <ImageIcon size={28} className="text-gray-300" />
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <p className="font-semibold text-gray-900 text-sm">{listing.title}</p>
          {listing.price && <p className="text-sm font-semibold text-[#0F6E56]">{listing.price}</p>}
        </div>
        {listing.location && (
          <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
            <MapPin size={11} /> {listing.location}
          </p>
        )}
        {listing.tags && listing.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {listing.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-[#E5E7EB]">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          {listing.verified ? (
            <span className="text-xs text-[#0F6E56] flex items-center gap-1">
              <ShieldCheck size={12} /> Verified
            </span>
          ) : <span />}
          <span className="text-xs font-medium text-[#1D9E75] flex items-center gap-1">
            Request this <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function ListingCardSkeleton() {
  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/3 mt-2" />
      </div>
    </div>
  )
}

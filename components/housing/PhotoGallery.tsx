'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, ImageIcon, Expand } from 'lucide-react'

interface Props {
  images: string[]
  alt: string
}

export function PhotoGallery({ images, alt }: Props) {
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (!images.length) {
    return (
      <div className="h-72 bg-gray-100 rounded-xl flex items-center justify-center border border-[#E5E7EB]">
        <ImageIcon size={36} className="text-gray-300" />
      </div>
    )
  }

  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length)
  const next = () => setCurrent(c => (c + 1) % images.length)

  return (
    <>
      {/* Main image */}
      <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-[#E5E7EB]">
        <div className="aspect-[16/9] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[current]}
            alt={`${alt} — photo ${current + 1}`}
            className="w-full h-full object-cover"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <button
          onClick={() => setLightbox(true)}
          className="absolute bottom-3 right-3 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-lg transition-colors"
        >
          <Expand size={16} />
        </button>

        <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex-none w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                i === current ? 'border-[#1D9E75]' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 p-2 text-white hover:text-gray-300"
          >
            <X size={24} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 p-3 text-white hover:text-gray-300"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={next}
                className="absolute right-4 p-3 text-white hover:text-gray-300"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[current]}
            alt={`${alt} — photo ${current + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {current + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}

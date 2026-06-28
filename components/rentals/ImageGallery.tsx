'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X, Play, ZoomIn, ImageIcon } from 'lucide-react'

interface Props {
  images: string[]
  videoUrl?: string | null
  alt: string
}

export function ImageGallery({ images, videoUrl, alt }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [current, setCurrent] = useState(0)

  const all = images.length ? images : []
  const main = all[0]
  const thumbs = all.slice(1, 5)
  const remaining = all.length > 5 ? all.length - 5 : 0

  const openAt = (i: number) => { setCurrent(i); setLightboxOpen(true) }
  const prev = useCallback(() => setCurrent(c => (c - 1 + all.length) % all.length), [all.length])
  const next = useCallback(() => setCurrent(c => (c + 1) % all.length), [all.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [lightboxOpen, prev, next])

  // Body scroll lock when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  if (!all.length) {
    return (
      <div className="h-72 rounded-xl bg-gray-100 flex items-center justify-center border border-[#E5E7EB]">
        <ImageIcon size={40} className="text-gray-300" />
      </div>
    )
  }

  return (
    <>
      {/* ── Desktop grid ── */}
      <div className="hidden sm:grid gap-1 rounded-xl overflow-hidden" style={{
        gridTemplateColumns: '2fr 1fr 1fr',
        gridTemplateRows: '230px 230px',
        height: '461px',
      }}>
        {/* Main large image */}
        <div
          className="row-span-2 relative overflow-hidden cursor-pointer group"
          onClick={() => openAt(0)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={main} alt={alt} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
          {videoUrl && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Play size={11} fill="white" /> Video tour
            </div>
          )}
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="flex items-center gap-1.5 bg-black/55 text-white text-xs px-2.5 py-1.5 rounded-lg backdrop-blur-sm">
              <ZoomIn size={12} /> View all {all.length} photos
            </span>
          </div>
        </div>

        {/* 4 thumbnails */}
        {[0, 1, 2, 3].map(i => {
          const imgIdx = i + 1
          const hasImg = imgIdx < all.length
          const isLast = i === 3
          const showOverlay = isLast && remaining > 0

          return (
            <div
              key={i}
              className={`relative overflow-hidden ${hasImg ? 'cursor-pointer group' : 'bg-gray-100'}`}
              onClick={() => hasImg && openAt(imgIdx)}
            >
              {hasImg ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={all[imgIdx]} alt="" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                  {showOverlay && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center backdrop-blur-[1px]">
                      <span className="text-white font-bold text-2xl">+{remaining + 1}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-100" />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Mobile carousel ── */}
      <div className="sm:hidden relative h-64 rounded-xl overflow-hidden bg-gray-100">
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${current * 100}%)`, width: `${all.length * 100}%` }}
        >
          {all.map((src, i) => (
            <div key={i} className="flex-none h-full" style={{ width: `${100 / all.length}%` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={i === 0 ? alt : ''} className="w-full h-full object-cover" onClick={() => openAt(i)} />
            </div>
          ))}
        </div>

        {all.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full">
              <ChevronLeft size={18} />
            </button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full">
              <ChevronRight size={18} />
            </button>
          </>
        )}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[11px] px-2.5 py-1 rounded-full">
          {current + 1} / {all.length}
        </div>

        {/* Dots */}
        {all.length > 1 && all.length <= 8 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {all.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-3' : 'bg-white/50'}`} />
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 flex-none">
            <span className="text-white/60 text-sm">{current + 1} / {all.length}</span>
            <button onClick={() => setLightboxOpen(false)} className="text-white hover:text-gray-300 p-1">
              <X size={22} />
            </button>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center px-12 min-h-0 relative">
            {all.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-2 sm:left-4 text-white/70 hover:text-white p-2">
                  <ChevronLeft size={32} />
                </button>
                <button onClick={next} className="absolute right-2 sm:right-4 text-white/70 hover:text-white p-2">
                  <ChevronRight size={32} />
                </button>
              </>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={all[current]}
              alt={`${alt} — ${current + 1}`}
              className="max-h-full max-w-full object-contain select-none"
            />
          </div>

          {/* Thumbnails strip */}
          {all.length > 1 && (
            <div className="flex-none pb-4 pt-2 px-4 overflow-x-auto">
              <div className="flex gap-2 justify-center">
                {all.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`flex-none w-14 h-10 rounded-md overflow-hidden border-2 transition-all ${
                      i === current ? 'border-white opacity-100' : 'border-transparent opacity-40 hover:opacity-70'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

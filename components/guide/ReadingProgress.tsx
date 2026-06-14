'use client'
import { useEffect, useState } from 'react'

/** A thin progress bar pinned under the navbar that fills as you read. */
export function ReadingProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrollable = h.scrollHeight - h.clientHeight
      setPct(scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="sticky top-16 z-40 h-0.5 bg-transparent">
      <div className="h-full bg-[#1D9E75] transition-[width] duration-150" style={{ width: `${pct}%` }} />
    </div>
  )
}

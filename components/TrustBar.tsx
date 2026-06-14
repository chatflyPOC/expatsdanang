'use client'
import { useEffect, useRef, useState } from 'react'
import { Check, Clock, Star, MessageCircle } from 'lucide-react'
import { SiteStat } from '@/types'

const ICONS: Record<string, React.ElementType> = {
  expats_helped: Check,
  reply_time: Clock,
  rating: Star,
  support: MessageCircle,
}

/** Animates the leading number of a value (e.g. "200+" → counts 0→200, keeps "+"). */
function CountUpValue({ value }: { value: string }) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/)
  const target = match ? parseFloat(match[1]) : null
  const suffix = match ? match[2] : value
  const decimals = match && match[1].includes('.') ? 1 : 0

  const [display, setDisplay] = useState(target !== null ? '0' : value)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (target === null) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1200
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setDisplay((eased * target).toFixed(decimals))
          if (p < 1) requestAnimationFrame(tick)
          else setDisplay(target.toFixed(decimals))
        }
        requestAnimationFrame(tick)
        observer.disconnect()
      }
    }, { threshold: 0.5 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, decimals])

  return (
    <span ref={ref} className="font-semibold text-gray-900">
      {target !== null ? display : value}{target !== null ? suffix : ''}
    </span>
  )
}

interface TrustBarProps {
  stats: SiteStat[]
}

export function TrustBar({ stats }: TrustBarProps) {
  return (
    <div className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-x-8 gap-y-3 items-center">
        {stats.map((stat) => {
          const Icon = ICONS[stat.key] || Check
          const isSupport = stat.key === 'support'
          return (
            <div key={stat.key} className="flex items-center gap-2 text-sm text-gray-600">
              <Icon size={16} className="text-[#1D9E75]" />
              {isSupport ? (
                <span><span className="font-semibold text-gray-900">{stat.value}</span> support</span>
              ) : (
                <span>
                  <CountUpValue value={stat.value} />
                  {stat.label ? ` ${stat.label}` : ''}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function TrustBarFallback() {
  return (
    <div className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-x-8 gap-y-3 items-center">
        {[
          { icon: Check, text: '200+ expats helped' },
          { icon: Clock, text: 'Reply within 2 hours' },
          { icon: Star, text: '4.9/5 rating' },
          { icon: MessageCircle, text: 'WhatsApp support' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-sm text-gray-600">
            <Icon size={16} className="text-[#1D9E75]" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

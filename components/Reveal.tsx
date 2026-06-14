'use client'
import { useEffect, useRef, useState, ElementType } from 'react'

interface RevealProps {
  children: React.ReactNode
  /** Delay before the reveal animation runs, in ms */
  delay?: number
  /** Render as a different element (default div) */
  as?: ElementType
  className?: string
  /** Re-trigger every time it scrolls into view (default: once) */
  once?: boolean
}

/**
 * Wraps content and fades/slides it in when it scrolls into view.
 * Pairs with the `.reveal` / `.is-visible` classes in globals.css.
 */
export function Reveal({ children, delay = 0, as, className = '', once = true }: RevealProps) {
  const Tag = (as || 'div') as ElementType
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(entry.target)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

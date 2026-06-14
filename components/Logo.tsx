/**
 * Brand logo — a scalable "mark + wordmark" lockup.
 * The mark keeps the Da Nang story (Dragon Bridge arches + rising sun)
 * but simplified into a modern rounded-square icon that stays legible
 * down to favicon size. Typography matches the site (Inter).
 */

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'md' | 'lg'
  iconOnly?: boolean
  className?: string
}

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Expats Da Nang" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ednMark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#23B58A" />
          <stop offset="1" stopColor="#0F6E56" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#ednMark)" />
      <circle cx="42" cy="23" r="8" fill="#F5A623" />
      <path d="M12 45 Q23 29 33 44 Q43 29 53 45" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 51 Q20 54 27 51 T41 51 T55 51" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    </svg>
  )
}

export function Logo({ variant = 'light', size = 'md', iconOnly = false, className = '' }: LogoProps) {
  const ink = variant === 'dark' ? '#FFFFFF' : '#0A3A5C'
  const accent = variant === 'dark' ? '#5DCAA5' : '#1D9E75'
  const mark = size === 'lg' ? 'h-12 w-12' : 'h-10 w-10'
  const text = size === 'lg' ? 'text-[19px]' : 'text-[15px]'

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={mark} />
      {!iconOnly && (
        <span className="leading-[1.08] font-semibold tracking-tight">
          <span className={`block ${text}`} style={{ color: ink }}>Expats</span>
          <span className={`block ${text}`} style={{ color: accent }}>Da Nang</span>
        </span>
      )}
    </span>
  )
}

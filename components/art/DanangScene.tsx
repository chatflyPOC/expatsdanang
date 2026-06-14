/**
 * Bespoke Da Nang illustrations — drawn in the brand palette
 * (navy #0A3A5C, teal #1D9E75, amber #F5A623, sky #1AA5D8).
 * Self-contained SVG (no external assets), with gentle CSS animation
 * on the sun, clouds and waves to bring the hero to life.
 */

export function DanangScene({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 460"
      className={className}
      role="img"
      aria-label="Illustration of Da Nang — the Dragon Bridge, Marble Mountains, My Khe beach and the sea"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8F8FF" />
          <stop offset="55%" stopColor="#F3FCFA" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1AA5D8" />
          <stop offset="100%" stopColor="#0F6E56" />
        </linearGradient>
        <linearGradient id="mountain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1D9E75" />
          <stop offset="100%" stopColor="#0F6E56" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD9A0" />
          <stop offset="100%" stopColor="#FFD9A0" stopOpacity="0" />
        </radialGradient>
        <clipPath id="frame">
          <rect x="0" y="0" width="600" height="460" rx="28" />
        </clipPath>
      </defs>

      <g clipPath="url(#frame)">
        {/* Sky */}
        <rect x="0" y="0" width="600" height="460" fill="url(#sky)" />

        {/* Sun + glow */}
        <g className="animate-float-2" style={{ transformOrigin: '460px 120px' }}>
          <circle cx="460" cy="120" r="88" fill="url(#sunGlow)" />
          <circle cx="460" cy="120" r="44" fill="#F5A623" />
        </g>

        {/* Clouds */}
        <g fill="#FFFFFF" opacity="0.92">
          <g className="float-cloud-1">
            <ellipse cx="150" cy="80" rx="42" ry="18" />
            <ellipse cx="185" cy="72" rx="30" ry="16" />
            <ellipse cx="120" cy="74" rx="26" ry="14" />
          </g>
          <g className="float-cloud-2">
            <ellipse cx="380" cy="56" rx="34" ry="14" />
            <ellipse cx="410" cy="50" rx="24" ry="12" />
          </g>
        </g>

        {/* Far Marble Mountains */}
        <path d="M0 250 L70 180 L120 220 L180 150 L250 215 L300 175 L360 230 L420 195 L480 235 L540 200 L600 240 L600 300 L0 300 Z"
          fill="url(#mountain)" opacity="0.45" />
        {/* Near Marble Mountains */}
        <path d="M0 290 L90 225 L160 275 L230 215 L300 270 L380 225 L450 280 L520 240 L600 285 L600 340 L0 340 Z"
          fill="url(#mountain)" opacity="0.85" />
        {/* Pagoda hint on a peak */}
        <g fill="#0A3A5C" opacity="0.8" transform="translate(226 198)">
          <rect x="-2" y="0" width="4" height="20" />
          <path d="M-10 4 L10 4 L6 -4 L-6 -4 Z" />
          <path d="M-8 -4 L8 -4 L4 -12 L-4 -12 Z" />
        </g>

        {/* Sea */}
        <rect x="0" y="300" width="600" height="160" fill="url(#sea)" />

        {/* === Dragon Bridge === */}
        <g>
          {/* Bridge deck */}
          <rect x="60" y="305" width="480" height="9" rx="3" fill="#E8E0D0" />
          {/* Two big arches (dragon body humps) */}
          <path d="M120 305 Q220 230 320 305" fill="none" stroke="#F5A623" strokeWidth="11" strokeLinecap="round" />
          <path d="M300 305 Q400 235 500 305" fill="none" stroke="#F5A623" strokeWidth="11" strokeLinecap="round" />
          {/* Arch hangers */}
          <g stroke="#F2B85A" strokeWidth="2.4">
            <line x1="170" y1="270" x2="170" y2="305" />
            <line x1="220" y1="256" x2="220" y2="305" />
            <line x1="270" y1="270" x2="270" y2="305" />
            <line x1="350" y1="272" x2="350" y2="305" />
            <line x1="400" y1="258" x2="400" y2="305" />
            <line x1="450" y1="272" x2="450" y2="305" />
          </g>
          {/* Dragon head */}
          <g transform="translate(508 290)">
            <ellipse cx="0" cy="8" rx="20" ry="12" fill="#D4531A" />
            <polygon points="16,4 36,-4 28,12" fill="#D4531A" />
            <circle cx="-4" cy="5" r="3.4" fill="#FFD700" />
            <path d="M-14 -2 Q-22 -10 -16 -16" fill="none" stroke="#D4531A" strokeWidth="3" strokeLinecap="round" />
          </g>
          {/* Bridge piers */}
          <rect x="116" y="314" width="8" height="20" fill="#C9BEA8" />
          <rect x="316" y="314" width="8" height="20" fill="#C9BEA8" />
          <rect x="496" y="314" width="8" height="20" fill="#C9BEA8" />
        </g>

        {/* Animated waves */}
        <g className="animate-sway" opacity="0.55" stroke="#BDEBFF" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M40 360 Q70 352 100 360 T160 360 T220 360" />
          <path d="M300 378 Q330 370 360 378 T420 378 T480 378" />
          <path d="M120 400 Q150 392 180 400 T240 400 T300 400" />
        </g>

        {/* Beach + palm, front-right */}
        <path d="M420 460 Q480 410 600 425 L600 460 Z" fill="#F4E4C1" />
        <g transform="translate(545 360)">
          <path d="M4 0 Q10 50 6 96" fill="none" stroke="#7A5230" strokeWidth="6" strokeLinecap="round" />
          <g fill="#1D9E75">
            <path d="M5 2 Q-30 -10 -42 6 Q-18 0 5 12 Z" />
            <path d="M5 2 Q40 -10 54 4 Q26 0 5 12 Z" />
            <path d="M5 2 Q-14 -28 -4 -42 Q4 -18 8 4 Z" />
            <path d="M5 2 Q26 -24 22 -42 Q12 -16 8 4 Z" />
          </g>
        </g>

        {/* Sailboat */}
        <g className="animate-float" transform="translate(150 332)">
          <path d="M-22 8 L22 8 L14 20 L-14 20 Z" fill="#0A3A5C" />
          <path d="M0 8 L0 -22 L20 4 Z" fill="#FFFFFF" />
          <path d="M-2 8 L-2 -16 L-18 4 Z" fill="#E1F5EE" />
        </g>
      </g>
    </svg>
  )
}

/** Compact landmark thumbnails for neighborhood / section cards */
export function DragonBridgeArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 180" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="db-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A3A5C" />
          <stop offset="100%" stopColor="#1A6FA0" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#db-sky)" />
      <circle cx="255" cy="46" r="26" fill="#F5A623" opacity="0.9" />
      <rect x="20" y="120" width="280" height="6" rx="3" fill="#E8E0D0" />
      <path d="M50 120 Q110 60 170 120" fill="none" stroke="#F5A623" strokeWidth="7" strokeLinecap="round" />
      <path d="M155 120 Q215 64 275 120" fill="none" stroke="#F5A623" strokeWidth="7" strokeLinecap="round" />
      <g transform="translate(280 110)">
        <ellipse cx="0" cy="6" rx="13" ry="8" fill="#D4531A" />
        <polygon points="10,3 24,-3 18,9" fill="#D4531A" />
        <circle cx="-3" cy="4" r="2.4" fill="#FFD700" />
      </g>
      <g opacity="0.5" stroke="#BDEBFF" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M30 150 Q55 144 80 150 T130 150" />
        <path d="M170 162 Q195 156 220 162 T270 162" />
      </g>
    </svg>
  )
}

export function BeachArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 180" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="be-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BFefff" />
          <stop offset="100%" stopColor="#E8F8FF" />
        </linearGradient>
        <linearGradient id="be-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1AA5D8" />
          <stop offset="100%" stopColor="#0F6E56" />
        </linearGradient>
      </defs>
      <rect width="320" height="120" fill="url(#be-sky)" />
      <circle cx="60" cy="48" r="24" fill="#F5A623" />
      <rect y="100" width="320" height="50" fill="url(#be-sea)" />
      <path d="M0 150 Q120 120 320 140 L320 180 L0 180 Z" fill="#F4E4C1" />
      <g transform="translate(250 78)">
        <path d="M4 0 Q9 42 6 80" fill="none" stroke="#7A5230" strokeWidth="5" strokeLinecap="round" />
        <g fill="#1D9E75">
          <path d="M5 2 Q-24 -8 -34 5 Q-14 0 5 10 Z" />
          <path d="M5 2 Q34 -8 45 4 Q22 0 5 10 Z" />
          <path d="M5 2 Q-10 -22 -2 -34 Q4 -14 8 4 Z" />
        </g>
      </g>
      <g opacity="0.6" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M20 118 Q45 112 70 118 T120 118" />
        <path d="M180 126 Q205 120 230 126 T280 126" />
      </g>
    </svg>
  )
}

export function RiverArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 180" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="ri-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FAD9A8" />
          <stop offset="100%" stopColor="#FBEFE0" />
        </linearGradient>
      </defs>
      <rect width="320" height="120" fill="url(#ri-sky)" />
      <circle cx="160" cy="44" r="22" fill="#F5A623" />
      <rect y="110" width="320" height="70" fill="#1A6FA0" />
      {/* skyline */}
      <g fill="#0A3A5C" opacity="0.85">
        <rect x="30" y="60" width="18" height="50" />
        <rect x="56" y="44" width="22" height="66" />
        <rect x="86" y="70" width="16" height="40" />
        <rect x="220" y="54" width="20" height="56" />
        <rect x="246" y="40" width="24" height="70" />
        <rect x="276" y="66" width="16" height="44" />
      </g>
      {/* Han River bridge */}
      <rect x="110" y="100" width="100" height="5" fill="#E8E0D0" />
      <path d="M120 100 L160 70 L200 100" fill="none" stroke="#1D9E75" strokeWidth="4" />
      <g opacity="0.5" stroke="#BDEBFF" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M30 140 Q55 134 80 140 T130 140" />
        <path d="M190 150 Q215 144 240 150 T290 150" />
      </g>
    </svg>
  )
}

export function MountainArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 180" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="mo-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9F4EA" />
          <stop offset="100%" stopColor="#F3FCFA" />
        </linearGradient>
        <linearGradient id="mo-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1D9E75" />
          <stop offset="100%" stopColor="#0F6E56" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#mo-sky)" />
      <circle cx="250" cy="44" r="22" fill="#F5A623" opacity="0.85" />
      <path d="M0 150 L60 90 L110 130 L170 70 L240 135 L300 95 L320 130 L320 180 L0 180 Z" fill="url(#mo-hill)" opacity="0.55" />
      <path d="M0 180 L70 110 L140 165 L200 105 L270 165 L320 125 L320 180 Z" fill="url(#mo-hill)" />
      {/* pagoda */}
      <g fill="#0A3A5C" transform="translate(196 96)">
        <rect x="-2" y="0" width="4" height="16" />
        <path d="M-9 4 L9 4 L6 -3 L-6 -3 Z" />
        <path d="M-7 -3 L7 -3 L4 -10 L-4 -10 Z" />
      </g>
    </svg>
  )
}

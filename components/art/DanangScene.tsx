/**
 * Bespoke Da Nang illustrations — drawn in the brand palette
 * (navy #0A3A5C, teal #1D9E75, amber #F5A623, sky #1AA5D8).
 * Self-contained SVG (no external assets), with gentle CSS animation
 * on the sun, clouds and waves to bring the hero to life.
 *
 * Guide hero banners (800×320) are at the bottom of this file —
 * one per guide slug, auto-mapped in GuideLayout.
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

/* ─────────────────────────────────────────────────────────────────
   GUIDE HERO BANNERS  (800 × 320, wide cinematic format)
   One per guide slug — imported and mapped in GuideLayout.tsx
───────────────────────────────────────────────────────────────── */

/** Getting Around — motorbike on a Da Nang road with hills */
export function MotorbikeHero({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 320" className={className} xmlns="http://www.w3.org/2000/svg"
      role="img" aria-label="Motorbike riding through Da Nang with mountain scenery">
      <defs>
        <linearGradient id="mb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8EEFF" />
          <stop offset="100%" stopColor="#F3FCFA" />
        </linearGradient>
        <linearGradient id="mb-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1D9E75" /><stop offset="100%" stopColor="#0A4A36" />
        </linearGradient>
        <linearGradient id="mb-road" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#888" /><stop offset="100%" stopColor="#666" />
        </linearGradient>
      </defs>
      <rect width="800" height="320" fill="url(#mb-sky)" />
      {/* Sun */}
      <circle cx="680" cy="72" r="56" fill="#FFE4A0" opacity="0.55" />
      <circle cx="680" cy="72" r="36" fill="#F5A623" />
      {/* Clouds */}
      <g fill="white" opacity="0.88">
        <ellipse cx="130" cy="68" rx="56" ry="22" /><ellipse cx="174" cy="60" rx="38" ry="18" /><ellipse cx="96" cy="64" rx="32" ry="16" />
        <ellipse cx="440" cy="52" rx="46" ry="18" /><ellipse cx="482" cy="46" rx="28" ry="14" />
      </g>
      {/* Far hills */}
      <path d="M0 190 L90 130 L170 172 L260 118 L350 165 L440 128 L530 170 L620 135 L710 174 L800 148 L800 250 L0 250Z"
        fill="url(#mb-hill)" opacity="0.3" />
      {/* Near hills */}
      <path d="M0 248 L110 192 L210 232 L320 178 L440 228 L550 184 L660 230 L780 188 L800 205 L800 290 L0 290Z"
        fill="url(#mb-hill)" opacity="0.65" />
      {/* Road perspective */}
      <path d="M280 290 L520 290 L740 320 L60 320Z" fill="url(#mb-road)" />
      {/* Road markings */}
      <path d="M400 290 L400 300 M400 306 L400 316" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
      {/* Shoulders */}
      <path d="M280 290 L60 320 L52 320 L274 290Z" fill="#F4E4C1" opacity="0.5" />
      <path d="M520 290 L740 320 L750 320 L528 290Z" fill="#F4E4C1" opacity="0.5" />
      {/* Left palm */}
      <g transform="translate(155 215)">
        <path d="M5 0 Q13 56 8 100" fill="none" stroke="#7A5230" strokeWidth="7" strokeLinecap="round" />
        <g fill="#1D9E75">
          <path d="M6 4 Q-38-14-54 8 Q-24 2 6 18Z" /><path d="M6 4 Q50-14 68 6 Q34 2 6 18Z" />
          <path d="M6 4 Q-18-36-4-54 Q6-24 10 6Z" /><path d="M6 4 Q32-32 30-54 Q14-24 10 6Z" />
        </g>
      </g>
      {/* Right palm */}
      <g transform="translate(630 230)">
        <path d="M4 0 Q10 44 7 80" fill="none" stroke="#7A5230" strokeWidth="6" strokeLinecap="round" />
        <g fill="#1D9E75">
          <path d="M5 3 Q-28-10-40 6 Q-18 2 5 14Z" /><path d="M5 3 Q38-10 52 5 Q26 2 5 14Z" />
          <path d="M5 3 Q-12-28-2-42 Q6-18 9 5Z" />
        </g>
      </g>
      {/* Motorbike body */}
      <g transform="translate(380 248)">
        {/* Rear wheel */}
        <circle cx="-44" cy="28" r="24" fill="#222" /><circle cx="-44" cy="28" r="15" fill="#444" /><circle cx="-44" cy="28" r="6" fill="#888" />
        {/* Front wheel */}
        <circle cx="44" cy="28" r="24" fill="#222" /><circle cx="44" cy="28" r="15" fill="#444" /><circle cx="44" cy="28" r="6" fill="#888" />
        {/* Frame */}
        <path d="M-44 6 L-18-14 L14-18 L44 6" fill="none" stroke="#0A3A5C" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        {/* Body fairing */}
        <path d="M-12-16 Q6-28 22-22 L44 4 L24 4 L12-12 L-2-14Z" fill="#1D9E75" />
        <path d="M-18-12 L-44 6 L-34 10 L-10-8Z" fill="#1D9E75" />
        {/* Seat */}
        <path d="M-20-14 Q0-26 20-20 L18-10 Q0-18-18-6Z" fill="#0A3A5C" />
        {/* Handlebar */}
        <line x1="34" y1="-6" x2="52" y2="-14" stroke="#0A3A5C" strokeWidth="5" strokeLinecap="round" />
        <rect x="48" y="-18" width="12" height="6" rx="3" fill="#555" />
        {/* Headlight */}
        <ellipse cx="50" cy="0" rx="7" ry="6" fill="#F5A623" opacity="0.9" />
        {/* Rider helmet */}
        <circle cx="4" cy="-32" r="12" fill="#0A3A5C" opacity="0.9" />
        <path d="M-8-32 Q0-48 12-42 L14-28 Q6-24-4-26Z" fill="#1D9E75" />
        <path d="M-6-36 Q4-30 12-30" fill="none" stroke="#F5A623" strokeWidth="2.5" />
        {/* Rider body */}
        <path d="M-4-22 Q4-6 20-8" fill="none" stroke="#0A3A5C" strokeWidth="6" strokeLinecap="round" />
        {/* Speed lines */}
        <g stroke="#1AA5D8" strokeWidth="2.5" opacity="0.45" strokeLinecap="round">
          <line x1="-90" y1="-4" x2="-66" y2="-4" /><line x1="-96" y1="6" x2="-70" y2="6" /><line x1="-84" y1="-14" x2="-68" y2="-14" />
        </g>
      </g>
      {/* Bridge silhouette background */}
      <path d="M60 220 Q160 172 260 220" fill="none" stroke="#E8E0D0" strokeWidth="5" opacity="0.45" />
      <rect x="60" y="218" width="200" height="5" fill="#E8E0D0" opacity="0.4" />
    </svg>
  )
}

/** Cost of Living — street café with Vietnamese coffee, laptop, beach view */
export function CostHero({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 320" className={className} xmlns="http://www.w3.org/2000/svg"
      role="img" aria-label="Da Nang street café scene with Vietnamese coffee and beach view">
      <defs>
        <linearGradient id="cost-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1AA5D8" /><stop offset="60%" stopColor="#5CC8E8" /><stop offset="100%" stopColor="#A8E6F5" />
        </linearGradient>
        <linearGradient id="cost-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1AA5D8" /><stop offset="100%" stopColor="#0A6A8C" />
        </linearGradient>
        <linearGradient id="cost-table" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5ECD5" /><stop offset="100%" stopColor="#E8D5B0" />
        </linearGradient>
      </defs>
      {/* Sky */}
      <rect width="800" height="320" fill="url(#cost-sky)" />
      {/* Sun */}
      <circle cx="700" cy="70" r="48" fill="#FFE4A0" opacity="0.5" />
      <circle cx="700" cy="70" r="30" fill="#F5A623" opacity="0.85" />
      {/* Sea */}
      <rect x="0" y="170" width="800" height="80" fill="url(#cost-sea)" />
      {/* Beach sand */}
      <path d="M0 235 Q200 215 400 230 Q600 245 800 225 L800 260 L0 260Z" fill="#F4E4C1" />
      {/* Waves */}
      <path d="M0 200 Q80 192 160 200 T320 200 T480 200 T640 200 T800 200" fill="none" stroke="white" strokeWidth="2.5" opacity="0.4" strokeLinecap="round" />
      <path d="M0 218 Q100 210 200 218 T400 218 T600 218 T800 218" fill="none" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      {/* Café awning */}
      <rect x="80" y="30" width="380" height="14" rx="4" fill="#1D9E75" />
      <path d="M80 44 Q170 70 260 48 Q350 26 440 44 L440 58 Q350 40 260 62 Q170 84 80 58Z" fill="#1D9E75" opacity="0.85" />
      {/* Awning stripes */}
      <path d="M130 44 Q170 70 130 60Z" fill="#0F6E56" opacity="0.4" />
      <path d="M230 44 Q270 62 230 55Z" fill="#0F6E56" opacity="0.4" />
      <path d="M330 44 Q370 58 330 52Z" fill="#0F6E56" opacity="0.4" />
      {/* Café wall */}
      <rect x="80" y="58" width="380" height="180" rx="0" fill="#FFF8F0" opacity="0.9" />
      {/* Window */}
      <rect x="300" y="80" width="140" height="100" rx="6" fill="url(#cost-sky)" opacity="0.7" />
      <line x1="370" y1="80" x2="370" y2="180" stroke="white" strokeWidth="3" opacity="0.6" />
      <line x1="300" y1="130" x2="440" y2="130" stroke="white" strokeWidth="3" opacity="0.6" />
      {/* Door */}
      <rect x="100" y="150" width="60" height="88" rx="4" fill="#E8D5B0" />
      <circle cx="154" cy="198" r="4" fill="#C9A860" />
      {/* Café sign */}
      <rect x="160" y="88" width="120" height="34" rx="6" fill="#0A3A5C" />
      <text x="220" y="110" textAnchor="middle" fill="#F5A623" fontSize="13" fontFamily="serif" fontWeight="bold">CÀ PHÊ</text>
      {/* Table */}
      <ellipse cx="590" cy="248" rx="90" ry="20" fill="url(#cost-table)" />
      <rect x="578" y="248" width="24" height="50" rx="4" fill="#C9A860" />
      {/* Vietnamese phin coffee */}
      <g transform="translate(545 190)">
        {/* Cup */}
        <path d="M-14 40 L14 40 L10 58 L-10 58Z" fill="white" stroke="#DDD" strokeWidth="1.5" />
        {/* Phin filter */}
        <rect x="-12" y="24" width="24" height="20" rx="3" fill="#888" />
        <rect x="-10" y="22" width="20" height="4" rx="2" fill="#666" />
        {/* Lid */}
        <ellipse cx="0" cy="22" rx="12" ry="3" fill="#777" />
        {/* Coffee drip */}
        <path d="M0 40 Q1 35 0 30" stroke="#3E1A00" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Steam */}
        <path d="M-6 18 Q-3 10-6 2" fill="none" stroke="#CCC" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M6 16 Q9 8 6 0" fill="none" stroke="#CCC" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        {/* Saucer */}
        <ellipse cx="0" cy="60" rx="18" ry="4" fill="#DDD" />
      </g>
      {/* Laptop */}
      <g transform="translate(610 220)">
        <rect x="-40" y="-22" width="80" height="52" rx="4" fill="#2A2A2A" />
        <rect x="-36" y="-18" width="72" height="44" rx="2" fill="#1AA5D8" opacity="0.8" />
        {/* Screen content hint */}
        <rect x="-28" y="-10" width="56" height="6" rx="2" fill="white" opacity="0.4" />
        <rect x="-28" y="0" width="40" height="4" rx="2" fill="white" opacity="0.3" />
        <rect x="-28" y="8" width="48" height="4" rx="2" fill="white" opacity="0.3" />
        {/* Base */}
        <path d="M-44 30 L44 30 L50 38 L-50 38Z" fill="#1A1A1A" />
        <ellipse cx="0" cy="38" rx="8" ry="2" fill="#333" />
      </g>
      {/* VND notes scattered */}
      <g transform="translate(640 255) rotate(-8)">
        <rect x="-26" y="-12" width="52" height="26" rx="3" fill="#85C1E9" opacity="0.9" />
        <text x="0" y="4" textAnchor="middle" fill="#0A3A5C" fontSize="9" fontWeight="bold">500.000đ</text>
      </g>
      <g transform="translate(660 262) rotate(5)">
        <rect x="-22" y="-10" width="44" height="22" rx="3" fill="#A9DFBF" opacity="0.9" />
        <text x="0" y="4" textAnchor="middle" fill="#0A4A36" fontSize="8" fontWeight="bold">200.000đ</text>
      </g>
      {/* Palm right */}
      <g transform="translate(760 170)">
        <path d="M4 0 Q10 50 7 90" fill="none" stroke="#7A5230" strokeWidth="6" strokeLinecap="round" />
        <g fill="#1D9E75">
          <path d="M5 3 Q-28-10-38 6 Q-18 2 5 14Z" /><path d="M5 3 Q38-10 52 5 Q26 2 5 14Z" />
          <path d="M5 3 Q-12-26-2-38 Q6-16 9 5Z" />
        </g>
      </g>
    </svg>
  )
}

/** Best Neighborhoods — stylised top-down map of Da Nang coastline with pins */
export function NeighborhoodHero({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 320" className={className} xmlns="http://www.w3.org/2000/svg"
      role="img" aria-label="Stylised map of Da Nang showing expat neighborhoods along the coastline">
      <defs>
        <linearGradient id="nh-sea" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1AA5D8" /><stop offset="100%" stopColor="#0A6A8C" />
        </linearGradient>
        <linearGradient id="nh-land" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8F5EE" /><stop offset="100%" stopColor="#C8ECD8" />
        </linearGradient>
        <linearGradient id="nh-mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1D9E75" /><stop offset="100%" stopColor="#0A4A36" />
        </linearGradient>
      </defs>
      {/* Sea */}
      <rect width="800" height="320" fill="url(#nh-sea)" />
      {/* Land mass — Da Nang shape (simplified) */}
      <path d="M0 0 L480 0 L500 40 L510 100 L490 160 L460 220 Q430 280 420 320 L0 320Z"
        fill="url(#nh-land)" />
      {/* Coastline detail */}
      <path d="M480 0 L500 40 L510 100 L490 160 L460 220 Q430 280 420 320"
        fill="none" stroke="#F4E4C1" strokeWidth="8" opacity="0.7" />
      {/* Beach strip */}
      <path d="M480 0 L492 0 L512 42 L522 102 L502 162 L472 222 Q442 282 432 320 L420 320 Q430 280 460 220 L490 160 L510 100 L500 40Z"
        fill="#F4E4C1" opacity="0.85" />
      {/* Mountains (west) */}
      <path d="M0 80 L80 20 L150 65 L210 10 L290 70 L360 25 L420 80 L420 180 L0 180Z"
        fill="url(#nh-mtn)" opacity="0.5" />
      <path d="M0 160 L100 100 L180 150 L260 90 L340 145 L410 110 L430 150 L430 250 L0 250Z"
        fill="url(#nh-mtn)" opacity="0.75" />
      {/* Roads */}
      <g stroke="#D0C4A8" strokeWidth="4" opacity="0.8">
        {/* Main coastal road */}
        <path d="M475 10 L495 46 L506 104 L487 162 L458 222 Q428 280 418 318" fill="none" />
        {/* Cross roads */}
        <line x1="80" y1="180" x2="490" y2="95" />
        <line x1="80" y1="240" x2="462" y2="190" />
        <line x1="80" y1="120" x2="490" y2="48" />
      </g>
      {/* River */}
      <path d="M200 0 Q220 60 240 100 Q260 140 280 170 Q300 200 320 220"
        fill="none" stroke="#1AA5D8" strokeWidth="14" opacity="0.6" />
      {/* Neighborhood pins */}
      {/* An Thuong */}
      <g transform="translate(465 140)">
        <circle cx="0" cy="-24" r="14" fill="#1D9E75" />
        <path d="M0-10 L-8 6 Q0 2 8 6Z" fill="#1D9E75" />
        <text x="0" y="-20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">A</text>
        <rect x="-38" y="-56" width="76" height="20" rx="4" fill="white" opacity="0.92" />
        <text x="0" y="-42" textAnchor="middle" fill="#0A3A5C" fontSize="9" fontWeight="bold">An Thuong</text>
      </g>
      {/* My Khe */}
      <g transform="translate(478 96)">
        <circle cx="0" cy="-24" r="14" fill="#F5A623" />
        <path d="M0-10 L-8 6 Q0 2 8 6Z" fill="#F5A623" />
        <text x="0" y="-20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">M</text>
        <rect x="-30" y="-56" width="62" height="20" rx="4" fill="white" opacity="0.92" />
        <text x="0" y="-42" textAnchor="middle" fill="#0A3A5C" fontSize="9" fontWeight="bold">My Khe</text>
      </g>
      {/* Han River / Hai Chau */}
      <g transform="translate(310 188)">
        <circle cx="0" cy="-24" r="14" fill="#0A3A5C" />
        <path d="M0-10 L-8 6 Q0 2 8 6Z" fill="#0A3A5C" />
        <text x="0" y="-20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">H</text>
        <rect x="-34" y="-56" width="70" height="20" rx="4" fill="white" opacity="0.92" />
        <text x="0" y="-42" textAnchor="middle" fill="#0A3A5C" fontSize="9" fontWeight="bold">Hai Chau</text>
      </g>
      {/* Ngu Hanh Son */}
      <g transform="translate(444 240)">
        <circle cx="0" cy="-24" r="14" fill="#1AA5D8" />
        <path d="M0-10 L-8 6 Q0 2 8 6Z" fill="#1AA5D8" />
        <text x="0" y="-20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">N</text>
        <rect x="-42" y="-56" width="86" height="20" rx="4" fill="white" opacity="0.92" />
        <text x="0" y="-42" textAnchor="middle" fill="#0A3A5C" fontSize="9" fontWeight="bold">Ngu Hanh Son</text>
      </g>
      {/* Son Tra */}
      <g transform="translate(500 46)">
        <circle cx="0" cy="-24" r="14" fill="#E74C3C" />
        <path d="M0-10 L-8 6 Q0 2 8 6Z" fill="#E74C3C" />
        <text x="0" y="-20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">S</text>
        <rect x="-28" y="-56" width="58" height="20" rx="4" fill="white" opacity="0.92" />
        <text x="0" y="-42" textAnchor="middle" fill="#0A3A5C" fontSize="9" fontWeight="bold">Son Tra</text>
      </g>
      {/* Sea waves */}
      <g stroke="white" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round">
        <path d="M560 80 Q590 72 620 80 T680 80" /><path d="M600 130 Q630 122 660 130 T720 130" />
        <path d="M560 200 Q590 192 620 200 T680 200" /><path d="M620 260 Q650 252 680 260 T740 260" />
        <path d="M680 100 Q710 92 740 100 T800 100" /><path d="M700 170 Q730 162 760 170 T800 170" />
      </g>
      {/* Compass rose */}
      <g transform="translate(740 60)">
        <circle cx="0" cy="0" r="22" fill="white" opacity="0.9" />
        <circle cx="0" cy="0" r="18" fill="#E8F5EE" />
        <path d="M0-14 L4-4 L0-8 L-4-4Z" fill="#1D9E75" />
        <path d="M0 14 L4 4 L0 8 L-4 4Z" fill="#888" />
        <path d="M-14 0 L-4-4 L-8 0 L-4 4Z" fill="#888" />
        <path d="M14 0 L4-4 L8 0 L4 4Z" fill="#888" />
        <text x="0" y="-18" textAnchor="middle" fill="#1D9E75" fontSize="8" fontWeight="bold">N</text>
      </g>
    </svg>
  )
}

/** Healthcare — modern clinic building with medical cross */
export function HealthcareHero({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 320" className={className} xmlns="http://www.w3.org/2000/svg"
      role="img" aria-label="Modern healthcare clinic in Da Nang with medical cross">
      <defs>
        <linearGradient id="hc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D6EAF8" /><stop offset="100%" stopColor="#EAF6FD" />
        </linearGradient>
        <linearGradient id="hc-bld" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDFEFE" /><stop offset="100%" stopColor="#EBF5FB" />
        </linearGradient>
      </defs>
      <rect width="800" height="320" fill="url(#hc-sky)" />
      {/* Sun */}
      <circle cx="720" cy="66" r="44" fill="#FFE4A0" opacity="0.5" />
      <circle cx="720" cy="66" r="28" fill="#F5A623" opacity="0.8" />
      {/* Clouds */}
      <g fill="white" opacity="0.85">
        <ellipse cx="150" cy="60" rx="60" ry="22" /><ellipse cx="200" cy="52" rx="40" ry="18" /><ellipse cx="110" cy="56" rx="36" ry="16" />
        <ellipse cx="490" cy="48" rx="48" ry="18" /><ellipse cx="534" cy="42" rx="30" ry="14" />
      </g>
      {/* Ground */}
      <rect x="0" y="260" width="800" height="60" fill="#E8F5EE" />
      {/* Path */}
      <rect x="340" y="220" width="120" height="40" fill="#F0EAD6" />
      {/* Trees left */}
      <g fill="#1D9E75">
        <circle cx="100" cy="210" r="36" /><circle cx="78" cy="224" r="28" /><circle cx="124" cy="222" r="30" />
        <rect x="96" y="240" width="10" height="28" fill="#7A5230" />
      </g>
      <g fill="#1D9E75">
        <circle cx="180" cy="220" r="30" /><circle cx="162" cy="232" r="24" /><circle cx="198" cy="230" r="26" />
        <rect x="176" y="244" width="9" height="24" fill="#7A5230" />
      </g>
      {/* Trees right */}
      <g fill="#1D9E75">
        <circle cx="660" cy="212" r="34" /><circle cx="638" cy="226" r="26" /><circle cx="682" cy="222" r="28" />
        <rect x="656" y="240" width="9" height="28" fill="#7A5230" />
      </g>
      <g fill="#1D9E75">
        <circle cx="730" cy="220" r="28" /><circle cx="714" cy="230" r="22" />
        <rect x="726" y="242" width="9" height="26" fill="#7A5230" />
      </g>
      {/* Main building */}
      <rect x="240" y="100" width="320" height="160" rx="4" fill="url(#hc-bld)" stroke="#D5E8F5" strokeWidth="2" />
      {/* Building top section */}
      <rect x="280" y="70" width="240" height="36" rx="4" fill="white" stroke="#D5E8F5" strokeWidth="2" />
      {/* Rooftop rail */}
      <rect x="270" y="66" width="260" height="8" rx="3" fill="#1D9E75" />
      {/* Medical cross on building */}
      <rect x="378" y="82" width="44" height="14" rx="3" fill="#E74C3C" />
      <rect x="392" y="68" width="16" height="42" rx="3" fill="#E74C3C" />
      {/* Windows */}
      <g fill="#D6EAF8" stroke="#B8D4E8" strokeWidth="1.5">
        <rect x="262" y="120" width="50" height="40" rx="3" />
        <rect x="326" y="120" width="50" height="40" rx="3" />
        <rect x="424" y="120" width="50" height="40" rx="3" />
        <rect x="488" y="120" width="50" height="40" rx="3" />
        <rect x="262" y="178" width="50" height="36" rx="3" />
        <rect x="326" y="178" width="50" height="36" rx="3" />
        <rect x="424" y="178" width="50" height="36" rx="3" />
        <rect x="488" y="178" width="50" height="36" rx="3" />
      </g>
      {/* Window cross bars */}
      <g stroke="#B8D4E8" strokeWidth="1" opacity="0.7">
        <line x1="287" y1="120" x2="287" y2="160" /><line x1="262" y1="140" x2="312" y2="140" />
        <line x1="351" y1="120" x2="351" y2="160" /><line x1="326" y1="140" x2="376" y2="140" />
        <line x1="449" y1="120" x2="449" y2="160" /><line x1="424" y1="140" x2="474" y2="140" />
        <line x1="513" y1="120" x2="513" y2="160" /><line x1="488" y1="140" x2="538" y2="140" />
      </g>
      {/* Main entrance */}
      <rect x="350" y="204" width="100" height="56" rx="4" fill="#1AA5D8" opacity="0.2" stroke="#1AA5D8" strokeWidth="2" />
      <rect x="368" y="208" width="28" height="52" rx="3" fill="#D6EAF8" />
      <rect x="404" y="208" width="28" height="52" rx="3" fill="#D6EAF8" />
      {/* Columns */}
      <rect x="264" y="96" width="12" height="168" rx="2" fill="#EBF5FB" stroke="#D5E8F5" strokeWidth="1" />
      <rect x="524" y="96" width="12" height="168" rx="2" fill="#EBF5FB" stroke="#D5E8F5" strokeWidth="1" />
      {/* Hospital sign */}
      <rect x="290" y="74" width="218" height="20" rx="3" fill="#0A3A5C" opacity="0.9" />
      <text x="399" y="88" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">VINMEC INTERNATIONAL HOSPITAL</text>
      {/* Ambulance */}
      <g transform="translate(620 248)">
        <rect x="-50" y="-22" width="100" height="38" rx="5" fill="white" stroke="#DDD" strokeWidth="1.5" />
        <rect x="-50" y="-22" width="30" height="38" rx="5" fill="#E74C3C" />
        {/* Red cross on ambulance */}
        <rect x="-42" y="-8" width="14" height="5" rx="1" fill="white" />
        <rect x="-38" y="-13" width="6" height="16" rx="1" fill="white" />
        {/* Wheels */}
        <circle cx="-30" cy="16" r="10" fill="#333" /><circle cx="-30" cy="16" r="6" fill="#666" />
        <circle cx="30" cy="16" r="10" fill="#333" /><circle cx="30" cy="16" r="6" fill="#666" />
        {/* Window */}
        <rect x="-14" y="-18" width="52" height="22" rx="3" fill="#A8D8F0" />
        <line x1="12" y1="-18" x2="12" y2="4" stroke="#DDD" strokeWidth="1" />
      </g>
    </svg>
  )
}

/** Opening a Bank Account — bank building with ATM and card */
export function BankHero({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 320" className={className} xmlns="http://www.w3.org/2000/svg"
      role="img" aria-label="Vietnamese bank building with ATM machine and bank card">
      <defs>
        <linearGradient id="bk-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EEF2F7" /><stop offset="100%" stopColor="#F8FAFD" />
        </linearGradient>
        <linearGradient id="bk-bld" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FAFBFD" /><stop offset="100%" stopColor="#EEF2F7" />
        </linearGradient>
      </defs>
      <rect width="800" height="320" fill="url(#bk-sky)" />
      {/* Sky tint */}
      <circle cx="680" cy="72" r="50" fill="#FFF3D0" opacity="0.6" />
      <circle cx="680" cy="72" r="30" fill="#F5A623" opacity="0.75" />
      <g fill="white" opacity="0.8">
        <ellipse cx="140" cy="58" rx="58" ry="22" /><ellipse cx="186" cy="50" rx="38" ry="16" /><ellipse cx="104" cy="54" rx="32" ry="14" />
        <ellipse cx="460" cy="46" rx="44" ry="16" /><ellipse cx="500" cy="40" rx="26" ry="12" />
      </g>
      {/* Ground */}
      <rect x="0" y="272" width="800" height="48" fill="#E8EBF0" />
      {/* Pavement */}
      <rect x="0" y="268" width="800" height="8" fill="#D0D4DC" />
      {/* Tree left */}
      <g fill="#1D9E75">
        <circle cx="110" cy="215" r="36" /><circle cx="90" cy="230" r="28" /><circle cx="130" cy="228" r="30" />
        <rect x="106" y="246" width="10" height="30" fill="#7A5230" />
      </g>
      {/* Tree right */}
      <g fill="#1D9E75">
        <circle cx="690" cy="215" r="36" /><circle cx="670" cy="230" r="28" /><circle cx="710" cy="228" r="30" />
        <rect x="686" y="246" width="10" height="30" fill="#7A5230" />
      </g>
      {/* Bank building */}
      <rect x="200" y="90" width="400" height="182" rx="2" fill="url(#bk-bld)" stroke="#D8DFE8" strokeWidth="2" />
      {/* Pediment / triangular roof */}
      <path d="M185 92 L400 42 L615 92Z" fill="#EEF2F7" stroke="#D8DFE8" strokeWidth="2" />
      <path d="M210 92 L400 52 L590 92Z" fill="white" />
      {/* Bank name on pediment */}
      <text x="400" y="78" textAnchor="middle" fill="#0A3A5C" fontSize="13" fontWeight="bold" fontFamily="sans-serif">VIETCOMBANK</text>
      {/* Columns */}
      {[240, 300, 360, 440, 500, 560].map((x, i) => (
        <g key={i}>
          <rect x={x} y="90" width="18" height="178" rx="4" fill="#F0F3F8" stroke="#D8DFE8" strokeWidth="1" />
          <ellipse cx={x + 9} cy="90" rx="12" ry="6" fill="#DDE3EC" />
          <rect x={x - 2} y="264" width="22" height="8" rx="2" fill="#DDE3EC" />
        </g>
      ))}
      {/* Windows */}
      <g fill="#C8D8F0" stroke="#B0C4E0" strokeWidth="1.5">
        <rect x="222" y="120" width="44" height="54" rx="3" />
        <rect x="330" y="120" width="44" height="54" rx="3" />
        <rect x="426" y="120" width="44" height="54" rx="3" />
        <rect x="534" y="120" width="44" height="54" rx="3" />
      </g>
      {/* Main door */}
      <rect x="364" y="210" width="72" height="62" rx="4" fill="#1D9E75" opacity="0.15" stroke="#1D9E75" strokeWidth="2" />
      <rect x="369" y="214" width="28" height="58" rx="3" fill="#C8D8F0" />
      <rect x="403" y="214" width="28" height="58" rx="3" fill="#C8D8F0" />
      {/* Steps */}
      <rect x="320" y="272" width="160" height="8" rx="0" fill="#D0D4DC" />
      <rect x="300" y="278" width="200" height="8" rx="0" fill="#C4C8D0" />
      {/* Vietnam flag on top */}
      <rect x="394" y="22" width="3" height="26" fill="#888" />
      <rect x="397" y="22" width="22" height="15" fill="#E74C3C" />
      <path d="M408 26 L411 34 L419 34 L413 39 L415 47 L408 42 L401 47 L403 39 L397 34 L405 34Z" fill="#F5A623" transform="scale(0.6) translate(270 18)" />
      {/* ATM machine */}
      <g transform="translate(660 230)">
        <rect x="-36" y="-60" width="72" height="90" rx="6" fill="#0A3A5C" />
        <rect x="-28" y="-52" width="56" height="34" rx="3" fill="#1AA5D8" opacity="0.8" />
        {/* Screen content */}
        <rect x="-22" y="-48" width="44" height="8" rx="2" fill="white" opacity="0.5" />
        <rect x="-22" y="-36" width="32" height="6" rx="2" fill="white" opacity="0.3" />
        {/* Card slot */}
        <rect x="-20" y="-4" width="40" height="6" rx="2" fill="#333" />
        <rect x="-16" y="-5" width="32" height="4" rx="1" fill="#555" />
        {/* Keypad */}
        <g fill="#1D9E75" opacity="0.8">
          {[-12, 0, 12].map((x) => [-36, -24, -12].map((y) => (
            <rect key={`${x}${y}`} x={x - 5} y={y + 24} width="10" height="8" rx="2" />
          )))}
        </g>
        {/* Cash slot */}
        <rect x="-18" y="20" width="36" height="5" rx="2" fill="#555" />
        {/* Screen glare */}
        <path d="M-22-52 L-8-52 L-22-24Z" fill="white" opacity="0.08" />
      </g>
      {/* Bank card floating */}
      <g transform="translate(580 255) rotate(-12)">
        <rect x="-44" y="-28" width="88" height="56" rx="6" fill="#1D9E75" />
        <rect x="-44" y="-28" width="88" height="20" rx="6" fill="#0F6E56" />
        <rect x="-36" y="-6" width="20" height="16" rx="2" fill="#F5A623" />
        <text x="-6" y="8" fill="white" fontSize="8" opacity="0.7" fontFamily="monospace">•••• 4821</text>
        <text x="-36" y="22" fill="white" fontSize="7" opacity="0.7">VIETCOMBANK</text>
      </g>
    </svg>
  )
}

/** Visa Options — open passport with Vietnam visa stamp */
export function VisaHero({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 320" className={className} xmlns="http://www.w3.org/2000/svg"
      role="img" aria-label="Vietnamese passport open showing visa stamp and entry pages">
      <defs>
        <linearGradient id="vs-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0A3A5C" /><stop offset="50%" stopColor="#0E4D78" /><stop offset="100%" stopColor="#0A3A5C" />
        </linearGradient>
        <linearGradient id="vs-page" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDFCF8" /><stop offset="100%" stopColor="#F5F0E8" />
        </linearGradient>
        <linearGradient id="vs-cover" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A2A52" /><stop offset="100%" stopColor="#0E1E3C" />
        </linearGradient>
      </defs>
      {/* Background */}
      <rect width="800" height="320" fill="url(#vs-bg)" />
      {/* Star pattern background */}
      <g fill="#F5A623" opacity="0.06" fontSize="18">
        {[60, 160, 260, 360, 460, 560, 660, 760].map((x) =>
          [50, 130, 210, 290].map((y) => (
            <text key={`${x}${y}`} x={x} y={y} textAnchor="middle">✦</text>
          ))
        )}
      </g>
      {/* Vietnam map silhouette */}
      <path d="M660 30 Q680 50 690 90 Q700 130 685 170 Q670 210 650 240 Q630 270 610 290 Q640 270 660 240 Q680 210 695 170 Q710 130 700 90 Q690 50 670 30Z"
        fill="white" opacity="0.04" />
      {/* Passport spine shadow */}
      <rect x="388" y="44" width="24" height="232" rx="4" fill="#000" opacity="0.25" />
      {/* Left page — passport interior */}
      <rect x="150" y="44" width="240" height="232" rx="6 0 0 6" fill="url(#vs-page)" />
      {/* Left page pattern border */}
      <rect x="158" y="52" width="224" height="216" rx="3" fill="none" stroke="#E8D8C0" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Vietnam coat of arms area */}
      <circle cx="270" cy="120" r="44" fill="#E74C3C" opacity="0.08" />
      <circle cx="270" cy="120" r="36" fill="none" stroke="#E74C3C" strokeWidth="1" opacity="0.3" />
      {/* Star */}
      <path d="M270 96 L276 114 L295 114 L280 126 L286 144 L270 132 L254 144 L260 126 L245 114 L264 114Z"
        fill="#F5A623" opacity="0.7" />
      {/* Photo placeholder */}
      <rect x="172" y="148" width="60" height="76" rx="4" fill="#D5E8F5" stroke="#B8CCE0" strokeWidth="1.5" />
      <circle cx="202" cy="174" r="14" fill="#A8C0D8" />
      <path d="M176 224 Q202 198 228 224" fill="#B8CCE0" />
      {/* Name/ID text lines */}
      <rect x="242" y="152" width="130" height="8" rx="2" fill="#0A3A5C" opacity="0.15" />
      <rect x="242" y="168" width="100" height="6" rx="2" fill="#0A3A5C" opacity="0.1" />
      <rect x="242" y="182" width="120" height="6" rx="2" fill="#0A3A5C" opacity="0.1" />
      <rect x="242" y="196" width="90" height="6" rx="2" fill="#0A3A5C" opacity="0.1" />
      {/* MRZ lines */}
      <rect x="160" y="222" width="220" height="7" rx="1" fill="#0A3A5C" opacity="0.08" />
      <rect x="160" y="234" width="220" height="7" rx="1" fill="#0A3A5C" opacity="0.08" />
      <text x="200" y="230" fill="#0A3A5C" fontSize="6" opacity="0.3" fontFamily="monospace">PVNNAM&lt;&lt;NGUYEN&lt;VAN&lt;A&lt;&lt;&lt;&lt;&lt;</text>
      <text x="200" y="242" fill="#0A3A5C" fontSize="6" opacity="0.3" fontFamily="monospace">AB1234567&lt;7VNM900101M280101</text>
      {/* Right page — visa stamps */}
      <rect x="412" y="44" width="240" height="232" rx="0 6 6 0" fill="url(#vs-page)" />
      <rect x="420" y="52" width="224" height="216" rx="3" fill="none" stroke="#E8D8C0" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Vietnam e-Visa stamp */}
      <g transform="translate(490 120) rotate(-8)">
        <rect x="-64" y="-44" width="128" height="88" rx="6" fill="none" stroke="#E74C3C" strokeWidth="3" />
        <rect x="-58" y="-38" width="116" height="76" rx="4" fill="none" stroke="#E74C3C" strokeWidth="1" opacity="0.5" />
        <text x="0" y="-18" textAnchor="middle" fill="#E74C3C" fontSize="9" fontWeight="bold" fontFamily="sans-serif">SOCIALIST REPUBLIC OF VIETNAM</text>
        <text x="0" y="-4" textAnchor="middle" fill="#E74C3C" fontSize="14" fontWeight="bold">e-VISA</text>
        <text x="0" y="10" textAnchor="middle" fill="#E74C3C" fontSize="8">ADMITTED • NHẬP CẢNH</text>
        <text x="0" y="24" textAnchor="middle" fill="#0A3A5C" fontSize="8" opacity="0.7">DURATION: 90 DAYS</text>
        <text x="0" y="36" textAnchor="middle" fill="#0A3A5C" fontSize="7" opacity="0.5">MULTIPLE ENTRY</text>
      </g>
      {/* Entry stamp */}
      <g transform="translate(566 210) rotate(6)">
        <circle cx="0" cy="0" r="36" fill="none" stroke="#1D9E75" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="30" fill="none" stroke="#1D9E75" strokeWidth="1" opacity="0.5" />
        <text x="0" y="-14" textAnchor="middle" fill="#1D9E75" fontSize="7" fontWeight="bold">DA NANG</text>
        <text x="0" y="-2" textAnchor="middle" fill="#1D9E75" fontSize="8" fontWeight="bold">AIRPORT</text>
        <text x="0" y="10" textAnchor="middle" fill="#1D9E75" fontSize="7">15 JAN 2026</text>
        <text x="0" y="20" textAnchor="middle" fill="#1D9E75" fontSize="7">IMMIGRATION</text>
      </g>
      {/* Small stamps */}
      <g transform="translate(432 78) rotate(-4)">
        <rect x="-28" y="-18" width="56" height="36" rx="3" fill="none" stroke="#1AA5D8" strokeWidth="2" />
        <text x="0" y="-4" textAnchor="middle" fill="#1AA5D8" fontSize="7" fontWeight="bold">DEPARTED</text>
        <text x="0" y="8" textAnchor="middle" fill="#1AA5D8" fontSize="6">08 NOV 2025</text>
      </g>
      {/* Airplane icon */}
      <g transform="translate(720 80)">
        <path d="M0-20 L6 6 L-2 4 L-4 16 L-7 14 L-8 4 L-20 8 L-22 4 L-10-4 L-12-18 L-6-20Z"
          fill="white" opacity="0.15" transform="rotate(45)" />
      </g>
      {/* Globe */}
      <g transform="translate(724 230)">
        <circle cx="0" cy="0" r="36" fill="none" stroke="white" strokeWidth="1.5" opacity="0.1" />
        <circle cx="0" cy="0" r="36" fill="none" stroke="white" strokeWidth="1" opacity="0.07" />
        <ellipse cx="0" cy="0" rx="20" ry="36" fill="none" stroke="white" strokeWidth="1" opacity="0.07" />
        <line x1="-36" y1="0" x2="36" y2="0" stroke="white" strokeWidth="1" opacity="0.07" />
        <ellipse cx="0" cy="0" rx="36" ry="14" fill="none" stroke="white" strokeWidth="1" opacity="0.07" />
      </g>
    </svg>
  )
}

/** Maps guide slug → its hero component */
export const GUIDE_HERO_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'getting-around-da-nang': MotorbikeHero,
  'cost-of-living-da-nang': CostHero,
  'best-neighborhoods-da-nang-expats': NeighborhoodHero,
  'healthcare-da-nang': HealthcareHero,
  'opening-bank-account-da-nang': BankHero,
  'visa-options-da-nang': VisaHero,
}

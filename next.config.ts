import type { NextConfig } from "next";

const SUPABASE_HOST = "https://kdlmuicpuxbduzgednih.supabase.co";

/**
 * Content Security Policy, shipped in report-only mode.
 *
 * Two constraints shape this policy and are worth stating, because they rule
 * out the stricter approach the Next.js docs describe:
 *
 * 1. A nonce-based strict CSP requires per-request nonces, which requires
 *    dynamic rendering. The homepage was only just moved back onto ISR
 *    (`x-vercel-cache: HIT`), and forcing it dynamic again to tighten the CSP
 *    would trade a measured performance win for a theoretical security one.
 *
 * 2. Google Tag Manager injects tags at runtime, by design. Any policy that
 *    would meaningfully constrain injected scripts also breaks GTM the moment
 *    a new tag is added in the container UI.
 *
 * So `script-src` carries 'unsafe-inline'. This policy is therefore an origin
 * allowlist, not XSS protection — it limits *where* resources may come from,
 * and locks down framing, objects, base URI and form targets. That is worth
 * having; it is not the same as a strict CSP, and should not be described as one.
 *
 * Report-only until violation reports confirm nothing legitimate is blocked.
 * Switch the header name to `Content-Security-Policy` to enforce.
 */
const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' is required by GTM and Clarity; see note above.
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.clarity.ms`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://res.cloudinary.com https://lh3.googleusercontent.com https://www.googletagmanager.com https://*.clarity.ms https://c.bing.com`,
  "font-src 'self' data:",
  `connect-src 'self' ${SUPABASE_HOST} wss://kdlmuicpuxbduzgednih.supabase.co https://www.googletagmanager.com https://*.clarity.ms https://c.bing.com https://*.google-analytics.com https://*.analytics.google.com`,
  "frame-src https://www.googletagmanager.com",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // `upgrade-insecure-requests` is deliberately absent: browsers ignore it in a
  // report-only policy and log a console error on every page load. Add it in
  // the same change that switches this header to enforcing.
].join("; ");

const nextConfig: NextConfig = {
  // Don't advertise the framework/version on every response.
  poweredByHeader: false,
  experimental: {
    mcpServer: false,
    // experimental.inlineCss was measured and rejected. It flips Lighthouse's
    // render-blocking audit from 0.5 to 1, but the median of three runs showed
    // FCP +8ms and LCP +39ms, and it inflates the document from 135KB to 381KB
    // uncompressed — which every returning visitor pays on every page. The site
    // already measures LCP 0.51s at Performance 100 in production, so there is
    // no headroom the flag could buy back. Passing the audit is not the goal.
  },
  async redirects() {
    // Housing and motorbike each had two competing indexable pages: a ~35-word
    // /services/ stub and the real hub carrying the live inventory. The stubs
    // fold into the hubs so one URL owns each intent.
    return [
      { source: "/services/housing", destination: "/housing", permanent: true },
      {
        source: "/services/motorbike-rental",
        destination: "/motorbike-rental",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          { key: "Content-Security-Policy-Report-Only", value: CSP },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      // Allow real listing photos hosted on common image CDNs
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;

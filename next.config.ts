import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework/version on every response.
  poweredByHeader: false,
  experimental: {
    mcpServer: false,
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

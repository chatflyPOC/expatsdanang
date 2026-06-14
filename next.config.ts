import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    mcpServer: false,
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

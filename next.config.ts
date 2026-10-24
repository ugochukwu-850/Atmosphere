import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    agentUpgrade: "security",
    // Gear handoff reports upload a photo (max 4MB) through a Server Action
    // (default limit 1MB). Vercel caps function request bodies at 4.5MB.
    serverActions: { bodySizeLimit: "4.5mb" },
  },
  images: {
    remotePatterns: [
      // Listing photos served by the API.
      { protocol: "https", hostname: "images.unsplash.com" },
      // Decorative marketing placeholders (src/lib/placeholder.ts).
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

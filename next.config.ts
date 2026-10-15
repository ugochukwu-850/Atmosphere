import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Gear handoff reports upload a photo of up to 8MB through a Server
    // Action (default limit 1MB); the extra MB covers multipart overhead.
    serverActions: { bodySizeLimit: "9mb" },
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

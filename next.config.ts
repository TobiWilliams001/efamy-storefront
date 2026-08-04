import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP as the fallback. Encoding is slower on the first request
    // but the cached result is meaningfully smaller for photography.
    formats: ["image/avif", "image/webp"],
    // Nothing ever renders wider than the 1280px container, so the default
    // 2048/3840 breakpoints only cost encode time and cache storage.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    // `radix-ui` is a barrel that re-exports every primitive; without this the
    // whole library lands in the client bundle. lucide-react is handled by
    // default, radix-ui is not.
    optimizePackageImports: ["radix-ui"],
  },
  // remotePatterns will be added here once the CMS is chosen.
};

export default nextConfig;

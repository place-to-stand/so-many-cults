import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Default list ends in 3840, which every `sizes="…vw"` srcset then advertises. Some press
    // originals are 5000px+ (kept hi-res for EPK downloads), so that variant came out at ~2 MB.
    // 2048 still covers 2x retina laptops; nothing on the site needs a wider raster.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
  // Reverse-proxy PostHog through our own origin so tracking isn't blocked by ad blockers.
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
    ];
  },
  // PostHog's API uses trailing slashes; don't let Next redirect them away.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;

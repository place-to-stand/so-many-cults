import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

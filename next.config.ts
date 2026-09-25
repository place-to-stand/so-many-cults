import type { NextConfig } from "next";
import links from "./data/links.json";

const nextConfig: NextConfig = {
  images: {
    // Default list ends in 3840, which every `sizes="…vw"` srcset then advertises. Some press
    // originals are 5000px+ (kept hi-res for EPK downloads), so that variant came out at ~2 MB.
    // 2048 still covers 2x retina laptops; nothing on the site needs a wider raster.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
  // /merch is a vanity URL for the external store (the Merch nav link points there directly). Temporary
  // redirect on purpose: the store isn't live yet and the collection URL may still change, and browsers
  // cache 308s. `{/}?` also catches /merch/ because skipTrailingSlashRedirect (below) turns off Next's own
  // trailing-slash normalisation. Config redirects run before proxy.ts, so Markdown clients get it too.
  async redirects() {
    return [{ source: "/merch{/}?", destination: links.store, permanent: false }];
  },
  // Reverse-proxy PostHog through our own origin so tracking isn't blocked by ad blockers.
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
    ];
  },
  // Every page can be served as HTML or Markdown from the same URL (Accept negotiation in proxy.ts), so
  // shared caches must key on Accept. The Markdown responses set it themselves; this adds it to the HTML
  // variant. Vercel applies route headers to the final response. Note that `next start` (the Node server)
  // overwrites Vary on prerendered app pages with its own value, so the header only shows there on
  // route handlers such as /llms.txt.
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "Vary", value: "Accept" }] }];
  },
  // PostHog's API uses trailing slashes; don't let Next redirect them away.
  skipTrailingSlashRedirect: true,
  // /og.png reads cover art from public/ through a computed path, so the file tracer bundles all of
  // public/ into its function, and the WAV masters alone push that past Vercel's 250 MB function limit.
  // Audio is only ever served statically, so keep it out of every function bundle.
  outputFileTracingExcludes: { "*": ["./public/audio/**"] },
};

export default nextConfig;

// Runs once in the browser before hydration (Next.js instrumentation-client).
// PostHog is initialised here. With `defaults: "2025-05-24"` pageviews are captured on
// initial load and on history changes (App Router navigations) — no manual tracker needed.
import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  posthog.init(key, {
    // Same-origin proxy (see next.config.ts rewrites) so ad blockers don't drop events.
    api_host: "/ingest",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.posthog.com",
    capture_pageleave: true,
    person_profiles: "identified_only",
    defaults: "2025-05-24",
  });
}

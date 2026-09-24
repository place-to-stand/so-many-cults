"use client";

import { useLayoutEffect } from "react";

/**
 * Arriving on a page whose URL hash names an element: paint from the top, then glide down to the target
 * with the site-wide smooth scroll. Links into the page pass `scroll={false}` so Next doesn't jump there
 * (or slide from the previous page's scroll position) first.
 */
export function HashGlide() {
  useLayoutEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || !document.getElementById(id)) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    // Next task, so anything opened for this hash in the same commit (Past Shows) is laid out first.
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 0);
    return () => window.clearTimeout(timer);
  }, []);
  return null;
}

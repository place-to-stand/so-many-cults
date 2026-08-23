"use client";

import { useEffect, useRef } from "react";
import type { Photo } from "../data/photos";

function readHash(): string | null {
  const m = window.location.hash.match(/^#photo=([^&]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

/**
 * Keeps a lightbox's open photo in the URL hash (#photo=<id>) so it can be shared,
 * opens the matching photo when landing on such a link, and closes on browser Back.
 * Safe with several lightboxes on one page: each only reacts to ids it owns.
 */
export function useLightboxHash(photos: Photo[], index: number | null, setIndex: (i: number | null) => void) {
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  const ids = photos.map((p) => p.id).join("|");

  // URL → state: on load (deferred a frame so it isn't a synchronous set-in-effect) and on Back/Forward.
  useEffect(() => {
    const indexFor = (id: string | null) => (id ? photosRef.current.findIndex((p) => p.id === id) : -1);
    const raf = requestAnimationFrame(() => {
      const i = indexFor(readHash());
      if (i >= 0) setIndex(i);
    });
    const onHashChange = () => {
      const id = readHash();
      const i = indexFor(id);
      if (i >= 0) setIndex(i);
      else if (!id) setIndex(null);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [ids, setIndex]);

  // state → URL: skip the very first run so a URL-driven open is never clobbered.
  const prev = useRef<number | null | undefined>(undefined);
  useEffect(() => {
    const was = prev.current;
    prev.current = index;
    if (was === undefined || was === index) return;
    const current = readHash();
    const mine = (id: string | null) => !!id && photosRef.current.some((p) => p.id === id);
    if (index === null) {
      if (mine(current)) history.replaceState(null, "", window.location.pathname + window.location.search);
      return;
    }
    const id = photosRef.current[index]?.id;
    if (!id || current === id) return;
    const url = `${window.location.pathname}${window.location.search}#photo=${encodeURIComponent(id)}`;
    if (mine(current)) history.replaceState(null, "", url);
    else history.pushState(null, "", url);
  }, [index]);
}

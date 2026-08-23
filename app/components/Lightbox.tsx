"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useCallback, useState, useRef } from "react";
import type { Photo } from "../data/photos";
import { formatLongDate } from "../data/dates";

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 6 15 12 9 18" />
      )}
    </svg>
  );
}

/**
 * Full-screen photo viewer with prev/next, keyboard navigation and optional hi-res download.
 * Controlled: the parent owns `index` and decides when to render it.
 */
export function Lightbox({
  photos,
  index,
  onIndexChange,
  onClose,
  showDownload = false,
  thumbnailSizes = "(max-width: 640px) 45vw, 280px",
  placeholderSrc = "thumbnail",
}: {
  photos: Photo[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  showDownload?: boolean;
  /** Must match the `sizes` the opening tile used, so the placeholder hits the same cached URL. */
  thumbnailSizes?: string;
  /** Which file the opening tile rendered, so the placeholder is the same cached URL. */
  placeholderSrc?: "thumbnail" | "fullSize";
}) {
  const photo = photos[index];
  const canNavigate = photos.length > 1;

  // Entrance: mount at opacity 0, then transition in on the next frame.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Exit: reverse the entrance transition first, then unmount via onClose.
  const closingRef = useRef(false);
  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }
    setEntered(false);
    window.setTimeout(onClose, 200);
  }, [onClose]);

  const goToPrev = useCallback(() => {
    onIndexChange(index === 0 ? photos.length - 1 : index - 1);
  }, [index, photos.length, onIndexChange]);

  const goToNext = useCallback(() => {
    onIndexChange(index === photos.length - 1 ? 0 : index + 1);
  }, [index, photos.length, onIndexChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && canNavigate) goToPrev();
      else if (e.key === "ArrowRight" && canNavigate) goToNext();
      else if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext, requestClose, canNavigate]);


  // Full-res loads behind the (already cached) thumbnail and cross-fades in; tracked per photo id.
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const fullLoaded = loadedId === photos[index]?.id;

  if (!photo) return null;

  return (
        <div
          className={`fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 transition-opacity duration-200 ease-out motion-reduce:transition-none ${entered ? "opacity-100" : "opacity-0"}`}
          onClick={requestClose}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl z-10"
            onClick={requestClose}
          >
            ×
          </button>

          {/* Left arrow */}
          {canNavigate && (
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
          >
            <ArrowIcon direction="left" />
          </button>
          )}

          {/* Right arrow */}
          {canNavigate && (
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
          >
            <ArrowIcon direction="right" />
          </button>
          )}

          <div
            className={`relative max-w-4xl max-h-[85vh] w-full h-full transition-transform duration-300 ease-out motion-reduce:transition-none ${
              entered ? "scale-100" : "scale-[0.97]"
            }`}
          >
            {/* Thumbnail (already in cache) shows instantly… */}
            <Image
              src={placeholderSrc === "fullSize" ? photo.fullSize : photo.thumbnail}
              alt=""
              aria-hidden
              fill
              sizes={thumbnailSizes}
              className="object-contain"
            />
            {/* …and the full-res cross-fades over it once loaded. */}
            <Image
              key={photo.id}
              src={photo.fullSize}
              alt={`${photo.venue} - Photo by ${photo.photographer}`}
              fill
              sizes="100vw"
              onLoad={() => setLoadedId(photo.id)}
              className={`object-contain transition-opacity duration-300 ease-out ${fullLoaded ? "opacity-100" : "opacity-0"}`}
            />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center text-[#888] text-sm">
            {[
              photo.photographer ? (
                <span key="credit">
                  {photo.creditLabel ?? "Photo by"}{" "}
                  {photo.photographerLink ? (
                    <Link href={photo.photographerLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-white">{photo.photographer}</Link>
                  ) : (
                    photo.photographer
                  )}
                </span>
              ) : null,
              photo.venue ? <span key="venue">{photo.venue}</span> : null,
              photo.date ? <span key="date">{formatLongDate(photo.date)}</span> : null,
            ]
              .filter(Boolean)
              .map((part, i) => (
                <span key={i}>
                  {i > 0 && " · "}
                  {part}
                </span>
              ))}
            {showDownload && (
              <>
                {" · "}
                <a
                  href={photo.fullSize}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="text-white/80 hover:text-white underline"
                >
                  Download Hi-Res
                </a>
              </>
            )}
          </div>
        </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useCallback } from "react";
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
}: {
  photos: Photo[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  showDownload?: boolean;
}) {
  const photo = photos[index];
  const canNavigate = photos.length > 1;

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
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext, onClose, canNavigate]);

  if (!photo) return null;

  return (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl z-10"
            onClick={onClose}
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

          <div className="relative max-w-4xl max-h-[85vh] w-full h-full">
            <Image
              src={photo.fullSize}
              alt={`${photo.venue} - Photo by ${photo.photographer}`}
              fill
              sizes="100vw"
              className="object-contain"
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

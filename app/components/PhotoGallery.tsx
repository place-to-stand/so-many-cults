"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

export interface Photo {
  id: string;
  thumbnail: string;
  fullSize: string;
  photographer: string;
  photographerLink: string;
  date: string;
  venue: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  showDownload?: boolean;
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

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

export function PhotoGallery({ photos, showDownload = false }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxPhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;

  const goToPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? photos.length - 1 : lightboxIndex - 1);
    }
  }, [lightboxIndex, photos.length]);

  const goToNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === photos.length - 1 ? 0 : lightboxIndex + 1);
    }
  }, [lightboxIndex, photos.length]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, goToPrev, goToNext, closeLightbox]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 w-full">
        {photos.map((photo, index) => (
          <div key={photo.id} className="flex flex-col">
            <div className="group relative aspect-square overflow-hidden bg-[#1a1a1a]">
              <button
                onClick={() => openLightbox(index)}
                className="absolute inset-0 cursor-pointer z-10"
              >
                <Image
                  src={photo.thumbnail}
                  alt={`${photo.venue} - Photo by ${photo.photographer}`}
                  fill
                  sizes="(max-width: 640px) 45vw, 280px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </button>
            </div>
            <div className="text-[#666] text-[10px] mt-1.5 flex justify-between items-center">
              <span>
                by <Link href={photo.photographerLink} target="_blank">{photo.photographer}</Link>
              </span>
              {showDownload && (
                <a
                  href={photo.fullSize}
                  download
                  className="text-[#888] hover:text-white transition-colors flex items-center gap-1"
                >
                  Hi-Res <DownloadIcon />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl z-10"
            onClick={closeLightbox}
          >
            ×
          </button>

          {/* Left arrow */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
          >
            <ArrowIcon direction="left" />
          </button>

          {/* Right arrow */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
          >
            <ArrowIcon direction="right" />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] w-full h-full">
            <Image
              src={lightboxPhoto.thumbnail}
              alt={`${lightboxPhoto.venue} - Photo by ${lightboxPhoto.photographer}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center text-[#888] text-sm">
            Photo by <Link href={lightboxPhoto.photographerLink} target="_blank" onClick={(e) => e.stopPropagation()} className="hover:text-white">{lightboxPhoto.photographer}</Link> · {lightboxPhoto.venue} · {lightboxPhoto.date}
            {showDownload && (
              <>
                {" · "}
                <a
                  href={lightboxPhoto.fullSize}
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
      )}
    </>
  );
}

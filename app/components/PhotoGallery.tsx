"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { Lightbox } from "./Lightbox";
import { useLightboxHash } from "./useLightboxHash";

import type { Photo } from "../data/photos";

interface PhotoGalleryProps {
  photos: Photo[];
  showDownload?: boolean;
  /** Columns at the sm breakpoint and up (always 2 on mobile). */
  columns?: 2 | 3 | 4;
}

/** Tile width hints per column count (container is max 1024px wide). */
const COLUMN_SIZES: Record<2 | 3 | 4, string> = {
  2: "(max-width: 640px) 50vw, 500px",
  3: "(max-width: 640px) 50vw, 340px",
  4: "(max-width: 640px) 50vw, 250px",
};

const COLUMN_CLASS: Record<2 | 3 | 4, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function PhotoGallery({ photos, showDownload = false, columns = 2 }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  useLightboxHash(photos, lightboxIndex, setLightboxIndex);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  return (
    <>
      <div className={`grid ${COLUMN_CLASS[columns]} gap-x-5 gap-y-6 w-full`}>
        {photos.map((photo, index) => (
          <div key={photo.id} className="flex flex-col">
            <div className="group relative isolate aspect-square overflow-hidden bg-[#1a1a1a]">
              <button
                onClick={() => openLightbox(index)}
                className="absolute inset-0 cursor-pointer z-10"
              >
                <Image
                  src={photo.fullSize}
                  alt={`${photo.venue} - Photo by ${photo.photographer}`}
                  fill
                  sizes={COLUMN_SIZES[columns]}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </button>
            </div>
            <div className="text-[#666] text-[10px] mt-1.5 flex justify-between gap-3 items-start">
              {showDownload ? (
                <a
                  href={photo.fullSize}
                  download
                  className="text-[#888] hover:text-white transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap"
                >
                  Hi-Res <DownloadIcon />
                </a>
              ) : (
                <span />
              )}
              {photo.photographer && (
                <span className="text-right">
                  by{" "}
                  {photo.photographerLink ? (
                    <Link href={photo.photographerLink} target="_blank" rel="noopener noreferrer">{photo.photographer}</Link>
                  ) : (
                    photo.photographer
                  )}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={closeLightbox}
          showDownload={showDownload}
          thumbnailSizes={COLUMN_SIZES[columns]}
          placeholderSrc="fullSize"
        />
      )}
    </>
  );
}

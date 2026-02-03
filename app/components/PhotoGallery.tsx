"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

export function PhotoGallery({ photos, showDownload = false }: PhotoGalleryProps) {
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 w-full">
        {photos.map((photo) => (
          <div key={photo.id} className="flex flex-col">
            <div className="group relative aspect-square overflow-hidden bg-[#1a1a1a]">
              <button
                onClick={() => setLightboxPhoto(photo)}
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
              {showDownload && (
                <a
                  href={photo.fullSize}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-2 right-2 z-20 p-1.5 bg-black/60 hover:bg-black/80 text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  title="Download hi-res"
                >
                  <DownloadIcon />
                </a>
              )}
            </div>
            <div className="text-[#666] text-[11px] mt-1.5 flex justify-between items-center">
              <span>
                <Link href={photo.photographerLink} target="_blank">{photo.photographer}</Link>
              </span>
              {showDownload && (
                <a
                  href={photo.fullSize}
                  download
                  className="text-[#888] hover:text-white transition-colors flex items-center gap-1"
                >
                  <DownloadIcon />
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
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
            onClick={() => setLightboxPhoto(null)}
          >
            ×
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Photo } from "../data/photos";
import { Lightbox } from "./Lightbox";
import { useLightboxHash } from "./useLightboxHash";

/**
 * An image that opens the shared lightbox over `photos`, starting at `index`,
 * with a small credit line bottom-right (same treatment as gallery thumbnails).
 */
export function LightboxImage({
  photos,
  index,
  alt,
  sizes = "(max-width: 1024px) 100vw, 480px",
  priority = false,
  className = "",
  imageClassName = "",
  showDownload = false,
  showCredit = true,
}: {
  photos: Photo[];
  index: number;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  showDownload?: boolean;
  /** Hide the credit line under the image (e.g. when credited elsewhere). */
  showCredit?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);
  useLightboxHash(photos, open, setOpen);
  const photo = photos[index];
  if (!photo) return null;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen(index)}
        aria-label={`View ${photo.venue}`}
        className="block w-full cursor-pointer group"
      >
        <Image
          src={photo.fullSize}
          alt={alt}
          width={1600}
          height={1600}
          sizes={sizes}
          placeholder={photo.blurDataURL ? "blur" : "empty"}
          blurDataURL={photo.blurDataURL}
          className={`w-full h-auto transition-opacity duration-300 group-hover:opacity-90 ${imageClassName}`}
          priority={priority}
        />
      </button>
      {showCredit && photo.photographer && (
        <div className="text-[#555] text-[10px] text-right mt-1 mr-1">
          {photo.creditLabel ?? "Photo by"}{" "}
          {photo.photographerLink ? (
            <Link href={photo.photographerLink} target="_blank" rel="noopener noreferrer">
              {photo.photographer}
            </Link>
          ) : (
            photo.photographer
          )}
        </div>
      )}
      {open !== null && (
        <Lightbox photos={photos} index={open} onIndexChange={setOpen} onClose={() => setOpen(null)} showDownload={showDownload} thumbnailSizes={sizes} placeholderSrc="fullSize" />
      )}
    </div>
  );
}

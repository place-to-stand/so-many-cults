import photosData from "@/data/photos.json";
import { getBlurDataURL } from "./blur";

export type Photo = {
  id: string;
  thumbnail: string;
  fullSize: string;
  /** Base64 blur-up placeholder shown while the image loads (see `npm run blur`). */
  blurDataURL?: string;
  photographer: string;
  photographerLink: string;
  /** YYYY-MM-DD */
  date: string;
  /** Venue for live shots; for press shots use a location or "Press Photo". */
  venue: string;
  showId?: string | null;
  /** Original filename, for your records. */
  source?: string;
  /** Caption prefix, defaults to "Photo by". Use "Artwork by" for cover art. */
  creditLabel?: string;
};

/** Attach the blur placeholder for whichever file the tile renders (full size first, thumbnail as fallback). */
export function withBlur<T extends { thumbnail: string; fullSize: string }>(photo: T): T & { blurDataURL?: string } {
  const blurDataURL = getBlurDataURL(photo.fullSize) ?? getBlurDataURL(photo.thumbnail);
  return blurDataURL ? { ...photo, blurDataURL } : photo;
}

export const pressPhotos: Photo[] = photosData.press.map(withBlur);
export const livePhotos: Photo[] = photosData.live.map(withBlur);
export const allPhotos: Photo[] = [...pressPhotos, ...livePhotos];

export const featuredPhoto: Photo =
  allPhotos.find((p) => p.id === photosData.featuredPhotoId) ?? allPhotos[0];

/** Kept for backwards compatibility with the original EPK naming. */
export const chessClubPhotos = livePhotos.filter((p) => p.showId === "2026-01-30-chess-club");

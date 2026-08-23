import photosData from "@/data/photos.json";

export type Photo = {
  id: string;
  thumbnail: string;
  fullSize: string;
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

export const pressPhotos: Photo[] = photosData.press;
export const livePhotos: Photo[] = photosData.live;
export const allPhotos: Photo[] = [...pressPhotos, ...livePhotos];

export const featuredPhoto: Photo =
  allPhotos.find((p) => p.id === photosData.featuredPhotoId) ?? allPhotos[0];

/** Kept for backwards compatibility with the original EPK naming. */
export const chessClubPhotos = livePhotos.filter((p) => p.showId === "2026-01-30-chess-club");

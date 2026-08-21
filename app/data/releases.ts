import releasesData from "@/data/releases.json";
import type { ExternalLink } from "./links";
import { getShowById, type Show } from "./shows";
import type { Photo } from "./photos";

export type Track = {
  title: string;
  duration: string | null;
  /** Streamable file under /public, or "" when not available. */
  audio: string;
  /** Plain text; \n for line breaks, blank line between stanzas. */
  lyrics: string;
  /** No lyrics by design (shown as "Instrumental"). */
  instrumental?: boolean;
};

export type ReleaseVideo = {
  title: string;
  url: string | null;
  director: string | null;
  premiereDate: string | null;
};

export type Release = {
  id: string;
  type: "single" | "album" | "ep";
  featured: boolean;
  title: string;
  status: "upcoming" | "released";
  releaseDate: string | null;
  artwork: string | null;
  /** Print-resolution artwork offered as a download on the EPK. */
  artworkHiRes: string | null;
  /** Cover artist credit; empty name hides the credit line. */
  artworkCredit: { name: string; url: string } | null;
  /** Streamable audio for the on-site player. */
  audio: string | null;
  description: string | null;
  /** Id of a block in credits.json. */
  creditsId: string | null;
  tracklist: Track[];
  links: ExternalLink[];
  video: ReleaseVideo | null;
  releaseShowId: string | null;
};

export const releases: Release[] = releasesData.releases as Release[];

export const featuredRelease: Release | undefined =
  releases.find((r) => r.featured) ?? releases[0];

export function getReleaseLinks(release: Release): ExternalLink[] {
  return release.links.filter((l) => l.url.trim() !== "");
}

/** Platforms shown as inert placeholders until a real URL is set. */
export const PLACEHOLDER_PLATFORMS: ExternalLink[] = [
  { platform: "bandcamp", label: "Bandcamp", url: "" },
  { platform: "spotify", label: "Spotify", url: "" },
  { platform: "apple-music", label: "Apple Music", url: "" },
  { platform: "youtube-music", label: "YouTube Music", url: "" },
  { platform: "tidal", label: "Tidal", url: "" },
  { platform: "amazon-music", label: "Amazon Music", url: "" },
];

/** Cover art as a lightbox-able "photo" so it can share the gallery viewer. */
export function artworkAsPhoto(release: Release): Photo | null {
  if (!release.artwork) return null;
  return {
    id: `artwork-${release.id}`,
    thumbnail: release.artwork,
    fullSize: release.artworkHiRes ?? release.artwork,
    photographer: release.artworkCredit?.name ?? "",
    photographerLink: release.artworkCredit?.url ?? "",
    date: release.releaseDate ?? "",
    venue: release.title,
    creditLabel: "Artwork by",
  };
}

export function getReleaseShow(release: Release): Show | undefined {
  return getShowById(release.releaseShowId);
}

export function hasVideo(release: Release): release is Release & { video: ReleaseVideo & { url: string } } {
  return Boolean(release.video?.url);
}

/** The next EP/album (first non-single release). */
export const recordRelease: Release | undefined = releases.find((r) => r.type !== "single");

export function releaseTypeLabel(release: Release): string {
  return release.type === "single" ? "Single" : release.type === "ep" ? "EP" : "Album";
}

/**
 * Turn a YouTube watch / share / shorts URL into a privacy-enhanced embed URL.
 * Returns null for anything that isn't recognizably YouTube.
 */
export function youtubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname === "youtu.be") id = u.pathname.slice(1);
    else if (u.hostname.endsWith("youtube.com") || u.hostname.endsWith("youtube-nocookie.com")) {
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else if (u.pathname.startsWith("/embed/")) id = u.pathname.split("/")[2];
      else if (u.pathname.startsWith("/shorts/")) id = u.pathname.split("/")[2];
    }
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

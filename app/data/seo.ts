import type { Metadata } from "next";
import { BAND_NAME, BAND_SUBTITLE, SITE_URL, shortBio, members, logo } from "./band";
import { socialLinks, streamingLinks } from "./links";
import { releases, featuredRelease, releaseTypeLabel, type Release } from "./releases";
import { allShows, type Show } from "./shows";
import { getVenue } from "./venues";
import { videos, youtubeEmbedUrl, type Video } from "./videos";
import { featuredPhoto } from "./photos";
import { formatLongDate } from "./dates";

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

/** Default share image: the featured release artwork, else the featured photo. */
export const defaultShareImage = {
  url: featuredRelease?.artwork ?? featuredPhoto.thumbnail,
  alt: featuredRelease?.artwork ? `${featuredRelease.title} — ${BAND_NAME}` : `${BAND_NAME} live`,
};

/** Page-specific metadata with canonical URL and matching OG / Twitter cards. */
export function pageMetadata({
  title,
  description,
  path,
  image = defaultShareImage,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: { url: string; alt: string };
  noindex?: boolean;
}): Metadata {
  const url = abs(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      siteName: BAND_NAME,
      title,
      description,
      url,
      images: [{ url: abs(image.url), alt: image.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: abs(image.url), alt: image.alt }],
    },
  };
}

/** Human descriptions assembled from the data so they stay current. */
export const descriptions = {
  home: shortBio,
  music: (() => {
    const parts = releases
      .filter((r) => r.releaseDate)
      .sort((a, b) => (a.releaseDate ?? "").localeCompare(b.releaseDate ?? ""))
      .map((r) => `${r.title} (${releaseTypeLabel(r).toLowerCase()}, ${formatLongDate(r.releaseDate!)})`);
    return `Music from ${BAND_NAME}, ${BAND_SUBTITLE.toLowerCase()}: ${parts.join(" and ")}. Stream, pre-save, lyrics and liner notes.`;
  })(),
  videos: `Music videos from ${BAND_NAME}${videos[0] ? `, including "${videos[0].title}" (${videos[0].kind.toLowerCase()})` : ""}.`,
  shows: `Upcoming and past shows from ${BAND_NAME} — Austin, TX psych punk — with dates, venues, set times and flyers.`,
  photos: `Press and live photos of ${BAND_NAME}, Austin, TX psych punk.`,
  about: shortBio,
};

/* ---------- JSON-LD ---------- */

export const artistId = `${SITE_URL}/#band`;

/** Minimal typed reference to the band, safe to embed on pages that don't carry the full MusicGroup node. */
const artistRef = { "@type": "MusicGroup", "@id": artistId, name: BAND_NAME, url: SITE_URL };

export function musicGroupJsonLd() {
  const sameAs = [...socialLinks, ...streamingLinks].map((l) => l.url);
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "@id": artistId,
    name: BAND_NAME,
    url: SITE_URL,
    genre: "Psych Punk",
    description: shortBio,
    image: abs(featuredPhoto.fullSize),
    logo: abs(logo.src),
    foundingDate: "2024",
    foundingLocation: { "@type": "Place", name: "Austin, Texas" },
    member: members.map((m) => ({ "@type": "Person", name: m.name, roleName: m.role })),
    sameAs,
  };
}

function releaseJsonLd(release: Release) {
  const isSingle = release.type === "single";
  const tracks = release.tracklist.map((t, i) => ({
    "@type": "MusicRecording",
    name: t.title,
    position: i + 1,
    ...(t.duration ? { duration: `PT${t.duration.replace(":", "M")}S` } : {}),
    byArtist: artistRef,
  }));
  return {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    "@id": `${SITE_URL}/music#${release.id}`,
    name: release.title,
    albumProductionType: "https://schema.org/StudioAlbum",
    albumReleaseType: isSingle ? "https://schema.org/SingleRelease" : "https://schema.org/EPRelease",
    byArtist: artistRef,
    ...(release.releaseDate ? { datePublished: release.releaseDate } : {}),
    ...(release.artwork ? { image: abs(release.artwork) } : {}),
    url: `${SITE_URL}/music`,
    numTracks: release.tracklist.length,
    ...(tracks.length ? { track: tracks } : {}),
  };
}

export function musicJsonLd() {
  return releases.map(releaseJsonLd);
}

function eventJsonLd(show: Show, today: string) {
  const venue = getVenue(show.venue);
  const address = show.address ?? venue?.address ?? null;
  const name = show.title ? `${show.title} — ${BAND_NAME} at ${show.venue}` : `${BAND_NAME} at ${show.venue}`;
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name,
    ...(show.date ? { startDate: show.date } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "MusicVenue",
      name: show.venue,
      ...(venue?.url ? { url: venue.url } : {}),
      ...(address ? { address: { "@type": "PostalAddress", streetAddress: address.split(",")[0], addressLocality: "Austin", addressRegion: "TX", addressCountry: "US" } } : {}),
    },
    performer: [
      artistRef,
      ...show.lineup.filter((n) => n.toLowerCase() !== "so many cults").map((n) => ({ "@type": "MusicGroup", name: n })),
    ],
    organizer: show.presenter ? { "@type": "Organization", name: show.presenter } : artistRef,
    ...(show.poster ? { image: abs(show.poster.fullSize) } : {}),
    ...(show.ticketUrl
      ? { offers: { "@type": "Offer", url: show.ticketUrl, availability: show.date && show.date >= today ? "https://schema.org/InStock" : "https://schema.org/SoldOut" } }
      : {}),
    url: `${SITE_URL}/shows`,
  };
}

export function showsJsonLd(today: string) {
  return allShows.filter((s) => s.date).map((s) => eventJsonLd(s, today));
}

function videoJsonLd(video: Video) {
  const embed = youtubeEmbedUrl(video.url);
  const id = embed?.split("/").pop();
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${video.title} — ${video.kind}`,
    description: video.description ?? `${video.kind} for "${video.title}" by ${BAND_NAME}.`,
    uploadDate: video.date,
    ...(id ? { thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` } : {}),
    ...(embed ? { embedUrl: embed } : {}),
    contentUrl: video.url,
    url: `${SITE_URL}/videos`,
    publisher: artistRef,
  };
}

export function videosJsonLd() {
  return videos.map(videoJsonLd);
}

/** Latest content dates, for sitemap lastModified. */
export function latestDates(today: string) {
  const showDates = allShows.map((s) => s.date).filter((d): d is string => !!d && d <= today);
  const releaseDates = releases.map((r) => r.releaseDate).filter((d): d is string => !!d && d <= today);
  const videoDates = videos.map((v) => v.date).filter((d) => d <= today);
  const max = (arr: string[], fallback: string) => (arr.length ? arr.sort().at(-1)! : fallback);
  const shows = max(showDates, today);
  const music = max(releaseDates, shows);
  const vids = max(videoDates, music);
  return { shows, music, videos: vids, site: [shows, music, vids].sort().at(-1)! };
}

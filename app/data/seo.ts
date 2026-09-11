import type { Metadata } from "next";
import { BAND_NAME, BAND_SUBTITLE, SITE_URL, shortBio, members, logo } from "./band";
import { socialLinks, streamingLinks, profileLinks } from "./links";
import { releases, featuredRelease, releaseTypeLabel, type Release } from "./releases";
import { allShows, type Show } from "./shows";
import { getVenue } from "./venues";
import { videos, youtubeEmbedUrl, type Video } from "./videos";
import { featuredPhoto } from "./photos";
import { BAND_TIME_ZONE, formatLongDate } from "./dates";

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

/**
 * Default share image: a 1200×630 card (app/og.png/route.tsx) built from the featured release artwork,
 * else the featured photo. The query string changes with the featured release so social apps,
 * which cache previews by URL, pick up the new card.
 */
export const defaultShareImage = {
  url: `/og.png?v=${featuredRelease?.artwork ? featuredRelease.id : "photo"}`,
  alt: featuredRelease?.artwork ? `${featuredRelease.title} — ${BAND_NAME}` : `${BAND_NAME} — ${BAND_SUBTITLE}`,
  width: 1200,
  height: 630,
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
  image?: { url: string; alt: string; width?: number; height?: number };
  noindex?: boolean;
}): Metadata {
  const url = abs(path);
  const ogImage = { url: abs(image.url), alt: image.alt, ...(image.width && image.height ? { width: image.width, height: image.height } : {}) };
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
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Meta descriptions, assembled from the data where it helps them stay current.
 * Search engines truncate around 160 characters, so keep each one in the 110–160 range
 * (the full `shortBio` is ~300 and gets cut mid-sentence in results).
 */
export const descriptions = {
  home: `${BAND_NAME} are an Austin, Texas psych punk band. Heavy, hypnotic grooves out of the Red River Cultural District. New music, upcoming shows and photos.`,
  music: (() => {
    const parts = releases
      .filter((r) => r.releaseDate)
      .sort((a, b) => (a.releaseDate ?? "").localeCompare(b.releaseDate ?? ""))
      .map((r) => `${r.title} (${releaseTypeLabel(r).toLowerCase()}, ${formatLongDate(r.releaseDate!)})`);
    return `Music from ${BAND_NAME}, ${BAND_SUBTITLE.toLowerCase()}: ${parts.join(" and ")}. Stream, pre-save, lyrics and liner notes.`;
  })(),
  videos: `Music videos from ${BAND_NAME}${videos[0] ? `, including "${videos[0].title}" (${videos[0].kind.toLowerCase()})` : ""}.`,
  shows: `Upcoming and past shows from ${BAND_NAME} — Austin, TX psych punk — with dates, venues, set times and flyers.`,
  photos: `Press photos and live shots of ${BAND_NAME}, Austin, Texas psych punk, including the band on stage at Chess Club. Photographer credits on every shot.`,
  about: `Formed in Austin in 2024, ${BAND_NAME} blend desert rock, swampy psychedelia and garage-rock urgency into psych punk built for loud rooms. Meet the band.`,
  linkInBio: `Listen to ${BAND_NAME}, catch the next show in Austin and follow along: streaming links, merch, shows and booking, all in one place.`,
};

/* ---------- JSON-LD ---------- */

export const artistId = `${SITE_URL}/#band`;

/** Minimal typed reference to the band, safe to embed on pages that don't carry the full MusicGroup node. */
const artistRef = { "@type": "MusicGroup", "@id": artistId, name: BAND_NAME, url: SITE_URL };

/** Tells Google which name to show for the site in results. Belongs on the homepage only. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BAND_NAME,
    alternateName: "So Many Cults",
    url: SITE_URL,
    publisher: artistRef,
  };
}

export function musicGroupJsonLd() {
  const sameAs = [...socialLinks, ...streamingLinks, ...profileLinks].map((l) => l.url);
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
    // `roleName` is not a Person property; schema.org wants the role wrapped in a Role node.
    member: members.map((m) => ({
      "@type": "PerformanceRole",
      roleName: m.role.split(",").map((r) => r.trim()),
      member: { "@type": "Person", name: m.name },
    })),
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

/** Every clock time in a string, as minutes after midnight: "12:00 PM – 6:00 PM" → [720, 1080]. */
function clockTimes(text: string | null): number[] {
  return [...(text ?? "").matchAll(/(\d{1,2}):(\d{2})\s*([AP]M)/gi)].map(
    ([, h, m, meridiem]) => ((Number(h) % 12) + (meridiem.toUpperCase() === "PM" ? 12 : 0)) * 60 + Number(m),
  );
}

/**
 * ("2026-10-03", 1200) → "2026-10-03T20:00:00-05:00", using Austin's UTC offset on that date so DST is right.
 * Minutes past 1440 roll into the next day (a set that runs past midnight).
 */
function austinDateTime(date: string, minutes: number): string {
  const day = new Date(`${date}T12:00:00Z`);
  day.setUTCDate(day.getUTCDate() + Math.floor(minutes / 1440));
  const offset =
    new Intl.DateTimeFormat("en-US", { timeZone: BAND_TIME_ZONE, timeZoneName: "longOffset" })
      .formatToParts(day)
      .find((p) => p.type === "timeZoneName")
      ?.value.replace("GMT", "") || "+00:00";
  const pad = (n: number) => String(n).padStart(2, "0");
  const time = minutes % 1440;
  return `${day.toISOString().slice(0, 10)}T${pad(Math.floor(time / 60))}:${pad(time % 60)}:00${offset}`;
}

/** Ticket price as a number: "$12 cash, 21+" → 12, "Free, 21+" → 0, "21+" → null. */
function ticketPrice(price: string | null): number | null {
  const dollars = price?.match(/\$(\d+(?:\.\d+)?)/);
  if (dollars) return Number(dollars[1]);
  return price && /\bfree\b/i.test(price) ? 0 : null;
}

function eventJsonLd(show: Show & { date: string }, today: string) {
  const venue = getVenue(show.venue);
  const address = show.address ?? venue?.address ?? null;
  const name = show.title ? `${show.title} — ${BAND_NAME} at ${show.venue}` : `${BAND_NAME} at ${show.venue}`;
  // The event starts when doors open; without doors, a freeform `time` gives the start (and an end, if it's a range).
  const [doors] = clockTimes(show.doors);
  const [timeStart, timeEnd] = clockTimes(show.time);
  const start = doors ?? timeStart;
  const end = start === undefined || timeEnd === undefined ? undefined : timeEnd < start ? timeEnd + 1440 : timeEnd;
  const price = ticketPrice(show.price);
  const isUpcoming = show.date >= today;
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name,
    startDate: start === undefined ? show.date : austinDateTime(show.date, start),
    ...(end !== undefined ? { endDate: austinDateTime(show.date, end) } : {}),
    ...(doors !== undefined ? { doorTime: austinDateTime(show.date, doors) } : {}),
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
    // Only upcoming shows carry an offer: past dates have nothing on sale, and calling them "sold out" would be untrue.
    ...(isUpcoming && (show.ticketUrl || price !== null)
      ? {
          offers: {
            "@type": "Offer",
            ...(show.ticketUrl ? { url: show.ticketUrl } : {}),
            ...(price !== null ? { price, priceCurrency: "USD" } : {}),
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
    url: `${SITE_URL}/shows`,
  };
}

export function showsJsonLd(today: string) {
  return allShows.filter((s): s is Show & { date: string } => !!s.date).map((s) => eventJsonLd(s, today));
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

import { BAND_NAME, BAND_EMAIL, BAND_CITY, SITE_URL } from "./band";
import { socialLinks, streamingLinks } from "./links";

/**
 * Copy for the trust pages (/contact, /privacy). Kept as data so the HTML pages and the
 * Markdown variants (Accept: text/markdown) render the same words.
 * A `link` inside a paragraph is written as [text](url); pages turn it into an anchor.
 */
export type TrustSection = { heading: string; paragraphs: string[] };

/** Date the privacy page was last changed (YYYY-MM-DD). Bump it when the wording changes. */
export const PRIVACY_UPDATED = "2026-09-16";

const MERCH_URL = "https://shop.thegoodfornothings.club/collections/so-many-cults";

const followList = [...socialLinks, ...streamingLinks].map((l) => `[${l.label}](${l.url})`).join(", ");

export const contactIntro = `One inbox, read by the band: [${BAND_EMAIL}](mailto:${BAND_EMAIL}). No management or agency sits in between, so write to us directly.`;

export const contactSections: TrustSection[] = [
  {
    heading: "Booking",
    paragraphs: [
      `${BAND_NAME} are based in ${BAND_CITY} and play the Red River Cultural District and East Austin regularly. We also take dates elsewhere in Texas and beyond.`,
      `To book us, email [${BAND_EMAIL}](mailto:${BAND_EMAIL}) with the venue, the date, the rest of the bill and the deal (guarantee, door split or both). Past bills and flyers are on the [shows page](${SITE_URL}/shows) if you want a sense of the rooms we play.`,
    ],
  },
  {
    heading: "Press and media",
    paragraphs: [
      `Interviews, premieres, reviews and playlist pitches all go to the same address. Tell us your outlet and your deadline.`,
      `Hi-res press photos, with photographer credits, are on the [photos page](${SITE_URL}/photos). A full press kit with a bio, downloadable masters and artwork is available on request.`,
    ],
  },
  {
    heading: "Licensing",
    paragraphs: [
      `Want to use a song in a film, series, game, podcast or ad? Email us the project, the track and how it will be used, and we will get back to you with terms.`,
    ],
  },
  {
    heading: "Follow",
    paragraphs: [`Find us on ${followList}. Merch lives on the [Good For Nothings store](${MERCH_URL}).`],
  },
  {
    heading: "Fans",
    paragraphs: [`Say hi. We read everything, even if we cannot reply to it all.`],
  },
];

export const privacyIntro = `This page explains what ${BAND_NAME} collect when you visit ${SITE_URL}, why, and how to opt out. Short version: no accounts, no forms, no ads, and only anonymous analytics.`;

export const privacySections: TrustSection[] = [
  {
    heading: "What this site does",
    paragraphs: [
      `This is a static band website. You cannot create an account, submit a form or buy anything here. Merch is sold on a separate store at [shop.thegoodfornothings.club](${MERCH_URL}), which has its own privacy policy.`,
    ],
  },
  {
    heading: "Analytics",
    paragraphs: [
      `We use two analytics tools to see which pages, songs and shows people care about.`,
      `[Vercel Web Analytics](https://vercel.com/docs/analytics/privacy-policy) counts page views in aggregate. It sets no cookies and does not track you across sites.`,
      `[PostHog](https://posthog.com/privacy) records page views, when you leave a page, and which tracks you play in the on-site player and how far you get. Events are sent through this site's own domain (the /ingest path) to PostHog's servers in the United States. PostHog stores a random identifier in your browser's cookies and local storage so it can tell one visit from another. We never attach a name, email address or other identity to that identifier.`,
    ],
  },
  {
    heading: "Hosting",
    paragraphs: [
      `The site is hosted on [Vercel](https://vercel.com/legal/privacy-policy). Like any web host, Vercel keeps short-lived server logs (IP address, browser and page requested) to run and secure the service.`,
    ],
  },
  {
    heading: "Embedded content",
    paragraphs: [
      `Videos are embedded from YouTube through its privacy-enhanced domain (youtube-nocookie.com). YouTube may still set cookies once you press play, under [Google's privacy policy](https://policies.google.com/privacy). Links to Spotify, Bandcamp, Apple Music, Instagram and other services take you to those sites, which have their own policies. Fonts are served from this site, not from Google.`,
    ],
  },
  {
    heading: "Email",
    paragraphs: [
      `If you email us at [${BAND_EMAIL}](mailto:${BAND_EMAIL}), we keep your message so we can reply and follow up. We do not add you to a mailing list or share your address with anyone.`,
    ],
  },
  {
    heading: "Your choices",
    paragraphs: [
      `A content blocker or your browser's tracking protection stops the analytics without breaking the site. Clearing your cookies and site data removes the PostHog identifier. To ask what we hold about you or to have it deleted, email us.`,
    ],
  },
  {
    heading: "Changes",
    paragraphs: [
      `We will update this page if the tools we use change. The date at the top of the page shows the last edit.`,
    ],
  },
];

/** Plain text length of a page's copy, for the "real page" check agents run (link syntax stripped). */
export function trustTextLength(intro: string, sections: TrustSection[]): number {
  const text = [intro, ...sections.flatMap((s) => [s.heading, ...s.paragraphs])].join("\n");
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").length;
}

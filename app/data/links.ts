import type { ComponentType } from "react";
import {
  FaInstagram,
  FaBandcamp,
  FaSpotify,
  FaYoutube,
  FaTiktok,
  FaFacebook,
  FaSoundcloud,
  FaAmazon,
} from "react-icons/fa";
import { SiApplemusic, SiTidal, SiYoutubemusic } from "react-icons/si";
import { FiCalendar, FiMail, FiLink, FiMusic, FiCamera, FiInfo } from "react-icons/fi";
import linksData from "@/data/links.json";
import { BAND_EMAIL } from "./band";

export type IconComponent = ComponentType<{ className?: string }>;

export type ExternalLink = {
  platform: string;
  label: string;
  url: string;
};

export type SiteLink = {
  label: string;
  href: string;
  icon: IconComponent;
  isExternal: boolean;
};

/** Maps a JSON `platform` key to an icon. Unknown platforms fall back to a generic link icon. */
export const PLATFORM_ICONS: Record<string, IconComponent> = {
  instagram: FaInstagram,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  facebook: FaFacebook,
  spotify: FaSpotify,
  "apple-music": SiApplemusic,
  bandcamp: FaBandcamp,
  "youtube-music": SiYoutubemusic,
  "amazon-music": FaAmazon,
  tidal: SiTidal,
  soundcloud: FaSoundcloud,
};

export function iconFor(platform: string): IconComponent {
  return PLATFORM_ICONS[platform] ?? FiLink;
}

const onlyFilled = (links: ExternalLink[]) => links.filter((l) => l.url.trim() !== "");

/** Social platforms then streaming platforms, whether or not a URL is set yet. Rendered as two groups. */
export const platformGroups: ExternalLink[][] = [linksData.social, linksData.streaming];
export const allPlatformLinks: ExternalLink[] = platformGroups.flat();

/** Social profiles with a URL set. */
export const socialLinks: ExternalLink[] = onlyFilled(linksData.social);

/** All streaming platforms we list, filled or not (for placeholder-aware rows). */
export const allStreamingLinks: ExternalLink[] = linksData.streaming;

/** Streaming/store profiles with a URL set. */
export const streamingLinks: ExternalLink[] = onlyFilled(linksData.streaming);

export const contactLink: SiteLink = {
  label: "Contact",
  href: `mailto:${BAND_EMAIL}`,
  icon: FiMail,
  isExternal: false,
};

/** Primary site navigation (public pages). */
export const siteNav: SiteLink[] = [
  { label: "Music", href: "/music", icon: FiMusic, isExternal: false },
  { label: "Shows", href: "/shows", icon: FiCalendar, isExternal: false },
  { label: "Photos", href: "/photos", icon: FiCamera, isExternal: false },
  { label: "About", href: "/about", icon: FiInfo, isExternal: false },
];

function toSiteLink(link: ExternalLink): SiteLink {
  return { label: link.label, href: link.url, icon: iconFor(link.platform), isExternal: true };
}

/**
 * Flat list used by link-in-bio and other "link tree" style surfaces:
 * shows, then socials, then streaming, then contact.
 */
export const bandLinks: SiteLink[] = [
  { label: "Shows", href: "/shows", icon: FiCalendar, isExternal: false },
  ...socialLinks.map(toSiteLink),
  ...streamingLinks.map(toSiteLink),
  contactLink,
];

export const instagramUrl =
  socialLinks.find((l) => l.platform === "instagram")?.url ?? "https://instagram.com/somanycults";

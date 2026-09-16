import type { MetadataRoute } from "next";
import { SITE_URL } from "./data/band";
import { latestDates } from "./data/seo";
import { todayISO } from "./data/dates";
import { PRIVACY_UPDATED } from "./data/trust";

// /epk and /link-in-bio are intentionally omitted: share-only links for press and social bios (both noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  const d = latestDates(todayISO());
  const entry = (path: string, lastModified: string, changeFrequency: "weekly" | "monthly" | "yearly", priority: number) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(`${lastModified}T12:00:00Z`),
    changeFrequency,
    priority,
  });
  return [
    entry("", d.site, "weekly", 1),
    entry("/music", d.music, "monthly", 0.9),
    entry("/videos", d.videos, "monthly", 0.8),
    entry("/shows", d.shows, "weekly", 0.8),
    entry("/photos", d.site, "monthly", 0.6),
    entry("/about", d.site, "monthly", 0.6),
    entry("/contact", d.site, "monthly", 0.5),
    entry("/privacy", PRIVACY_UPDATED, "yearly", 0.3),
  ];
}

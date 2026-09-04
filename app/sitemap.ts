import type { MetadataRoute } from "next";
import { SITE_URL } from "./data/band";
import { latestDates } from "./data/seo";
import { todayISO } from "./data/dates";

// /epk is intentionally omitted: it is a share-only link for press (noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  const d = latestDates(todayISO());
  const entry = (path: string, lastModified: string, changeFrequency: "weekly" | "monthly", priority: number) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(`${lastModified}T12:00:00Z`),
    changeFrequency,
    priority,
  });
  return [
    entry("", d.site, "weekly", 1),
    entry("/music", d.music, "monthly", 0.9),
    // entry("/videos", d.videos, "monthly", 0.8), // hidden with the video
    entry("/shows", d.shows, "weekly", 0.8),
    entry("/photos", d.site, "monthly", 0.6),
    entry("/about", d.site, "monthly", 0.6),
    entry("/link-in-bio", d.site, "monthly", 0.3),
  ];
}

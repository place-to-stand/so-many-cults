import type { MetadataRoute } from "next";
import { SITE_URL } from "./data/band";

export default function sitemap(): MetadataRoute.Sitemap {
  // /epk is intentionally omitted: it is a share-only link for press (noindex).
  const routes = ["", "/music", "/shows", "/photos", "/about", "/link-in-bio"];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/shows" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}

import { describe, expect, it } from "vitest";
import nextConfig from "@/next.config";
import { MERCH_URL, siteNav } from "@/app/data/links";

describe("next.config redirects", () => {
  it("sends /merch (with or without a trailing slash) to the store the Merch nav link uses", async () => {
    const redirects = await nextConfig.redirects!();
    const merch = redirects.find((r) => r.source.startsWith("/merch"));
    expect(merch).toBeDefined();
    expect(merch!.destination).toBe(MERCH_URL);
    expect(merch!.destination).toBe(siteNav.find((l) => l.label === "Merch")!.href);
    expect(merch!.destination).toMatch(/^https:\/\//);
    // skipTrailingSlashRedirect is on, so the source must match /merch/ itself.
    expect(merch!.source).toBe("/merch{/}?");
    expect(merch!.permanent).toBe(false);
  });
});

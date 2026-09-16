import { describe, expect, it } from "vitest";
import {
  MARKDOWN_PAGES,
  HTML_ONLY_PAGES,
  markdownFor,
  notFoundMarkdown,
  normalizePath,
  llmsTxt,
  showsMarkdown,
  homeMarkdown,
} from "@/app/data/markdown";
import sitemap from "@/app/sitemap";
import { SITE_URL, BAND_EMAIL } from "@/app/data/band";

const TODAY = "2026-09-16";

describe("normalizePath", () => {
  it("maps trailing slashes and the empty path to canonical paths", () => {
    expect(normalizePath("/")).toBe("/");
    expect(normalizePath("")).toBe("/");
    expect(normalizePath("/about/")).toBe("/about");
    expect(normalizePath("/about//")).toBe("/about");
    expect(normalizePath("/media/fifth-element")).toBe("/media/fifth-element");
  });
});

describe("markdownFor", () => {
  it("renders every indexable page in the sitemap as Markdown with an H1", () => {
    const sitemapPaths = sitemap().map((e) => e.url.replace(SITE_URL, "") || "/");
    expect(sitemapPaths.sort()).toEqual(MARKDOWN_PAGES.map((p) => p.path).sort());
    for (const path of sitemapPaths) {
      const md = markdownFor(path, TODAY);
      expect(md, path).not.toBeNull();
      expect(md!.startsWith("# "), path).toBe(true);
      expect(md!.endsWith("\n"), path).toBe(true);
      expect(md, path).toContain(`${SITE_URL}/llms.txt`);
    }
  });

  it("accepts a trailing slash", () => {
    expect(markdownFor("/about/", TODAY)).toBe(markdownFor("/about", TODAY));
  });

  it("returns null for unknown paths and HTML-only pages", () => {
    expect(markdownFor("/nope", TODAY)).toBeNull();
    for (const path of HTML_ONLY_PAGES) expect(markdownFor(path, TODAY)).toBeNull();
  });

  it("splits shows into upcoming and past by the given date", () => {
    const before = showsMarkdown("2020-01-01");
    const after = showsMarkdown("2099-01-01");
    expect(before).toContain("No past shows listed.");
    expect(after).toContain("No shows announced yet.");
    const section = (md: string, heading: string) => md.split(`## ${heading}`)[1].split("\n## ")[0];
    expect(section(before, "Upcoming shows")).toMatch(/^### /m);
    expect(section(after, "Past shows")).toMatch(/^### /m);
    expect(before).not.toContain("https://somanycults.commailto:");
  });

  it("puts the bio, follow links and upcoming shows on the homepage", () => {
    const md = homeMarkdown(TODAY);
    expect(md).toContain("## Upcoming shows");
    expect(md).toContain("## Latest release");
    expect(md).toContain("https://instagram.com/somanycults");
  });

  it("renders the trust pages with the band email", () => {
    expect(markdownFor("/contact", TODAY)).toContain(`](mailto:${BAND_EMAIL})`);
    expect(markdownFor("/contact", TODAY)).not.toContain(`${SITE_URL}mailto:`);
    expect(markdownFor("/privacy", TODAY)).toContain("PostHog");
    expect(markdownFor("/privacy", TODAY)).toContain("Last updated");
  });
});

describe("notFoundMarkdown", () => {
  it("names the missing path and links the site map, llms.txt and sitemap", () => {
    const md = notFoundMarkdown("/some/missing/page/");
    expect(md.startsWith("# 404")).toBe(true);
    expect(md).toContain("`/some/missing/page`");
    for (const page of MARKDOWN_PAGES) expect(md).toContain(`[${page.title}](${SITE_URL}${page.path})`);
    expect(md).toContain(`${SITE_URL}/llms.txt`);
    expect(md).toContain(`${SITE_URL}/sitemap.xml`);
  });
});

describe("llmsTxt", () => {
  const txt = llmsTxt(TODAY);
  const lines = txt.split("\n");

  it("follows the llms.txt format: H1, blockquote summary, then H2 sections of link lists", () => {
    expect(lines[0]).toMatch(/^# .+/);
    const blockquote = lines.find((l) => l.startsWith("> "));
    expect(blockquote).toBeDefined();
    expect(lines.indexOf(blockquote!)).toBe(2);
    expect(lines.filter((l) => /^#{3,} /.test(l))).toEqual([]);
    const h2s = lines.filter((l) => l.startsWith("## "));
    expect(h2s).toEqual(["## Pages", "## Machine-readable", "## Optional"]);
    // Inside the H2 sections every list item is a `- [name](url): notes` link.
    const firstH2 = lines.indexOf(h2s[0]);
    for (const l of lines.slice(firstH2).filter((l) => l.startsWith("- "))) {
      expect(l).toMatch(/^- \[[^\]]+\]\(https?:\/\/[^)]+\): .+/);
    }
  });

  it("tells agents when to use the site and how to reach the band", () => {
    expect(txt).toContain("When to use this site:");
    expect(txt).toMatch(/play next/);
    expect(txt).toMatch(/book the band/);
    expect(txt).toContain(BAND_EMAIL);
    expect(txt).toContain("Accept: text/markdown");
    expect(txt).toContain("Not the place for:");
  });

  it("links every Markdown page and the machine-readable files", () => {
    for (const page of MARKDOWN_PAGES) expect(txt).toContain(`[${page.title}](${SITE_URL}${page.path})`);
    expect(txt).toContain(`${SITE_URL}/sitemap.xml`);
    expect(txt).toContain(`${SITE_URL}/robots.txt`);
  });
});

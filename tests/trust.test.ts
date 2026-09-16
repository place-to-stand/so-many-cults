import { describe, expect, it } from "vitest";
import { contactIntro, contactSections, privacyIntro, privacySections, trustTextLength, PRIVACY_UPDATED } from "@/app/data/trust";
import { BAND_EMAIL } from "@/app/data/band";

describe("trust pages", () => {
  it("each carry at least 500 characters of real copy", () => {
    expect(trustTextLength(contactIntro, contactSections)).toBeGreaterThanOrEqual(500);
    expect(trustTextLength(privacyIntro, privacySections)).toBeGreaterThanOrEqual(500);
  });

  it("contact tells people how to book, pitch press and license, with the band email", () => {
    const headings = contactSections.map((s) => s.heading);
    expect(headings).toEqual(expect.arrayContaining(["Booking", "Press and media", "Licensing"]));
    expect(contactIntro).toContain(`mailto:${BAND_EMAIL}`);
  });

  it("privacy names every tool the site loads and how to opt out", () => {
    const text = [privacyIntro, ...privacySections.flatMap((s) => s.paragraphs)].join("\n");
    for (const needle of ["Vercel", "PostHog", "/ingest", "youtube-nocookie.com", "content blocker"]) {
      expect(text.toLowerCase()).toContain(needle.toLowerCase());
    }
    expect(PRIVACY_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("only uses well-formed [text](url) links", () => {
    const text = [contactIntro, privacyIntro, ...[...contactSections, ...privacySections].flatMap((s) => s.paragraphs)].join("\n");
    const opens = (text.match(/\[/g) ?? []).length;
    const links = (text.match(/\[[^\]]+\]\((https?:\/\/|mailto:)[^)]+\)/g) ?? []).length;
    expect(links).toBe(opens);
  });
});

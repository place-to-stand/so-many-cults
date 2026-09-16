import { describe, expect, it } from "vitest";
import { musicGroupJsonLd, websiteJsonLd } from "@/app/data/seo";
import { SITE_URL, BAND_EMAIL, members } from "@/app/data/band";

describe("homepage JSON-LD", () => {
  const band = musicGroupJsonLd();

  it("identifies the band as a MusicGroup and Organization with name, description, url and sameAs", () => {
    expect(band["@type"]).toEqual(["MusicGroup", "Organization"]);
    expect(band.name).toBeTruthy();
    expect(band.description.length).toBeGreaterThan(50);
    expect(band.url).toBe(SITE_URL);
    expect(band.sameAs.length).toBeGreaterThan(3);
    for (const url of band.sameAs) expect(url).toMatch(/^https:\/\//);
  });

  it("carries contact details and an address", () => {
    expect(band.email).toBe(BAND_EMAIL);
    expect(band.contactPoint.url).toBe(`${SITE_URL}/about`);
    expect(band.address.addressLocality).toBe("Austin");
  });

  it("gives every member a jobTitle and url", () => {
    expect(band.member).toHaveLength(members.length);
    for (const role of band.member) {
      expect(role.member.jobTitle).toBeTruthy();
      expect(role.member.url).toBe(`${SITE_URL}/about`);
    }
  });

  it("serialises to valid JSON that links the WebSite node", () => {
    const json = JSON.parse(JSON.stringify([band, websiteJsonLd()]));
    expect(json[1].publisher["@id"]).toBe(json[0]["@id"]);
  });
});


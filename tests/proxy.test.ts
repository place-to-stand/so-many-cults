import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import proxy, { config } from "@/proxy";
import { SITE_URL } from "@/app/data/band";

const request = (path: string, accept?: string) =>
  new NextRequest(`${SITE_URL}${path}`, { headers: accept === undefined ? {} : { accept } });

describe("proxy: Markdown content negotiation", () => {
  it("serves Markdown from the same URL when the client asks for it", async () => {
    const res = proxy(request("/about", "text/markdown"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(res.headers.get("vary")).toBe("Accept");
    expect(await res.text()).toMatch(/^# About/);
  });

  it("honours q-values and trailing slashes", async () => {
    const res = proxy(request("/shows/", "text/html;q=0.5, text/markdown"));
    expect(res.status).toBe(200);
    expect(await res.text()).toMatch(/^# Shows/);
  });

  it("returns a Markdown 404 for unknown paths", async () => {
    const res = proxy(request("/does-not-exist", "text/markdown"));
    expect(res.status).toBe(404);
    expect(res.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    const body = await res.text();
    expect(body).toMatch(/^# 404/);
    expect(body).toContain(`${SITE_URL}/llms.txt`);
  });

  it("lets HTML-only pages and browser requests through, adding Vary: Accept", () => {
    for (const [path, accept] of [
      ["/epk", "text/markdown"],
      ["/about", "text/html"],
      ["/about", "*/*"],
      ["/about", undefined],
    ] as const) {
      const res = proxy(request(path, accept));
      expect(res.status, `${path} ${accept}`).toBe(200);
      expect(res.headers.get("content-type"), `${path} ${accept}`).toBeNull();
      expect(res.headers.get("vary"), `${path} ${accept}`).toBe("Accept");
      // NextResponse.next() marks the response as a pass-through.
      expect(res.headers.get("x-middleware-next"), `${path} ${accept}`).toBe("1");
    }
  });

  it("matcher skips assets, Next internals and the analytics proxy", () => {
    const re = new RegExp(`^${config.matcher[0].replace(/\//g, "\\/")}$`);
    for (const skipped of ["/_next/static/x.js", "/ingest/e", "/api/x", "/llms.txt", "/robots.txt", "/sitemap.xml", "/og.png", "/photos/press-2026-01.jpg"]) {
      expect(re.test(skipped), skipped).toBe(false);
    }
    for (const matched of ["/", "/about", "/shows/", "/media/fifth-element", "/nope"]) {
      expect(re.test(matched), matched).toBe(true);
    }
  });
});

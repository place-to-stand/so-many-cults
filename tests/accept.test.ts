import { describe, expect, it } from "vitest";
import { prefersMarkdown } from "@/app/lib/accept";

describe("prefersMarkdown", () => {
  it("serves Markdown when it is the only or best-ranked type", () => {
    expect(prefersMarkdown("text/markdown")).toBe(true);
    expect(prefersMarkdown("text/markdown; charset=utf-8")).toBe(true);
    expect(prefersMarkdown("text/markdown, */*;q=0.8")).toBe(true);
    expect(prefersMarkdown("text/markdown, text/html;q=0.9")).toBe(true);
    expect(prefersMarkdown("text/html;q=0.5, text/markdown;q=0.9")).toBe(true);
    expect(prefersMarkdown("TEXT/MARKDOWN")).toBe(true);
  });

  it("prefers an explicit Markdown range over a wildcard tie", () => {
    expect(prefersMarkdown("text/markdown, */*")).toBe(true);
    expect(prefersMarkdown("text/markdown, text/*")).toBe(true);
  });

  it("keeps HTML for browsers, plain wildcards and missing headers", () => {
    expect(prefersMarkdown(null)).toBe(false);
    expect(prefersMarkdown(undefined)).toBe(false);
    expect(prefersMarkdown("")).toBe(false);
    expect(prefersMarkdown("*/*")).toBe(false);
    expect(prefersMarkdown("text/*")).toBe(false);
    expect(prefersMarkdown("text/html")).toBe(false);
    expect(prefersMarkdown("text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8")).toBe(false);
    expect(prefersMarkdown("text/html, text/markdown")).toBe(false);
    expect(prefersMarkdown("application/json")).toBe(false);
  });

  it("treats q=0 as not acceptable and tolerates junk", () => {
    expect(prefersMarkdown("text/markdown;q=0")).toBe(false);
    expect(prefersMarkdown("text/markdown;q=abc, text/html")).toBe(false);
    expect(prefersMarkdown("garbage, ,;;")).toBe(false);
  });
});

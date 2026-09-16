import { NextResponse, type NextRequest } from "next/server";
import { prefersMarkdown } from "./app/lib/accept";
import { HTML_ONLY_PAGES, markdownFor, normalizePath, notFoundMarkdown } from "./app/data/markdown";
import { todayISO } from "./app/data/dates";

/**
 * Markdown content negotiation (acceptmarkdown.com).
 *
 * A request that ranks `text/markdown` above `text/html` gets the page as Markdown from the same URL,
 * with `Content-Type: text/markdown; charset=utf-8`. Every negotiated response, HTML included, carries
 * `Vary: Accept` so a shared cache never hands the HTML variant to a Markdown client or vice versa.
 * Unknown paths get a Markdown 404 that points back at the site map.
 */

/** Skip Next internals, the PostHog proxy and anything with a file extension (images, robots.txt, llms.txt…). */
export const config = {
  matcher: ["/((?!_next/|ingest/|api/|.*\\.[^/]+$).*)"],
};

const MARKDOWN_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  // Shows roll from upcoming to past once an hour, matching the HTML pages' revalidate window.
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
};

export function markdownResponse(body: string, status = 200): NextResponse {
  return new NextResponse(body, { status, headers: MARKDOWN_HEADERS });
}

export default function proxy(request: NextRequest): NextResponse {
  const path = normalizePath(request.nextUrl.pathname);
  const wantsMarkdown = prefersMarkdown(request.headers.get("accept"));

  if (wantsMarkdown && !(HTML_ONLY_PAGES as readonly string[]).includes(path)) {
    const body = markdownFor(path, todayISO());
    return body ? markdownResponse(body) : markdownResponse(notFoundMarkdown(path), 404);
  }

  const response = NextResponse.next();
  response.headers.set("Vary", "Accept");
  return response;
}

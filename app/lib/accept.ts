/**
 * Content negotiation for Markdown (acceptmarkdown.com).
 *
 * Returns true when the request's Accept header ranks text/markdown above text/html.
 * Ties go to HTML unless Markdown was named explicitly and HTML only matched a wildcard,
 * so `Accept: text/markdown` and `Accept: text/markdown, *\/*` both get Markdown while a
 * browser's `text/html, ... *\/*;q=0.8` and a bare `*\/*` keep getting HTML.
 */
export function prefersMarkdown(accept: string | null | undefined): boolean {
  if (!accept) return false;
  const markdown = match(accept, "text/markdown");
  const html = match(accept, "text/html");
  if (markdown.q <= 0) return false;
  if (markdown.q !== html.q) return markdown.q > html.q;
  return markdown.specificity > html.specificity;
}

/** Best (most specific) media range in `accept` that covers `type`, with its q-value. */
function match(accept: string, type: string): { q: number; specificity: number } {
  const [wantType, wantSubtype] = type.split("/");
  let best = { q: 0, specificity: -1 };
  for (const raw of accept.split(",")) {
    const [range, ...params] = raw.trim().split(";");
    const [rangeType, rangeSubtype] = range.trim().toLowerCase().split("/");
    if (!rangeType || !rangeSubtype) continue;
    let specificity: number;
    if (rangeType === wantType && rangeSubtype === wantSubtype) specificity = 2;
    else if (rangeType === wantType && rangeSubtype === "*") specificity = 1;
    else if (rangeType === "*" && rangeSubtype === "*") specificity = 0;
    else continue;
    let q = 1;
    for (const p of params) {
      const [k, v] = p.trim().split("=");
      if (k?.trim().toLowerCase() === "q") {
        const n = Number(v);
        q = Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
      }
    }
    if (specificity > best.specificity) best = { q, specificity };
  }
  return best;
}

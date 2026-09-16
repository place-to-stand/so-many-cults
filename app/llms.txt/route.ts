import { llmsTxt } from "../data/markdown";

// Re-generate hourly so "next show" and the latest release stay current without a redeploy.
export const revalidate = 3600;

export function GET() {
  return new Response(llmsTxt(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

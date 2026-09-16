import type { Metadata } from "next";
import Link from "next/link";
import { BAND_NAME } from "./data/band";
import { MARKDOWN_PAGES } from "./data/markdown";
import { SiteFooter } from "./components/SiteFooter";

export const metadata: Metadata = {
  title: `Not Found — ${BAND_NAME}`,
  robots: { index: false, follow: true },
};

/** Label column + content, mirrors the show card's InfoRow. */
function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[116px_minmax(0,1fr)] gap-x-6 items-start">
      <div className="text-[11px] leading-[22px] uppercase tracking-[0.18em] text-[#666]">{label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/**
 * Global 404. Next serves it with a real HTTP 404 status. It lists where to go next so a person or an
 * agent that guessed a URL can recover; the Markdown variant (Accept: text/markdown) lives in proxy.ts.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col font-(family-name:--font-geist-sans)">
      <header className="font-mono px-6 sm:px-10 py-5">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="text-lg font-bold tracking-tight hover:no-underline">
            {BAND_NAME}
          </Link>
        </div>
      </header>
      <div className="flex-1 px-6 sm:px-10 pt-8 sm:pt-12">
        <main className="mx-auto max-w-5xl font-mono">
          <div className="flex items-center gap-3 text-[13px] uppercase tracking-[0.18em] text-[#9a9a9a]">
            <span className="text-[#f2f2f2]">Error</span>
            <span>404</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-[#f2f2f2]">Page not found</h1>

          {/* Liner-note rows, same anatomy as the show card's info block */}
          <div className="mt-6 max-w-2xl border-t border-[#262626] pt-6 space-y-5">
            <InfoRow label="Status">
              <p className="text-sm leading-[22px] text-[#999]">Nothing lives at this address. It moved, or the link had a typo.</p>
            </InfoRow>
            <InfoRow label="Go to">
              <nav aria-label="Site map" className="grid grid-cols-2 gap-x-10 gap-y-1.5 text-sm leading-[22px] text-[#f2f2f2]">
                {MARKDOWN_PAGES.map((page) => (
                  <Link key={page.path} href={page.path} className="justify-self-start hover:text-white">
                    {page.title}
                  </Link>
                ))}
              </nav>
            </InfoRow>
            <InfoRow label="Robots">
              <p className="text-sm leading-[22px] text-[#999]">
                <a href="/llms.txt" className="hover:text-white">
                  llms.txt
                </a>{" "}
                ·{" "}
                <a href="/sitemap.xml" className="hover:text-white">
                  sitemap.xml
                </a>
              </p>
            </InfoRow>
          </div>

          <div className="mt-6 max-w-2xl border-t border-[#262626] pt-5">
            <Link
              href="/"
              className="inline-block text-xs uppercase tracking-[0.15em] px-[18px] py-2 bg-white font-bold text-black hover:bg-[#ddd] hover:no-underline transition-colors"
            >
              Back to home
            </Link>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { BAND_NAME } from "./data/band";
import { MARKDOWN_PAGES } from "./data/markdown";
import { SiteFooter } from "./components/SiteFooter";

export const metadata: Metadata = {
  title: `Not Found — ${BAND_NAME}`,
  robots: { index: false, follow: true },
};

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
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#666]">Error 404</p>
          <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
          <p className="mt-4 text-sm text-[#888] max-w-md leading-relaxed">
            There is no page at this address. It may have moved, or the link had a typo.
          </p>
          <section className="mt-12 sm:mt-16" aria-labelledby="site-map">
            <h2 id="site-map" className="text-[11px] uppercase tracking-[0.18em] text-[#666]">
              Site map
            </h2>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-wider">
              {MARKDOWN_PAGES.map((page) => (
                <li key={page.path}>
                  <Link href={page.path} className="text-[#888] hover:text-[#ccc] hover:no-underline">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs text-[#666]">
              Machine-readable:{" "}
              <a href="/llms.txt" className="text-[#888] hover:text-[#ccc]">
                llms.txt
              </a>{" "}
              ·{" "}
              <a href="/sitemap.xml" className="text-[#888] hover:text-[#ccc]">
                sitemap.xml
              </a>
            </p>
          </section>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}

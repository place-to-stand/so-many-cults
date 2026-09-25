import type { Metadata } from "next";
import Link from "next/link";
import { BAND_NAME, BAND_EMAIL } from "../../data/band";
import { bandsintownUrl, iconFor } from "../../data/links";
import { getUpcomingShows, getPastShows } from "../../data/shows";
import { ShowList } from "../../components/ShowList";
import { SectionHeading } from "../../components/SectionHeading";
import { Disclosure } from "../../components/Disclosure";
import { pageMetadata, descriptions, showsJsonLd } from "../../data/seo";
import { JsonLd } from "../../components/JsonLd";
import { HashGlide } from "../../components/HashGlide";
import { todayISO } from "../../data/dates";

export const metadata: Metadata = pageMetadata({ title: `Shows — ${BAND_NAME}`, description: descriptions.shows, path: "/shows" });

export const revalidate = 3600;

const BandsintownIcon = iconFor("bandsintown");

export default function ShowsPage() {
  const upcoming = getUpcomingShows();
  const past = getPastShows();

  return (
    <div className="px-6 sm:px-10 pt-8 sm:pt-12">
      <main className="mx-auto max-w-5xl font-mono">
        <JsonLd data={showsJsonLd(todayISO())} />
        <HashGlide />
        <h1 className="text-3xl font-bold">Shows</h1>

        <section className="mt-12 sm:mt-16">
          <SectionHeading size="lg">Upcoming Shows</SectionHeading>
          <ShowList shows={upcoming} />
        </section>

        <section className="mt-16">
          <Disclosure
            summary={<h2 className="text-[22px] font-medium text-[#888] tracking-tight">Past Shows</h2>}
            summaryClassName="gap-3 hover:text-white [&_h2]:transition-colors [&:hover_h2]:text-white"
            arrowClassName="size-4 text-[#888]"
            contentClassName="pt-7"
            openForHashes={past.map((s) => s.id)}
          >
            <ShowList shows={past} emptyMessage="No past shows listed." />
          </Disclosure>
        </section>

        {/* Baseline-aligned row so every piece of text shares one baseline (centring the boxes left the icon
            link's text 2px high); the icon is inline and nudged to sit centred on the text. Below sm the two
            stack without the separator, which would otherwise dangle at the end of the first line. */}
        <p className="mt-16 flex flex-col gap-y-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3 text-sm text-[#888]">
          {bandsintownUrl && (
            <>
              <Link
                href={bandsintownUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ccc] hover:text-white"
              >
                <BandsintownIcon className="inline-block align-[-0.125em] mr-1.5" />
                Bandsintown
              </Link>
              <span aria-hidden className="hidden sm:inline text-[#444]">·</span>
            </>
          )}
          <span>
            Booking:{" "}
            <a href={`mailto:${BAND_EMAIL}`} className="text-[#ccc] hover:text-white">
              {BAND_EMAIL}
            </a>
          </span>
        </p>
      </main>
    </div>
  );
}

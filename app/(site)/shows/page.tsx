import type { Metadata } from "next";
import { BAND_NAME, BAND_EMAIL } from "../../data/band";
import { getUpcomingShows, getPastShows } from "../../data/shows";
import { ShowList } from "../../components/ShowList";
import { SectionHeading } from "../../components/SectionHeading";
import { Disclosure } from "../../components/Disclosure";
import { pageMetadata, descriptions, showsJsonLd } from "../../data/seo";
import { JsonLd } from "../../components/JsonLd";
import { todayISO } from "../../data/dates";

export const metadata: Metadata = pageMetadata({ title: `Shows — ${BAND_NAME}`, description: descriptions.shows, path: "/shows" });

export const revalidate = 3600;

export default function ShowsPage() {
  const upcoming = getUpcomingShows();
  const past = getPastShows();

  return (
    <div className="px-6 sm:px-10 pt-8 sm:pt-12">
      <main className="mx-auto max-w-5xl font-mono">
        <JsonLd data={showsJsonLd(todayISO())} />
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
          >
            <ShowList shows={past} emptyMessage="No past shows listed." />
          </Disclosure>
        </section>

        <p className="mt-16 text-sm text-[#888]">
          Booking:{" "}
          <a href={`mailto:${BAND_EMAIL}`} className="text-[#ccc] hover:text-white">
            {BAND_EMAIL}
          </a>
        </p>
      </main>
    </div>
  );
}

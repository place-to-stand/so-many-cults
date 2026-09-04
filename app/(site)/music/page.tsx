import type { Metadata } from "next";
import { BAND_NAME } from "../../data/band";
import { allStreamingLinks } from "../../data/links";
import { releases } from "../../data/releases";
import { ReleaseCard } from "../../components/ReleaseCard";
import { LinkButtons } from "../../components/LinkButtons";
import { SectionHeading } from "../../components/SectionHeading";
import { pageMetadata, descriptions, musicJsonLd } from "../../data/seo";
import { JsonLd } from "../../components/JsonLd";

export const metadata: Metadata = pageMetadata({ title: `Music — ${BAND_NAME}`, description: descriptions.music, path: "/music" });

export default function MusicPage() {
  // Newest release first by date; undated releases sink to the bottom.
  const ordered = [...releases].sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? ""));

  return (
    <div className="px-6 sm:px-10 pt-8 sm:pt-12 pb-8">
      <main className="mx-auto max-w-5xl font-mono">
        <JsonLd data={musicJsonLd()} />
        <h1 className="text-3xl font-bold">Music</h1>

        <section className="mt-12 sm:mt-16 space-y-20 sm:space-y-24">
          {ordered.map((release) => (
            <ReleaseCard key={release.id} release={release} />
          ))}
        </section>

        <section className="mt-28 bg-[#141414] border border-[#262626] px-6 py-10 sm:px-10 sm:py-12 flex flex-col items-center text-center">
          <SectionHeading className="mb-6">Follow on streaming</SectionHeading>
          <LinkButtons links={allStreamingLinks} className="justify-center" />
        </section>
      </main>
    </div>
  );
}

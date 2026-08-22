import Link from "next/link";
import type { Video } from "../data/videos";
import { formatLongDate } from "../data/dates";
import { VideoEmbed } from "./VideoEmbed";
import { CreditsAccordion } from "./CreditsAccordion";
import { getCredits } from "../data/credits";

/** Embedded video first; metadata and the YouTube link share one row beneath it. */
export function VideoCard({
  video,
  headingLevel = "h3",
  creditsOpen = false,
}: {
  video: Video;
  headingLevel?: "h2" | "h3";
  /** Start with credits expanded (EPK). */
  creditsOpen?: boolean;
}) {
  const Heading = headingLevel;
  const credits = getCredits(video.creditsId);
  return (
    <article className="font-mono">
      <VideoEmbed url={video.url} title={`${video.title} — ${video.kind}`} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#9a9a9a]">
          <span className="text-[#f2f2f2]">{video.kind}</span>
          <span aria-hidden className="h-px w-5 bg-[#333]" />
          <span>{formatLongDate(video.date)}</span>
        </div>
        <Link
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-[0.15em] text-[#8a8a8a] hover:text-white whitespace-nowrap"
        >
          Watch on YouTube →
        </Link>
      </div>

      <Heading className="mt-2 text-lg sm:text-xl font-bold leading-snug text-[#f2f2f2]">{video.title}</Heading>
      {video.description && <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-[#777]">{video.description}</p>}
      {credits.length > 0 && (
        <div className="mt-5 border-t border-[#262626] pt-4">
          <CreditsAccordion sections={credits} defaultOpen={creditsOpen} noun="credits" />
        </div>
      )}
    </article>
  );
}

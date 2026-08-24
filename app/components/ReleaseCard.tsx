import Image from "next/image";
import type { Release } from "../data/releases";
import { getReleaseLinks, hasVideo, releaseTypeLabel, PLACEHOLDER_PLATFORMS, artworkAsPhoto } from "../data/releases";
import { LightboxImage } from "./LightboxImage";
import { CreditsAccordion } from "./CreditsAccordion";
import { Lyrics } from "./Lyrics";
import { getCredits } from "../data/credits";
import { WaveformPlayer } from "./WaveformPlayer";
import { PlaylistPlayer } from "./PlaylistPlayer";
import { formatLongDate, formatDateParts } from "../data/dates";
import { logo } from "../data/band";
import { LinkButtons } from "./LinkButtons";
import { VideoEmbed } from "./VideoEmbed";
import { FiDownload } from "react-icons/fi";

function Artwork({ release }: { release: Release }) {
  const photo = artworkAsPhoto(release);
  if (photo) {
    return (
      <LightboxImage
        photos={[photo]}
        index={0}
        alt={`${release.title} artwork`}
        sizes="(max-width: 1024px) 100vw, 444px"
        imageClassName="border border-[#222]"
        showDownload={Boolean(release.artworkHiRes)}
        showCredit={false}
      />
    );
  }
  return (
    <div className="aspect-square w-full border border-[#222] bg-[#111] flex items-center justify-center p-8">
      <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="w-full h-auto invert opacity-80" />
    </div>
  );
}

export function releaseKicker(release: Release): string {
  const kind = releaseTypeLabel(release);
  if (release.status === "released") return `New ${kind}`;
  return release.releaseDate ? `${kind} · Out ${formatLongDate(release.releaseDate)}` : `${kind} · Coming Soon`;
}

/** "09.04.2026" — compact numeric date used in the release meta line. */
function numericDate(iso: string): string {
  const d = formatDateParts(iso);
  const m = String(new Date(`${iso}T12:00:00Z`).getUTCMonth() + 1).padStart(2, "0");
  return `${m}.${d.day.padStart(2, "0")}.${d.year}`;
}

/** Quiet hairline row: tiny label on the left, content on the right. */
function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 sm:gap-6 items-start border-t border-[#262626] py-4">
      <div className="text-[11px] leading-[26px] uppercase tracking-[0.18em] text-[#8a8a8a]">{label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/**
 * Release block composed like a liner-note spread: artwork + oversized title carry the weight,
 * the waveform sits bare between hairlines, and pre-save / credits follow as quiet meta rows.
 */
export function ReleaseCard({
  release,
  showVideo = true,
  showDownloads = false,
  creditsOpen = false,
  headingLevel = "h2",
}: {
  release: Release;
  showVideo?: boolean;
  /** EPK: offer the hi-res artwork as a download. */
  showDownloads?: boolean;
  /** Start with the credits accordion expanded (EPK). */
  creditsOpen?: boolean;
  headingLevel?: "h1" | "h2";
}) {
  const links = getReleaseLinks(release);
  const released = release.status === "released";
  // The release date always lives in the liner notes; the headline only carries it before release.
  const credits = (() => {
    const base = getCredits(release.creditsId);
    if (!release.releaseDate) return base;
    const entry = { label: released ? "Released on" : "Release date", value: formatLongDate(release.releaseDate), url: "" };
    const idx = base.findIndex((s) => s.title.toLowerCase() === "release");
    if (idx === -1) return [...base, { title: "Release", entries: [entry] }];
    return base.map((s, i) => (i === idx ? { ...s, entries: [entry, ...s.entries] } : s));
  })();
  const playable = release.tracklist.filter((t) => t.audio.trim() !== "");
  const analytics = { release: release.title, player: playable.length > 1 ? "ep-playlist" : "single" };
  const Heading = headingLevel;
  const linksLabel = release.status === "released" ? "Listen" : "Pre-save";
  const kind = releaseTypeLabel(release);

  return (
    <article className="font-mono">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,444px)_1fr] gap-8 lg:gap-12 items-start">
        <Artwork release={release} />

        <div className="min-w-0 lg:pt-2">
          {/* Meta line: type · date — small, wide-tracked, deliberately quiet */}
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#9a9a9a]">
            <span>{kind}</span>
            {!released && (
              <>
                <span aria-hidden className="h-px w-6 bg-[#333]" />
                <span>{release.releaseDate ? `Out ${numericDate(release.releaseDate)}` : "Coming soon"}</span>
              </>
            )}
          </div>

          {/* Title: the one loud thing */}
          <Heading className="mt-3 text-3xl sm:text-[40px] font-bold tracking-tight leading-[1] text-[#f2f2f2]">
            {release.title}
          </Heading>

          {release.description && (
            <p className="mt-5 max-w-prose text-sm leading-relaxed text-[#999]">{release.description}</p>
          )}

          {/* Player: bare waveform between hairlines — no box competing with the title */}
          {playable.length > 1 ? (
            <div className="mt-8 border-t border-[#1e1e1e] pt-5">
              <PlaylistPlayer
                tracks={playable.map((t) => ({ title: t.title, file: t.audio }))}
                analytics={analytics}
                variant="bare"
                showTitle={false}
                height={56}
                waveColor="rgba(255,255,255,0.18)"
                progressColor="rgba(255,255,255,0.85)"
              />
            </div>
          ) : release.audio ? (
            <div className="mt-8 border-t border-[#1e1e1e] pt-5">
              <WaveformPlayer
                audioUrl={release.audio}
                title={release.title}
                showTitle={false}
                analytics={analytics}
                variant="bare"
                height={56}
                waveColor="rgba(255,255,255,0.18)"
                progressColor="rgba(255,255,255,0.85)"
              />
            </div>
          ) : null}

          {showDownloads && release.artworkHiRes && (
            <div className="mt-5 text-xs text-[#777]">
              <a href={release.artworkHiRes} download className="inline-flex items-center gap-1.5 text-[#bbb] hover:text-white transition-colors">
                <FiDownload className="shrink-0" /> Hi-res artwork
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Meta rows: evenly rhythmed hairlines, spanning both columns so platforms stay on one line */}
      <div className="mt-5">
        <MetaRow label={linksLabel}>
          {links.length > 0 ? <LinkButtons links={links} /> : <LinkButtons links={PLACEHOLDER_PLATFORMS} placeholder />}
        </MetaRow>
        {release.tracklist.some((t) => t.lyrics.trim()) && (
          <MetaRow label="Lyrics">
            <Lyrics tracks={release.tracklist} defaultOpen={creditsOpen} />
          </MetaRow>
        )}
        {showVideo && hasVideo(release) && (
          <MetaRow label={release.video.title}>
            {release.video.director && <div className="text-xs text-[#666] mb-3">Dir. {release.video.director}</div>}
            <VideoEmbed url={release.video.url} title={`${release.title} — ${release.video.title}`} />
          </MetaRow>
        )}
        {credits.length > 0 && (
          <MetaRow label="Credits">
            <CreditsAccordion sections={credits} defaultOpen={creditsOpen} bare />
          </MetaRow>
        )}
        <div className="border-t border-[#262626]" />
      </div>
    </article>
  );
}

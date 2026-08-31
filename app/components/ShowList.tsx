import { Fragment } from "react";
import Link from "next/link";
import type { Show } from "../data/shows";
import { formatDateParts } from "../data/dates";
import { getVenueUrl } from "../data/venues";
import { LightboxImage } from "./LightboxImage";
import type { Photo } from "../data/photos";

/** A show flyer as a lightbox-able photo (no photographer credit; caption = title · date). */
function posterAsPhoto(show: Show): Photo {
  return {
    id: `poster-${show.id}`,
    thumbnail: show.poster!.thumbnail,
    fullSize: show.poster!.fullSize,
    photographer: "",
    photographerLink: "",
    date: show.date ?? "",
    venue: show.title ? `${show.title} · ${show.venue}` : show.venue,
  };
}

function VenueName({ name, className = "text-[#bbb] hover:text-white" }: { name: string; className?: string }) {
  const url = getVenueUrl(name);
  if (!url) return <>{name}</>;
  return (
    <Link href={url} target="_blank" rel="noopener noreferrer" className={className}>
      {name}
    </Link>
  );
}

/** "SAT · OCT 3 · 2026" — one readable line, mirrors the release card eyebrow. */
function DateLine({ date, className = "" }: { date: string | null; className?: string }) {
  const base = `flex items-center gap-3 text-[13px] uppercase tracking-[0.18em] text-[#9a9a9a] ${className}`;
  if (!date) {
    return (
      <div className={base}>
        <span>Date TBA</span>
      </div>
    );
  }
  const { month, day, year, weekday } = formatDateParts(date);
  return (
    <div className={base}>
      <span className="text-[#f2f2f2]">
        {weekday} {month} {day}
      </span>
      <span>{year}</span>
    </div>
  );
}

function Poster({ show }: { show: Show }) {
  if (!show.poster) {
    return (
      <div
        aria-label="Flyer coming soon"
        className="aspect-[4/5] w-full border border-dashed border-[#2e2e2e] flex items-center justify-center"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#444]">Flyer soon</span>
      </div>
    );
  }
  return (
    <LightboxImage
      photos={[posterAsPhoto(show)]}
      index={0}
      alt={`Flyer: ${show.title ?? show.venue}`}
      sizes="(max-width: 640px) 100vw, 384px"
      imageClassName="border border-[#262626]"
      showCredit={false}
      showDownload
    />
  );
}


/** Label column + content, liner-notes style (matches the release card's meta labels). */
function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-6 items-start">
      <div className="text-[11px] leading-[22px] uppercase tracking-[0.18em] text-[#666]">{label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function ShowCard({ show, compact = false }: { show: Show; compact?: boolean }) {
  // Lineup rows in set-time order when set times exist; bands with no set listed after.
  const timed = show.setTimes.map((st) => ({ band: st.band, time: st.time }));
  // A set-time entry may carry a suffix ("So Many Cults (Cavalier Stage)") — match by prefix.
  const hasSet = (band: string) =>
    show.setTimes.some((st) => {
      const a = st.band.toLowerCase();
      const b = band.toLowerCase();
      return a.startsWith(b) || b.startsWith(a);
    });
  const untimed = show.lineup.filter((b) => !hasSet(b)).map((b) => ({ band: b, time: null as string | null }));
  // Show times only when the whole bill has them; a partial schedule reads as a mistake.
  const fullSchedule = show.setTimes.length > 0 && untimed.length === 0;
  const lineupRows = fullSchedule ? timed : show.lineup.map((b) => ({ band: b, time: null as string | null }));
  const isUs = (band: string) => band.toLowerCase().startsWith("so many cults");

  if (compact) {
    return (
      <li className="py-[18px] first:pt-0 border-b border-[#222] last:border-b-0">
        <div className="min-w-0">
          <DateLine date={show.date} className="mb-2.5" />
          <div className="text-[15px] text-[#ededed] leading-snug">{show.title ?? <VenueName name={show.venue} />}</div>
          {show.title && (
            <div className="text-[15px] text-[#888] mt-0.5">
              <VenueName name={show.venue} />
            </div>
          )}
        </div>
      </li>
    );
  }

  return (
    <li className="py-12 first:pt-0 last:pb-0">
      <div className="flex gap-7 md:gap-10">
        {/* Poster column (desktop) */}
        <div className="hidden sm:block w-60 md:w-80 lg:w-96 shrink-0">
          <Poster show={show} />
        </div>

        <div className="min-w-0 flex-1">
          <DateLine date={show.date} className="mb-4" />
          <h3 className="text-xl sm:text-2xl font-bold leading-snug text-[#f2f2f2]">
            {show.title ?? <VenueName name={show.venue} className="text-[#f2f2f2] hover:text-white" />}
          </h3>
          {show.title && (
            <div className="mt-2.5 text-[15px] text-[#9a9a9a]">
              <VenueName name={show.venue} />
              {show.festival && <span className="text-[#666]"> · {show.festival}</span>}
            </div>
          )}
          {show.address && (
            <div className="mt-1 text-xs">
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${show.venue}, ${show.address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#666] hover:text-[#bbb] hover:no-underline"
              >
                {show.address} ↗
              </Link>
            </div>
          )}

          {/* Liner-note info block: labeled rows, breathing room instead of hairlines */}
          <div className="mt-6 border-t border-[#262626] pt-6 space-y-5">
            {(show.doors || show.time) && (
              <InfoRow label={show.doors ? "Doors" : "Time"}>
                <div className="text-sm leading-[22px] text-[#999]">{show.doors ?? show.time}</div>
              </InfoRow>
            )}
            {lineupRows.length > 0 && (
              <InfoRow label="With">
                <div className="grid grid-cols-[max-content_max-content] gap-x-8 sm:gap-x-10 gap-y-1.5 text-sm leading-[22px]">
                  {lineupRows.map(({ band, time }) => (
                    <Fragment key={band}>
                      <span className={isUs(band) ? "font-bold text-[#f2f2f2]" : "text-[#999]"}>{band}</span>
                      <span className={`text-[11px] leading-[22px] whitespace-nowrap tabular-nums text-[#555]`}>
                        {time ?? ""}
                      </span>
                    </Fragment>
                  ))}
                </div>
              </InfoRow>
            )}
            {show.price && !show.ticketUrl && (
              <InfoRow label="Price">
                <div className="text-sm leading-[22px] text-[#999]">{show.price}</div>
              </InfoRow>
            )}
            {show.visuals && (
              <InfoRow label="Visuals">
                <div className="text-sm leading-[22px]">
                  <Link href={show.visuals.url} target="_blank" rel="noopener noreferrer" className="text-[#9a9a9a] hover:text-white">
                    {show.visuals.name}
                  </Link>
                </div>
              </InfoRow>
            )}
            {show.presenter && (
              <InfoRow label="Presenter">
                <div className="text-sm leading-[22px] text-[#999]">{show.presenter}</div>
              </InfoRow>
            )}
          </div>

          {show.ticketUrl && (
            <div className="mt-6 border-t border-[#262626] pt-5 flex items-center gap-4">
              <Link
                href={show.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs uppercase tracking-[0.15em] px-[18px] py-2 bg-white font-bold text-black hover:bg-[#ddd] hover:no-underline transition-colors"
              >
                Tickets
              </Link>
              {show.price && <span className="text-sm text-[#ccc]">{show.price}</span>}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export function ShowList({
  shows,
  compact = false,
  emptyMessage = "No shows announced yet. Check back soon.",
}: {
  shows: Show[];
  compact?: boolean;
  emptyMessage?: string;
}) {
  if (shows.length === 0) {
    return <p className="text-sm text-[#666]">{emptyMessage}</p>;
  }
  return (
    <ul className="font-mono">
      {shows.map((show) => (
        <ShowCard key={show.id} show={show} compact={compact} />
      ))}
    </ul>
  );
}

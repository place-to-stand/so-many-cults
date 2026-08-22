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
      <span aria-hidden className="h-px w-5 bg-[#333]" />
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

export function ShowCard({ show, compact = false }: { show: Show; compact?: boolean }) {
  // Full bill in listed order.
  const others = show.lineup;
  const doorsLine = [show.doors ? `Doors ${show.doors}` : show.time, show.price].filter(Boolean).join(" · ");

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
    <li className="py-9 first:pt-0 border-b border-[#222] last:border-b-0">
      <div className="flex gap-7 md:gap-9">
        {/* Poster column (desktop) */}
        <div className="hidden sm:block w-60 md:w-80 lg:w-96 shrink-0">
          <Poster show={show} />
        </div>

        <div className="min-w-0 flex-1">
          <DateLine date={show.date} className="mb-3.5" />
          <h3 className="text-lg sm:text-xl font-bold leading-snug text-[#f2f2f2]">
            {show.title ?? <VenueName name={show.venue} className="text-[#f2f2f2] hover:text-white" />}
          </h3>
          {show.title && (
            <div className="mt-0.5 text-[15px] text-[#9a9a9a]">
              <VenueName name={show.venue} />
              {show.festival && <span className="text-[#666]"> · {show.festival}</span>}
            </div>
          )}

          {others.length > 0 && (
            <p className="mt-[18px] text-[15px] leading-relaxed text-[#777]">
              <span className="text-[#555]">with </span>
              {others.join(", ")}
            </p>
          )}

          {(doorsLine || show.setTimes.length > 0 || show.presenter) && (
            <div className="mt-[18px] space-y-3.5 text-xs uppercase tracking-[0.08em] text-[#666]">
              {doorsLine && <div className="text-[#8a8a8a]">{doorsLine}</div>}
              {show.setTimes.length > 0 && (
                <ul className="space-y-0.5">
                  {show.setTimes.map((st) => (
                    <li key={`${st.time}-${st.band}`} className="flex gap-3">
                      <span className="w-[5.5rem] shrink-0 whitespace-nowrap tabular-nums text-[#8a8a8a]">{st.time}</span>
                      <span className={st.band.toLowerCase().startsWith("so many cults") ? "text-[#ddd]" : ""}>{st.band}</span>
                    </li>
                  ))}
                </ul>
              )}
              {show.presenter && <div>Presented by {show.presenter}</div>}
            </div>
          )}

          {show.ticketUrl && (
            <Link
              href={show.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-[22px] text-xs uppercase tracking-[0.15em] px-3 py-1.5 border border-[#444] text-white hover:bg-white hover:text-black hover:no-underline transition-colors"
            >
              Tickets
            </Link>
          )}

          {/* Poster (mobile): below the info, full width */}
          <div className="sm:hidden mt-[22px] max-w-xs">
            <Poster show={show} />
          </div>
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

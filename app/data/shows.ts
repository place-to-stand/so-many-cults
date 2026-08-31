import showsData from "@/data/shows.json";
import { todayISO } from "./dates";

export type Show = {
  id: string;
  /** YYYY-MM-DD, or null when the date is still TBA. */
  date: string | null;
  /** The event's own name (e.g. a festival, residency, release show); null for a plain bill. */
  title: string | null;
  venue: string;
  address: string | null;
  /** Doors time, e.g. "8:00 PM". */
  doors: string | null;
  /** Freeform time when doors/set times don't apply, e.g. "12:00 PM – 6:00 PM". */
  time: string | null;
  setTimes: { time: string; band: string }[];
  price: string | null;
  presenter: string | null;
  festival: string | null;
  lineup: string[];
  description: string | null;
  ticketUrl: string;
  /** Marks a record-release show (gets a badge). */
  isReleaseShow: boolean;
  /** Projection/visuals artist, when the bill has one. */
  visuals?: { name: string; url: string } | null;
  /** Show flyer, when we have one. */
  poster: { thumbnail: string; fullSize: string } | null;
};

export const allShows: Show[] = showsData.shows;

export function getShowById(id: string | null | undefined): Show | undefined {
  if (!id) return undefined;
  return allShows.find((s) => s.id === id);
}

/**
 * Upcoming shows, soonest first. Shows with a TBA date are treated as upcoming
 * and listed after dated shows.
 */
export function getUpcomingShows(today: string = todayISO()): Show[] {
  return allShows
    .filter((s) => s.date === null || s.date >= today)
    .sort((a, b) => {
      if (a.date === null && b.date === null) return 0;
      if (a.date === null) return 1;
      if (b.date === null) return -1;
      return a.date.localeCompare(b.date);
    });
}

/** Past shows, newest first. */
export function getPastShows(today: string = todayISO()): Show[] {
  return allShows
    .filter((s): s is Show & { date: string } => s.date !== null && s.date < today)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getNextShow(today: string = todayISO()): Show | undefined {
  return getUpcomingShows(today)[0];
}

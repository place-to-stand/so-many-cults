export const BAND_TIME_ZONE = "America/Chicago";

/** Today's date as YYYY-MM-DD in the band's home time zone. */
export function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BAND_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Parse a YYYY-MM-DD string as a local-agnostic date (noon UTC avoids DST edge cases). */
function fromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

/** "January 30, 2026" */
export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(fromISO(iso));
}

/** { month: "JAN", day: "30", weekday: "Fri", year: "2026" } */
export function formatDateParts(iso: string) {
  const date = fromISO(iso);
  const part = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...opts }).format(date);
  return {
    month: part({ month: "short" }).toUpperCase(),
    day: part({ day: "numeric" }),
    weekday: part({ weekday: "short" }),
    year: part({ year: "numeric" }),
  };
}

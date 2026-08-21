import venuesData from "@/data/venues.json";

export type Venue = { name: string; url: string; address: string | null };

export const venues: Venue[] = venuesData.venues;

const byName = new Map(venues.map((v) => [v.name.toLowerCase(), v]));

export function getVenue(name: string): Venue | undefined {
  return byName.get(name.toLowerCase());
}

/** Website for a venue name, or undefined when we don't have one (render plain text). */
export function getVenueUrl(name: string): string | undefined {
  const url = getVenue(name)?.url;
  return url && url.trim() !== "" ? url : undefined;
}

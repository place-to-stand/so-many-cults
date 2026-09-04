import tracksData from "@/data/tracks.json";

export type Track = { title: string; file: string };

export const demoTracks: Track[] = tracksData.demos;

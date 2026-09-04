import videosData from "@/data/videos.json";

export type Video = {
  id: string;
  title: string;
  /** e.g. "Music Video", "Live", "Visualizer" */
  kind: string;
  /** YYYY-MM-DD */
  date: string;
  url: string;
  releaseId: string | null;
  director: string | null;
  /** Id of a block in credits.json. */
  creditsId?: string | null;
  description: string | null;
  /** True while the url is a stand-in. */
  placeholder?: boolean;
};

export const fifthElementVideos = videosData.fifthElement;

/** All videos, newest first. */
export const videos: Video[] = [...(videosData.videos as Video[])].sort((a, b) => b.date.localeCompare(a.date));

export const latestVideo: Video | undefined = videos[0];

/** Turn a YouTube watch / share / shorts URL into a privacy-enhanced embed URL. */
export function youtubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname === "youtu.be") id = u.pathname.slice(1);
    else if (u.hostname.endsWith("youtube.com") || u.hostname.endsWith("youtube-nocookie.com")) {
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else if (u.pathname.startsWith("/embed/")) id = u.pathname.split("/")[2];
      else if (u.pathname.startsWith("/shorts/")) id = u.pathname.split("/")[2];
    }
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

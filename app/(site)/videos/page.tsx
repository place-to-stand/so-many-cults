import type { Metadata } from "next";
import { BAND_NAME } from "../../data/band";
import { videos } from "../../data/videos";
import { VideoCard } from "../../components/VideoCard";

export const metadata: Metadata = {
  title: `Videos — ${BAND_NAME}`,
  description: `Music videos and live footage from ${BAND_NAME}.`,
};

export default function VideosPage() {
  return (
    <div className="px-6 sm:px-10 pt-8 sm:pt-12 pb-8">
      <main className="mx-auto max-w-5xl font-mono">
        <h1 className="text-3xl font-bold">Videos</h1>
        <section className="mt-12 sm:mt-16 space-y-16 sm:space-y-20">
          {videos.length === 0 ? (
            <p className="text-sm text-[#666]">No videos yet.</p>
          ) : (
            videos.map((v) => <VideoCard key={v.id} video={v} headingLevel="h2" />)
          )}
        </section>
      </main>
    </div>
  );
}

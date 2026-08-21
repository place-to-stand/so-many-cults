import Link from "next/link";
import { featuredPhoto, pressPhotos } from "../data/photos";
import { BAND_NAME, shortBio } from "../data/band";
import { platformGroups } from "../data/links";
import { PlatformIcons } from "../components/PlatformIcons";
import { LightboxImage } from "../components/LightboxImage";
import { featuredRelease } from "../data/releases";
import { latestVideo } from "../data/videos";
import { VideoCard } from "../components/VideoCard";
import { getUpcomingShows } from "../data/shows";
import { ReleaseCard } from "../components/ReleaseCard";
import { ShowList } from "../components/ShowList";
import { SectionHeading } from "../components/SectionHeading";

// Re-render hourly so shows roll from "upcoming" to "past" without a redeploy.
export const revalidate = 3600;

export default function Home() {
  const upcoming = getUpcomingShows();
  const heroPhoto = pressPhotos[0] ?? featuredPhoto;

  return (
    <div className="px-6 sm:px-10 pt-8 sm:pt-12 pb-8 sm:pb-16">
      <main className="mx-auto max-w-5xl font-mono">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold">{BAND_NAME}</h1>
            <p className="mt-4 text-sm text-[#666] leading-relaxed max-w-md mx-auto lg:mx-0">{shortBio}</p>
            <div className="mt-8 flex justify-center lg:justify-start">
              <PlatformIcons groups={platformGroups} size="lg" />
            </div>
          </div>
          <div>
            <LightboxImage
              priority
              photos={[heroPhoto]}
              index={0}
              alt={`${BAND_NAME} — ${heroPhoto.venue}. Photo by ${heroPhoto.photographer}`}
            />
          </div>
        </section>

        {/* Featured release */}
        {featuredRelease && (
          <section className="mt-28 sm:mt-36">
            <div className="flex items-baseline justify-between">
              <SectionHeading size="lg">Latest Release</SectionHeading>
              <Link href="/music" className="text-xs text-[#888] hover:text-white">
                All music →
              </Link>
            </div>
            <ReleaseCard release={featuredRelease} />
          </section>
        )}

        {/* Latest video */}
        {latestVideo && (
          <section className="mt-28 sm:mt-36">
            <div className="flex items-baseline justify-between">
              <SectionHeading size="lg">Latest Video</SectionHeading>
              <Link href="/videos" className="text-xs text-[#888] hover:text-white">
                All videos →
              </Link>
            </div>
            <VideoCard video={latestVideo} />
          </section>
        )}

        {/* Shows */}
        <section className="mt-28 sm:mt-36">
          <div className="flex items-baseline justify-between">
            <SectionHeading size="lg">Upcoming Shows</SectionHeading>
            <Link href="/shows" className="text-xs text-[#888] hover:text-white">
              All shows →
            </Link>
          </div>
          <ShowList shows={upcoming} />
        </section>

      </main>
    </div>
  );
}

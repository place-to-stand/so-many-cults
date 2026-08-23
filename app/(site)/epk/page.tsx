import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FiDownload } from "react-icons/fi";
import { PlaylistPlayer } from "../../components/PlaylistPlayer";
import { PhotoGallery } from "../../components/PhotoGallery";
import { ReleaseCard } from "../../components/ReleaseCard";
import { ShowList } from "../../components/ShowList";
import { LinkButtons } from "../../components/LinkButtons";
import { SectionHeading } from "../../components/SectionHeading";
import { pressPhotos, livePhotos } from "../../data/photos";
import {
  BAND_NAME,
  BAND_SUBTITLE,
  BAND_EMAIL,
  BAND_CITY,
  SITE_URL,
  members,
  ffo,
  shortBio,
  extendedBio,
  logo,
} from "../../data/band";
import { socialLinks, streamingLinks } from "../../data/links";
import { demoTracks } from "../../data/tracks";
import { featuredRelease, recordRelease, getReleaseShow, releaseTypeLabel } from "../../data/releases";
import { latestVideo } from "../../data/videos";
import { VideoCard } from "../../components/VideoCard";
import { getUpcomingShows, getPastShows } from "../../data/shows";
import { formatLongDate } from "../../data/dates";
import { pageMetadata } from "../../data/seo";

export const metadata: Metadata = pageMetadata({ title: `${BAND_NAME} — Electronic Press Kit`, description: shortBio, path: "/epk", noindex: true });

export const revalidate = 3600;

export default function EPK() {
  const upcoming = getUpcomingShows();
  const past = getPastShows();
  const releaseShow = recordRelease ? getReleaseShow(recordRelease) : undefined;

  return (
    <div className="px-6 sm:px-10 pt-8 sm:pt-12">
      <main className="mx-auto max-w-5xl font-mono">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">{BAND_NAME}</h1>
          <div className="text-[#666] mt-2">Electronic Press Kit</div>
          <div className="text-[#888] text-sm mt-1">{BAND_SUBTITLE}</div>
        </div>

        {/* At a glance */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border border-[#222] p-4">
          <div>
            <div className="text-[#666] uppercase tracking-wider text-[10px]">Hometown</div>
            <div className="text-[#ccc] mt-1">{BAND_CITY}</div>
          </div>
          <div>
            <div className="text-[#666] uppercase tracking-wider text-[10px]">Genre</div>
            <div className="text-[#ccc] mt-1">Psych Rock</div>
          </div>
          <div>
            <div className="text-[#666] uppercase tracking-wider text-[10px]">Press / Booking</div>
            <a href={`mailto:${BAND_EMAIL}`} className="text-[#ccc] mt-1 block break-all">{BAND_EMAIL}</a>
          </div>
          <div>
            <div className="text-[#666] uppercase tracking-wider text-[10px]">Website</div>
            <Link href="/" className="text-[#ccc] mt-1 block">{SITE_URL.replace(/^https?:\/\//, "")}</Link>
          </div>
        </div>

        {/* Featured release */}
        {featuredRelease && (
          <section className="mt-12 lg:mt-16">
            <SectionHeading>
              Latest Release
              {featuredRelease.video?.url ? " + Official Video" : ""}
            </SectionHeading>
            <ReleaseCard release={featuredRelease} showDownloads creditsOpen />
          </section>
        )}

        {latestVideo && (
          <section className="mt-12 lg:mt-16">
            <SectionHeading>Latest Video</SectionHeading>
            <VideoCard video={latestVideo} creditsOpen />
          </section>
        )}

        {/* Album + release show */}
        {recordRelease && (
          <section className="mt-12 lg:mt-16 border border-[#222] p-5 sm:p-6">
            <SectionHeading>Debut {releaseTypeLabel(recordRelease)}</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="text-xl font-bold">{recordRelease.title}</div>
                <div className="text-[#888] mt-1">
                  {recordRelease.releaseDate ? `Out ${formatLongDate(recordRelease.releaseDate)}` : "Release date TBA"}
                </div>
                {recordRelease.description && (
                  <p className="text-[#ccc] leading-relaxed mt-3">{recordRelease.description}</p>
                )}
              </div>
              {releaseShow && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#888]">Release Show</div>
                  <ShowList shows={[releaseShow]} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Bio + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.6fr] gap-8 lg:gap-12 mt-12 lg:mt-16">
          <div className="space-y-10">
            <div>
              <SectionHeading>Short Bio</SectionHeading>
              <p className="text-sm leading-relaxed text-[#ccc]">{shortBio}</p>
            </div>
            <div>
              <SectionHeading>Extended Bio</SectionHeading>
              <div className="space-y-4 text-sm leading-relaxed text-[#ccc]">
                {extendedBio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8 order-first lg:order-last">
            <div>
              <SectionHeading>Members</SectionHeading>
              <ul className="space-y-1.5 text-sm">
                {members.map((member) => (
                  <li key={member.name}>
                    <span className="text-[#ccc]">{member.name}</span>
                    <span className="text-[#666]"> — {member.role}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeading>For Fans Of</SectionHeading>
              <div className="flex flex-wrap gap-2">
                {ffo.map((band) => (
                  <span key={band} className="text-xs text-[#ccc] px-2.5 py-1 rounded-full border border-[#333] bg-[#1a1a1a]">
                    {band}
                  </span>
                ))}
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div>
                <SectionHeading>Social</SectionHeading>
                <ul className="space-y-2 text-sm">
                  {socialLinks.map((link) => (
                    <li key={link.platform}>
                      <span className="text-[#666]">{link.label}: </span>
                      <Link href={link.url} target="_blank" rel="noopener noreferrer" className="break-all">
                        {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {streamingLinks.length > 0 && (
              <div>
                <SectionHeading>Streaming</SectionHeading>
                <LinkButtons links={streamingLinks} />
              </div>
            )}

            <div>
              <SectionHeading>Contact</SectionHeading>
              <a href={`mailto:${BAND_EMAIL}`} className="text-sm">{BAND_EMAIL}</a>
            </div>

            <div>
              <SectionHeading>Logo</SectionHeading>
              <div className="border border-[#333] p-4 bg-white">
                <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="w-full h-auto" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-[#666]">Font: {logo.font}</span>
                <a
                  href={logo.src}
                  download={logo.src.split("/").pop()}
                  className="inline-flex items-center gap-1.5 text-xs text-[#ccc] hover:text-white transition-colors"
                >
                  <FiDownload className="shrink-0" /> Download SVG
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mt-12 lg:mt-16">
          <div>
            <SectionHeading>Press Photos</SectionHeading>
            {pressPhotos.length > 0 ? (
              <PhotoGallery photos={pressPhotos} showDownload />
            ) : (
              <p className="text-sm text-[#666]">Press photos coming soon.</p>
            )}
          </div>
          <div>
            <SectionHeading>Live Photos</SectionHeading>
            <PhotoGallery photos={livePhotos} showDownload />
          </div>
        </div>

        {/* Demos */}
        <div className="mt-12 lg:mt-16 max-w-2xl">
          <SectionHeading>Demos</SectionHeading>
          <PlaylistPlayer tracks={demoTracks} analytics={{ player: "epk-demos" }} />
        </div>

        {/* Shows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mt-12 lg:mt-16">
          <div>
            <SectionHeading>Upcoming Shows</SectionHeading>
            <ShowList shows={upcoming} />
          </div>
          <div>
            <SectionHeading>Selected Past Shows</SectionHeading>
            <ShowList shows={past} compact />
            <Link href="/shows" className="inline-block mt-4 text-xs text-[#888] hover:text-white">
              Full show history →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

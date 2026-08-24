import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FiDownload } from "react-icons/fi";
import { PhotoGallery } from "../../components/PhotoGallery";
import { ReleaseCard } from "../../components/ReleaseCard";
import { ShowList } from "../../components/ShowList";
import { LinkButtons } from "../../components/LinkButtons";
import { SectionHeading } from "../../components/SectionHeading";
import { ContentsNav } from "../../components/ContentsNav";
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
import { featuredRelease, recordRelease, getReleaseShow, releaseTypeLabel } from "../../data/releases";
import { latestVideo } from "../../data/videos";
import { VideoCard } from "../../components/VideoCard";
import { getUpcomingShows, getPastShows } from "../../data/shows";
import { formatLongDate } from "../../data/dates";
import { pageMetadata } from "../../data/seo";

export const metadata: Metadata = pageMetadata({ title: `${BAND_NAME} — Electronic Press Kit`, description: shortBio, path: "/epk", noindex: true });

export const revalidate = 3600;

/** Anchored section. `scroll-mt` clears the sticky contents bar when jumping. */
function Section({ id, title, children, className = "" }: { id: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-24 mt-14 lg:mt-20 ${className}`}>
      <SectionHeading>{title}</SectionHeading>
      {children}
    </section>
  );
}

export default function EPK() {
  const upcoming = getUpcomingShows();
  const past = getPastShows().slice(0, 8);
  const releaseShow = recordRelease ? getReleaseShow(recordRelease) : undefined;

  const contents = [
    featuredRelease && { id: "release", label: "Release" },
    latestVideo && { id: "video", label: "Video" },
    recordRelease && { id: "ep", label: releaseTypeLabel(recordRelease) },
    { id: "bio", label: "Bio" },
    { id: "photos", label: "Photos" },
    { id: "shows", label: "Shows" },
    { id: "assets", label: "Assets" },
    { id: "contact", label: "Contact" },
  ].filter((c): c is { id: string; label: string } => Boolean(c));

  return (
    <div className="px-6 sm:px-10 pt-8 sm:pt-12">
      <main className="mx-auto max-w-5xl font-mono">
        {/* Header */}
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-[#777]">Electronic Press Kit</div>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3">{BAND_NAME}</h1>
          <p className="text-sm text-[#888] mt-2">{BAND_SUBTITLE}</p>
        </div>

        {/* At a glance */}
        <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 text-sm border-y border-[#222] py-5">
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-[#666]">Hometown</dt>
            <dd className="text-[#ccc] mt-1">{BAND_CITY}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-[#666]">Genre</dt>
            <dd className="text-[#ccc] mt-1">Psych Rock</dd>
          </div>
          {featuredRelease && (
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-[#666]">Latest {releaseTypeLabel(featuredRelease)}</dt>
              <dd className="text-[#ccc] mt-1">
                <a href="#release" className="hover:text-white">{featuredRelease.title}</a>
                {featuredRelease.releaseDate && <span className="block text-[#666]">{formatLongDate(featuredRelease.releaseDate)}</span>}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-[#666]">Press / Booking</dt>
            <dd className="mt-1"><a href={`mailto:${BAND_EMAIL}`} className="text-[#ccc] break-all">{BAND_EMAIL}</a></dd>
          </div>
        </dl>

        {/* Contents — sticky so long-page readers can jump anywhere */}
        <ContentsNav items={contents} />

        {/* Latest release */}
        {featuredRelease && (
          <Section id="release" title={`Latest ${releaseTypeLabel(featuredRelease)}`}>
            <ReleaseCard release={featuredRelease} showDownloads creditsOpen />
          </Section>
        )}

        {latestVideo && (
          <Section id="video" title="Latest Video">
            <VideoCard video={latestVideo} creditsOpen />
          </Section>
        )}

        {/* EP + release show */}
        {recordRelease && (
          <Section id="ep" title={`Debut ${releaseTypeLabel(recordRelease)}`}>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,444px)_1fr] gap-8 lg:gap-12 items-start">
              <div>
                {recordRelease.artwork && (
                  <Image
                    src={recordRelease.artwork}
                    alt={`${recordRelease.title} artwork`}
                    width={1000}
                    height={1000}
                    sizes="(max-width: 1024px) 100vw, 444px"
                    className="w-full h-auto border border-[#222]"
                  />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#9a9a9a]">
                  <span>{releaseTypeLabel(recordRelease)}</span>
                  <span aria-hidden className="h-px w-6 bg-[#333]" />
                  <span>{recordRelease.releaseDate ? `Out ${formatLongDate(recordRelease.releaseDate)}` : "Release date TBA"}</span>
                </div>
                <h3 className="mt-3 text-3xl sm:text-[40px] font-bold tracking-tight leading-[1] text-[#f2f2f2]">{recordRelease.title}</h3>
                {recordRelease.tracklist.length > 0 && (
                  <ol className="mt-6 text-sm text-[#ccc] space-y-1.5">
                    {recordRelease.tracklist.map((t, i) => (
                      <li key={t.title} className="flex gap-3">
                        <span className="w-5 shrink-0 text-[#555] tabular-nums">{i + 1}</span>
                        <span>{t.title}</span>
                      </li>
                    ))}
                  </ol>
                )}
                {releaseShow && (
                  <div className="mt-8 pt-6 border-t border-[#222]">
                    <div className="text-[10px] uppercase tracking-wider text-[#888] mb-4">Release Show</div>
                    <ShowList shows={[releaseShow]} compact />
                  </div>
                )}
              </div>
            </div>
          </Section>
        )}

        {/* Bio + sidebar */}
        <Section id="bio" title="Bio">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.6fr] gap-8 lg:gap-12">
            <div className="space-y-10">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#666] mb-3">Short</div>
                <p className="text-sm leading-relaxed text-[#ccc]">{shortBio}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#666] mb-3">Extended</div>
                <div className="space-y-4 text-sm leading-relaxed text-[#ccc]">
                  {extendedBio.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#666] mb-3">Members</div>
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
                <div className="text-[10px] uppercase tracking-wider text-[#666] mb-3">For Fans Of</div>
                <div className="flex flex-wrap gap-2">
                  {ffo.map((band) => (
                    <span key={band} className="text-xs text-[#ccc] px-2.5 py-1 rounded-full border border-[#333] bg-[#1a1a1a]">
                      {band}
                    </span>
                  ))}
                </div>
              </div>
              {streamingLinks.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#666] mb-3">Streaming</div>
                  <LinkButtons links={streamingLinks} />
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Photos */}
        <Section id="photos" title="Photos">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {pressPhotos.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#666] mb-3">Press</div>
                <PhotoGallery photos={pressPhotos} showDownload />
              </div>
            )}
            {livePhotos.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#666] mb-3">Live</div>
                <PhotoGallery photos={livePhotos} showDownload />
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-[#666]">Click any photo for the full-resolution download.</p>
        </Section>

        {/* Shows */}
        <Section id="shows" title="Shows">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#666] mb-3">Upcoming</div>
              <ShowList shows={upcoming} compact />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#666] mb-3">Recent</div>
              <ShowList shows={past} compact />
              <Link href="/shows" className="inline-block mt-4 text-xs text-[#888] hover:text-white">
                Full show history →
              </Link>
            </div>
          </div>
        </Section>

        {/* Assets */}
        <Section id="assets" title="Assets">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#666] mb-3">Logo</div>
              <div className="border border-[#333] p-4 bg-white">
                <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="w-full h-auto" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-[#666]">Font: {logo.font}</span>
                <a href={logo.src} download={logo.src.split("/").pop()} className="inline-flex items-center gap-1.5 text-xs text-[#ccc] hover:text-white transition-colors">
                  <FiDownload className="shrink-0" /> Download SVG
                </a>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#666] mb-3">Downloads</div>
              <ul className="space-y-2">
                {featuredRelease?.artworkHiRes && (
                  <li>
                    <a href={featuredRelease.artworkHiRes} download className="inline-flex items-center gap-1.5 text-[#ccc] hover:text-white">
                      <FiDownload className="shrink-0" /> {featuredRelease.title} — hi-res artwork
                    </a>
                  </li>
                )}
                {recordRelease?.artworkHiRes && (
                  <li>
                    <a href={recordRelease.artworkHiRes} download className="inline-flex items-center gap-1.5 text-[#ccc] hover:text-white">
                      <FiDownload className="shrink-0" /> {recordRelease.title} — hi-res artwork
                    </a>
                  </li>
                )}
                <li><a href="#photos" className="text-[#ccc] hover:text-white">Press photos (see above)</a></li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Contact */}
        <Section id="contact" title="Contact" className="pb-4">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-[#666]">Press / Booking</dt>
              <dd className="mt-1"><a href={`mailto:${BAND_EMAIL}`} className="text-[#ccc]">{BAND_EMAIL}</a></dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-[#666]">Website</dt>
              <dd className="mt-1"><Link href="/" className="text-[#ccc]">{SITE_URL.replace(/^https?:\/\//, "")}</Link></dd>
            </div>
            {socialLinks.map((link) => (
              <div key={link.platform}>
                <dt className="text-[10px] uppercase tracking-wider text-[#666]">{link.label}</dt>
                <dd className="mt-1">
                  <Link href={link.url} target="_blank" rel="noopener noreferrer" className="text-[#ccc] break-all">
                    {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiMail } from "react-icons/fi";
import { featuredPhoto } from "../data/photos";
import { BAND_NAME, BAND_SUBTITLE, BAND_WEBSITE, BAND_EMAIL } from "../data/band";
import { platformGroups, siteNav } from "../data/links";
import { featuredRelease, releaseTypeLabel } from "../data/releases";
import { blurProps } from "../data/blur";
import { latestVideo } from "../data/videos";
import { getNextShow } from "../data/shows";
import { formatDateParts } from "../data/dates";
import { PlatformIcons } from "../components/PlatformIcons";
import { LightboxImage } from "../components/LightboxImage";

export const metadata: Metadata = {
  title: BAND_NAME,
  description: BAND_SUBTITLE,
  openGraph: {
    title: BAND_NAME,
    description: BAND_SUBTITLE,
    images: [{ url: "/og-link-in-bio.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: BAND_NAME,
    description: BAND_SUBTITLE,
    images: ["/og-link-in-bio.png"],
  },
};

export const revalidate = 3600;

/** One stacked row: eyebrow + title on the left, arrow on the right. */
function Row({
  href,
  eyebrow,
  title,
  external = false,
  primary = false,
}: {
  href: string;
  eyebrow: string;
  title: string;
  external?: boolean;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group flex items-center justify-between gap-4 w-full px-4 py-3.5 border hover:no-underline transition-colors ${
        primary
          ? "bg-white border-white text-black hover:bg-[#e6e6e6]"
          : "border-[#2a2a2a] text-[#ededed] hover:border-[#666]"
      }`}
    >
      <span className="min-w-0">
        <span className={`block text-[10px] uppercase tracking-[0.18em] ${primary ? "text-[#555]" : "text-[#777]"}`}>
          {eyebrow}
        </span>
        <span className="block mt-0.5 text-sm font-bold leading-snug truncate">{title}</span>
      </span>
      <FiArrowRight className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${primary ? "text-black" : "text-[#666]"}`} />
    </Link>
  );
}

export default function LinkInBio() {
  const nextShow = getNextShow();
  const merch = siteNav.find((l) => l.label === "Merch");
  const showDate = nextShow?.date ? formatDateParts(nextShow.date) : null;

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center px-6 py-10 sm:py-14">
      <main className="w-full max-w-sm font-mono flex flex-col gap-7">
        <header className="flex items-center gap-4">
          <LightboxImage
            photos={[featuredPhoto]}
            index={0}
            alt={BAND_NAME}
            sizes="64px"
            priority
            showCredit={false}
            className="w-16 shrink-0 border border-[#2a2a2a]"
            imageClassName="aspect-square object-cover"
          />
          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-tight">{BAND_NAME}</h1>
            <p className="text-xs text-[#888] mt-1">{BAND_SUBTITLE}</p>
          </div>
        </header>

        {featuredRelease && (
          <Link href="/music" className="group block border border-[#2a2a2a] hover:border-[#666] hover:no-underline transition-colors">
            {featuredRelease.artwork && (
              <Image
                src={featuredRelease.artwork}
                alt={`${featuredRelease.title} artwork`}
                width={800}
                height={800}
                sizes="(max-width: 640px) 100vw, 384px"
                className="w-full h-auto"
                priority
                {...blurProps(featuredRelease.artwork)}
              />
            )}
            <div className="flex items-center justify-between gap-4 px-4 py-3.5 border-t border-[#2a2a2a]">
              <span className="min-w-0">
                <span className="block text-[10px] uppercase tracking-[0.18em] text-[#777]">
                  {releaseTypeLabel(featuredRelease)} · {featuredRelease.status === "released" ? "Out now" : "Pre-save"}
                </span>
                <span className="block mt-0.5 text-sm font-bold leading-snug truncate text-[#ededed]">{featuredRelease.title}</span>
              </span>
              <FiArrowRight className="shrink-0 text-[#666] transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        )}

        <div className="flex flex-col gap-2.5">
          {latestVideo && (
            <Row href="/videos" eyebrow={`${latestVideo.kind}`} title={`Watch “${latestVideo.title}”`} />
          )}
          {nextShow && showDate && (
            <Row
              href="/shows"
              eyebrow={`Next show · ${showDate.weekday} ${showDate.month} ${showDate.day}`}
              title={nextShow.isReleaseShow ? `${nextShow.venue} — release show` : nextShow.venue}
            />
          )}
          {merch && <Row href={merch.href} eyebrow="Store" title="Merch" external />}
        </div>

        <PlatformIcons groups={platformGroups} size="md" className="justify-center" />

        <footer className="flex items-center justify-between text-xs text-[#666] pt-2">
          <Link href="/" className="hover:text-[#aaa]">{BAND_WEBSITE}</Link>
          <a href={`mailto:${BAND_EMAIL}`} className="inline-flex items-center gap-1.5 hover:text-[#aaa]">
            <FiMail /> Booking
          </a>
        </footer>
      </main>
    </div>
  );
}

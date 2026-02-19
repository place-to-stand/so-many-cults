import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FiDownload } from "react-icons/fi";
import { PlaylistPlayer } from "../components/PlaylistPlayer";
import { PhotoGallery } from "../components/PhotoGallery";
import { chessClubPhotos } from "../data/photos";
import {
  BAND_NAME,
  BAND_SUBTITLE,
  BAND_EMAIL,
  bandLinks,
  members,
  ffo,
  shortBio,
  extendedBio,
  logo,
} from "../data/band";
import { demoTracks } from "../data/tracks";

export const metadata: Metadata = {
  title: `${BAND_NAME} - Electronic Press Kit`,
};

export default function EPK() {
  return (
    <div className="min-h-screen p-6 sm:p-10 lg:p-16 font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto max-w-5xl font-mono">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            <Link href="/">{BAND_NAME}</Link>
          </h1>
          <div className="text-[#666] mt-2">Electronic Press Kit</div>
          <div className="text-[#888] text-sm mt-1">{BAND_SUBTITLE}</div>
        </div>

        {/* Main content: Bio + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.6fr] gap-8 lg:gap-12 mt-12 lg:mt-20">
          {/* Left: Short Bio + Extended Bio */}
          <div className="space-y-10">
            <div>
              <h2 className="text-xs text-[#888] uppercase tracking-wider mb-4">Short Bio</h2>
              <p className="text-sm leading-relaxed text-[#ccc]">{shortBio}</p>
            </div>

            <div>
              <h2 className="text-xs text-[#888] uppercase tracking-wider mb-4">Extended Bio</h2>
              <div className="space-y-4 text-sm leading-relaxed text-[#ccc]">
                {extendedBio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Members, FFO, Links */}
          <div className="space-y-8 order-first lg:order-last">
            <div>
              <h2 className="text-xs text-[#888] uppercase tracking-wider mb-4">Members</h2>
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
              <h2 className="text-xs text-[#888] uppercase tracking-wider mb-4">For Fans Of</h2>
              <div className="flex flex-wrap gap-2">
                {ffo.map((band) => (
                  <span
                    key={band}
                    className="text-xs text-[#ccc] px-2.5 py-1 rounded-full border border-[#333] bg-[#1a1a1a]"
                  >
                    {band}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xs text-[#888] uppercase tracking-wider mb-4">Links</h2>
              <ul className="space-y-2 text-sm">
                {bandLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        {...(link.isExternal ? { target: "_blank" } : {})}
                        className="inline-flex items-center gap-2"
                      >
                        <Icon className="shrink-0" />{" "}
                        {link.label === "Contact" ? BAND_EMAIL : link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h2 className="text-xs text-[#888] uppercase tracking-wider mb-4">Logo</h2>
              <div className="border border-[#333] rounded-lg p-4 bg-white">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="w-full h-auto"
                />
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

        {/* Media: Demos + Photos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mt-12 lg:mt-16">
          {/* Demos */}
          <div>
            <h2 className="text-xs text-[#888] uppercase tracking-wider mb-4">Demos</h2>
            <PlaylistPlayer tracks={demoTracks} />
          </div>

          {/* Press Photos */}
          <div>
            <h2 className="text-xs text-[#888] uppercase tracking-wider mb-4">Live Photos</h2>
            <PhotoGallery photos={chessClubPhotos} showDownload />
          </div>
        </div>
      </main>
    </div>
  );
}

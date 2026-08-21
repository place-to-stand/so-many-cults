import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { featuredPhoto } from "../data/photos";
import { BAND_NAME, BAND_SUBTITLE, BAND_WEBSITE } from "../data/band";
import { bandLinks } from "../data/links";
import { featuredRelease } from "../data/releases";

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

export default function LinkInBio() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-(family-name:--font-geist-sans)">
      <main className="w-full max-w-sm font-mono flex flex-col items-center gap-6">
        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#333]">
          <Image
            src={featuredPhoto.thumbnail}
            alt={BAND_NAME}
            width={112}
            height={112}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold">{BAND_NAME}</h1>
          <p className="text-sm text-[#888] mt-1">{BAND_SUBTITLE}</p>
        </div>

        <div className="w-full flex flex-col gap-3">
          {featuredRelease && (
            <Link
              href="/music"
              className="flex flex-col items-center justify-center w-full py-3 bg-white text-black rounded-lg hover:bg-[#ddd] hover:no-underline transition-colors"
            >
              <span className="text-[10px] uppercase tracking-wider">
                {featuredRelease.status === "released" ? "Out now" : "Coming soon"}
              </span>
              <span className="font-bold">{featuredRelease.title}</span>
            </Link>
          )}
          {bandLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                {...(link.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#ededed] hover:bg-[#252525] hover:border-[#444] hover:no-underline transition-colors"
              >
                <Icon className="shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <Link href="/" className="text-xs text-[#666] hover:text-[#888] transition-colors mt-4">
          {BAND_WEBSITE}
        </Link>
      </main>
    </div>
  );
}

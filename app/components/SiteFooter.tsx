import { BAND_NAME, BAND_EMAIL, BAND_SUBTITLE } from "../data/band";
import Link from "next/link";
import { platformGroups, footerLinks } from "../data/links";
import { PlatformIcons } from "./PlatformIcons";

export function SiteFooter() {
  return (
    <footer className="font-mono mt-20 border-t border-[#222]">
      <div className="px-6 sm:px-10 py-10">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-xs text-[#666]">
        <div>
          <div className="text-[#ccc]">{BAND_NAME}</div>
          <div className="mt-1">{BAND_SUBTITLE}</div>
          <a href={`mailto:${BAND_EMAIL}`} className="block mt-1 hover:text-[#ccc]">
            {BAND_EMAIL}
          </a>
          <nav aria-label="Site information" className="mt-3 flex gap-x-4">
            {footerLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-[#ccc]">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <PlatformIcons groups={platformGroups} size="sm" />
        </div>
      </div>
    </footer>
  );
}

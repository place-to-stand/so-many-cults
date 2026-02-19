import Link from "next/link";
import Image from "next/image";
import { featuredPhoto } from "./data/photos";
import { BAND_NAME, BAND_SUBTITLE, bandLinks } from "./data/band";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center font-mono text-center max-w-md w-full">
        <h1 className="text-4xl font-bold">{BAND_NAME}</h1>
        <div className="text-[#666]">{BAND_SUBTITLE}</div>

        {/* Featured Photo */}
        <div className="w-full">
          <Image
            src={featuredPhoto.thumbnail}
            alt={`${featuredPhoto.venue} - Photo by ${featuredPhoto.photographer}`}
            width={800}
            height={800}
            sizes="(max-width: 640px) 100vw, 400px"
            className="w-full h-auto"
            priority
          />
          <div className="text-[#555] text-[10px] mt- text-right mt-1 mr-1">
            Photo by <Link href={featuredPhoto.photographerLink} target="_blank">{featuredPhoto.photographer}</Link>
          </div>
        </div>

        <ul className="space-y-4">
          {bandLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                {...(link.isExternal ? { target: "_blank" } : {})}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

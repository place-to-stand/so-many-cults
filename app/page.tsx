import Link from "next/link";
import Image from "next/image";
import { featuredPhoto } from "./data/photos";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center font-mono text-center max-w-md w-full">
        <h1 className="text-4xl font-bold">so many cults</h1>
        <div className="text-[#666]">Austin, Texas Psych Rock</div>

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
            Photo by <Link href="https://www.instagram.com/thomaseganphotography" target="_blank">{featuredPhoto.photographer}</Link>
          </div>
        </div>

        <ul className="space-y-4">
          <li><Link href="https://do512.com/artists/so-many-cults" target="_blank">Upcoming Shows</Link></li>
          <li><Link href="https://instagram.com/somanycults" target="_blank">Instagram</Link></li>
          <li><Link href="https://somanycults.bandcamp.com/" target="_blank">Bandcamp</Link></li>
          <li><Link href="mailto:somanycults@gmail.com">Contact</Link></li>
        </ul>
      </main>
    </div>
  );
}

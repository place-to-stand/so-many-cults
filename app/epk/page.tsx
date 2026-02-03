import Link from "next/link";
import { WaveformPlayer } from "../components/WaveformPlayer";
import { PhotoGallery } from "../components/PhotoGallery";
import { chessClubPhotos } from "../data/photos";

const tracks = [
  {
    title: "Arcade (Demo)",
    file: "/arcade.mp3",
  },
  {
    title: "Directed Energy Weapons (Demo)",
    file: "/directed-energy-weapons.mp3",
  },
  {
    title: "It's Gone Viral (Demo)",
    file: "/its-gone-viral.mp3",
  },
];

export default function EPK() {
  return (
    <div className="min-h-screen p-6 sm:p-10 lg:p-16 font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto font-mono">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">so many cults</h1>
          <div className="text-[#666] mt-2">Electronic Press Kit</div>
          <div className="text-[#888] text-sm mt-1">Austin, Texas Psych Rock</div>
        </div>

        {/* Three-column layout on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_0.75fr] gap-8 lg:gap-10 mt-12 lg:mt-20">
          {/* Audio Players */}
          <div>
            <h2 className="text-xs text-[#888] uppercase tracking-wider mb-4">Demos</h2>
            <div className="space-y-4">
              {tracks.map((track) => (
                <WaveformPlayer
                  key={track.file}
                  audioUrl={track.file}
                  title={track.title}
                />
              ))}
            </div>
          </div>

          {/* Photos */}
          <div>
            <h2 className="text-xs text-[#888] uppercase tracking-wider mb-4">Press Photos</h2>
            <PhotoGallery photos={chessClubPhotos} showDownload />
          </div>

          {/* Links */}
          <div className="order-first lg:order-last">
            <h2 className="text-xs text-[#888] uppercase tracking-wider mb-4">Links</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="https://do512.com/artists/so-many-cults"
                  target="_blank"
                  className="hover:underline"
                >
                  Upcoming Shows
                </Link>
              </li>
              <li>
                <Link
                  href="https://instagram.com/somanycults"
                  target="_blank"
                  className="hover:underline"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="https://somanycults.bandcamp.com/"
                  target="_blank"
                  className="hover:underline"
                >
                  Bandcamp
                </Link>
              </li>
              <li>
                <Link href="mailto:somanycults@gmail.com" className="hover:underline">
                  somanycults@gmail.com
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

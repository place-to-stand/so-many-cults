import Link from "next/link";
import { WaveformPlayer } from "../components/WaveformPlayer";

const tracks = [
  {
    title: "Arcade (Demo)",
    file: "/arcade.mp3",
  },
  {
    title: "Directed Energy Weapon (Demo)",
    file: "/directed-energy-weapon.mp3",
  },
  {
    title: "It's Gone Viral (Demo)",
    file: "/its-gone-viral.mp3",
  },
];

export default function EPK() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center font-mono text-center w-full max-w-xl">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">so many cults</h1>
          <div className="text-[#666]">Electronic Press Kit</div>
        </div>

        <div className="text-[#888] text-sm">Austin, Texas Psych Rock</div>

        {/* Audio Players */}
        <div className="w-full space-y-4">
          {tracks.map((track) => (
            <WaveformPlayer
              key={track.file}
              audioUrl={track.file}
              title={track.title}
            />
          ))}
        </div>

        {/* Links */}
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
      </main>
    </div>
  );
}

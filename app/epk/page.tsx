import type { Metadata } from "next";
import Link from "next/link";
import { WaveformPlayer } from "../components/WaveformPlayer";
import { PhotoGallery } from "../components/PhotoGallery";
import { chessClubPhotos } from "../data/photos";

export const metadata: Metadata = {
  title: "so many cults - Electronic Press Kit",
};

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

const members = [
  { name: "Dave Pokk", role: "vocals, guitar" },
  { name: "Jason Desiderio", role: "synth, guitar, vocals" },
  { name: "Quinn Finney", role: "bass" },
  { name: "Dante Muñoz", role: "drums" },
];

const ffo = ["Queens of the Stone Age", "All Them Witches", "Wand"];

export default function EPK() {
  return (
    <div className="min-h-screen p-6 sm:p-10 lg:p-16 font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto max-w-5xl font-mono">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            <Link href="/">so many cults</Link>
          </h1>
          <div className="text-[#666] mt-2">Electronic Press Kit</div>
          <div className="text-[#888] text-sm mt-1">Austin, Texas Psych Rock</div>
        </div>

        {/* Top section: Band info + Links */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.6fr] gap-8 lg:gap-12 mt-12 lg:mt-20">
          {/* Left: Short Bio */}
          <div>
            <h2 className="text-xs text-[#888] uppercase tracking-wider mb-4">Short Bio</h2>
            <p className="text-sm leading-relaxed text-[#ccc]">
              So Many Cults are an Austin, Texas psych rock band channeling heavy, hypnotic
              grooves through the sweat-soaked clubs of the Red River Cultural District. Formed
              in 2024, the four-piece blends desert rock intensity, swampy psychedelia, and
              garage-rock urgency into a sound that thrives in the live setting.
            </p>
          </div>

          {/* Right: Members, FFO, Links */}
          <div className="space-y-6 order-first lg:order-last">
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
                <li>
                  <Link
                    href="https://do512.com/artists/so-many-cults"
                    target="_blank"
                  >
                    Upcoming Shows
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://instagram.com/somanycults"
                    target="_blank"
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://somanycults.bandcamp.com/"
                    target="_blank"
                  >
                    Bandcamp
                  </Link>
                </li>
                <li>
                  <Link href="mailto:somanycults@gmail.com">
                    somanycults@gmail.com
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Extended Bio */}
        <div className="mt-12 lg:mt-16">
          <h2 className="text-xs text-[#888] uppercase tracking-wider mb-4">Extended Bio</h2>
          <div className="space-y-4 text-sm leading-relaxed text-[#ccc] max-w-3xl">
            <p>
              So Many Cults emerged from Austin&apos;s teeming underground rock scene in 2024,
              a four-piece psych rock band built for volume and bad lighting. Vocalist and
              guitarist Dave Pokk, synth and guitarist Jason Desiderio, bassist Quinn Finney,
              and drummer Dante Muñoz came together with a shared appetite for the heavier,
              more hypnotic corners of psychedelic rock — the kind that hits harder at midnight
              in a room with a low ceiling.
            </p>
            <p>
              The band quickly established themselves as regulars on Austin&apos;s live
              circuit, cutting their teeth at Red River staples like Chess Club and East
              6th mainstay Hotel Vegas — small, loud rooms where the line between stage
              and crowd barely exists.
              Sharing bills with acts like Mulch Cult, Medieval Snails, Sanctum Sanctorum, and
              Ash and the Endings, So Many Cults found their footing in the city&apos;s thriving
              garage-psych ecosystem, building a reputation on the strength of their relentless
              live shows.
            </p>
            <p>
              Their sound draws from a deep well: the desert-baked riffs and rhythmic propulsion
              of Queens of the Stone Age, the dark psychedelic sprawl of All Them Witches, and
              the fuzz-drenched experimentalism of Wand. But So Many Cults filter these
              influences through Austin&apos;s own tradition of uncompromising live rock, arriving
              at something that feels both familiar and distinctly their own. Demo tracks
              like &ldquo;Arcade,&rdquo; &ldquo;Directed Energy Weapons,&rdquo; and &ldquo;It&apos;s
              Gone Viral&rdquo; hint at a band with conspiratorial themes and a taste for the
              absurd, delivered with the heaviness and precision the genre demands.
            </p>
            <p>
              So Many Cults are a band still in the early chapters of their story, but the
              trajectory is clear: more noise, more rooms, more converts.
            </p>
          </div>
        </div>

        {/* Media: Demos + Photos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mt-12 lg:mt-16">
          {/* Demos */}
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

          {/* Press Photos */}
          <div>
            <h2 className="text-xs text-[#888] uppercase tracking-wider mb-4">Press Photos</h2>
            <PhotoGallery photos={chessClubPhotos} showDownload />
          </div>
        </div>
      </main>
    </div>
  );
}

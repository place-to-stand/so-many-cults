import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center font-mono text-center">
        <h1 className="text-4xl font-bold">so many cults</h1>
        <div className="text-[#666]">Austin, Texas Psych Rock</div>
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

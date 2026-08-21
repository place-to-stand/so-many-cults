import type { Track } from "../data/releases";
import { Disclosure } from "./Disclosure";

/** Per-track collapsible lyrics. Tracks without lyrics are listed but not expandable. */
export function Lyrics({ tracks, defaultOpen = false }: { tracks: Track[]; defaultOpen?: boolean }) {
  if (!tracks.some((t) => t.lyrics.trim() || t.instrumental)) return null;
  return (
    <ol className="space-y-2">
      {tracks.map((t, i) => {
        const n = String(i + 1).padStart(2, "0");
        if (!t.lyrics.trim() && !t.instrumental) {
          return (
            <li key={t.title} className="text-xs text-[#6a6a6a] h-[26px] flex items-center">
              <span className="tabular-nums mr-3">{n}</span>
              {t.title}
              {t.duration && <span className="ml-3 text-[#555]">{t.duration}</span>}
            </li>
          );
        }
        return (
          <li key={t.title}>
            <Disclosure
              defaultOpen={defaultOpen && tracks.length === 1}
              summary={
                <>
                  <span className="tabular-nums text-[#8a8a8a]">{n}</span>
                  {t.title}
                  {t.duration && <span className="text-[#6a6a6a]">{t.duration}</span>}
                </>
              }
            >
              {t.instrumental ? (
                <p className="pt-4 pb-2 text-sm italic text-[#777]">Instrumental — no lyrics.</p>
              ) : (
                <pre className="pt-4 pb-2 whitespace-pre-wrap font-mono text-sm leading-relaxed text-[#bbb] max-w-prose">{t.lyrics.trim()}</pre>
              )}
            </Disclosure>
          </li>
        );
      })}
    </ol>
  );
}

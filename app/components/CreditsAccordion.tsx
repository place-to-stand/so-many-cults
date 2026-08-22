import Link from "next/link";
import type { CreditSection } from "../data/credits";
import { Disclosure } from "./Disclosure";

/** Liner notes in an animated accordion. */
export function CreditsAccordion({
  sections,
  defaultOpen = false,
  noun = "liner notes",
}: {
  sections: CreditSection[];
  defaultOpen?: boolean;
  /** Kept for API compatibility; the accordion no longer draws its own border. */
  bare?: boolean;
  /** Word used in the toggle label, e.g. "liner notes" or "credits". */
  noun?: string;
}) {
  if (sections.length === 0) return null;
  return (
    <Disclosure defaultOpen={defaultOpen} summary={`Show ${noun}`} summaryOpen={`Hide ${noun}`}>
      <div className="pt-5 pb-1 grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-x-8 gap-y-6">
        {sections.map((section) => (
          <dl key={section.title}>
            <dt className="text-[11px] uppercase tracking-wider text-[#8a8a8a] mb-2">{section.title}</dt>
            {section.entries.map((e) => (
              <dd key={e.label} className="text-xs leading-relaxed">
                {e.url && !e.value ? (
                  <Link href={e.url} target="_blank" rel="noopener noreferrer" className="text-[#ddd] hover:text-white">{e.label}</Link>
                ) : (
                  <span className="text-[#ddd]">{e.label}</span>
                )}
                {e.value && <span className="text-[#666]">{/\s(by|at|to)$/i.test(e.label) ? " " : " — "}</span>}
                {!e.value ? null : e.url ? (
                  <Link href={e.url} target="_blank" rel="noopener noreferrer" className="text-[#9a9a9a] hover:text-white">
                    {e.value}
                  </Link>
                ) : (
                  <span className="text-[#9a9a9a]">{e.value}</span>
                )}
              </dd>
            ))}
          </dl>
        ))}
      </div>
    </Disclosure>
  );
}

import Link from "next/link";
import type { CreditSection } from "../data/credits";
import { Disclosure } from "./Disclosure";

/** Liner notes in an animated accordion. */
export function CreditsAccordion({
  sections,
  defaultOpen = false,
}: {
  sections: CreditSection[];
  defaultOpen?: boolean;
  /** Kept for API compatibility; the accordion no longer draws its own border. */
  bare?: boolean;
}) {
  if (sections.length === 0) return null;
  return (
    <Disclosure defaultOpen={defaultOpen} summary="Show liner notes" summaryOpen="Hide liner notes">
      <div className="pt-5 pb-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        {sections.map((section) => (
          <dl key={section.title}>
            <dt className="text-[11px] uppercase tracking-wider text-[#8a8a8a] mb-2">{section.title}</dt>
            {section.entries.map((e) => (
              <dd key={e.label} className="text-xs leading-relaxed">
                <span className="text-[#ddd]">{e.label}</span>
                <span className="text-[#666]">{/\s(by|at|to)$/i.test(e.label) ? " " : " — "}</span>
                {e.url ? (
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

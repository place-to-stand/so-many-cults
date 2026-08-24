import Link from "next/link";
import type { CreditSection } from "../data/credits";
import { Disclosure } from "./Disclosure";

/** Render ℗ / © with a font that has both glyphs at the same size (Geist Mono lacks ℗). */
function withSymbols(text: string) {
  return text.split(/([℗©])/).map((part, i) =>
    /[℗©]/.test(part) ? (
      <span key={i} className="font-[Helvetica,Arial,sans-serif] text-[1.05em]">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** Liner notes in an animated accordion. */
export function CreditsAccordion({
  sections,
  defaultOpen = false,
  noun = "liner notes",
  columns,
}: {
  sections: CreditSection[];
  defaultOpen?: boolean;
  /** Kept for API compatibility; the accordion no longer draws its own border. */
  bare?: boolean;
  /** Word used in the toggle label, e.g. "liner notes" or "credits". */
  noun?: string;
  /** Fixed column count (filled top-to-bottom, then left-to-right). Omit for auto-fit columns. */
  columns?: 2;
}) {
  if (sections.length === 0) return null;
  // Fixed columns pack sections top-to-bottom (no shared row heights), so a short
  // section sits directly under the one above it instead of leaving a gap.
  const groups = columns
    ? Array.from({ length: columns }, (_, i) => {
        const per = Math.ceil(sections.length / columns);
        return sections.slice(i * per, (i + 1) * per);
      }).filter((g) => g.length > 0)
    : sections.map((s) => [s]);
  const renderSection = (section: CreditSection) => (
    <dl key={section.title}>
      <dt className="text-[11px] uppercase tracking-wider text-[#8a8a8a] mb-2">{section.title}</dt>
      {section.entries.map((e) => {
        // "Role by/at/to — Person": the value is the person. "Person — roles": the label is.
        const roleFirst = /\s(by|at|to|of|from|on)$/i.test(e.label);
        const linkLabel = !!e.url && (!e.value || !roleFirst);
        const linkValue = !!e.url && !!e.value && roleFirst;
        return (
          <dd key={`${e.label}|${e.value}`} className="text-xs leading-relaxed">
            {linkLabel ? (
              <Link href={e.url} target="_blank" rel="noopener noreferrer" className="text-[#ddd] hover:text-white">{withSymbols(e.label)}</Link>
            ) : (
              <span className="text-[#ddd]">{withSymbols(e.label)}</span>
            )}
            {e.value && <span className="text-[#666]">{roleFirst ? " " : " — "}</span>}
            {!e.value ? null : e.parts ? (
              e.parts.map((part, i) => (
                <span key={part.value} className="text-[#9a9a9a]">
                  {i > 0 && " & "}
                  {part.url ? (
                    <Link href={part.url} target="_blank" rel="noopener noreferrer" className="text-[#9a9a9a] hover:text-white">
                      {part.value}
                    </Link>
                  ) : (
                    part.value
                  )}
                </span>
              ))
            ) : linkValue ? (
              <Link href={e.url} target="_blank" rel="noopener noreferrer" className="text-[#9a9a9a] hover:text-white">
                {e.value}
              </Link>
            ) : (
              <span className="text-[#9a9a9a]">{e.value}</span>
            )}
          </dd>
        );
      })}
    </dl>
  );
  return (
    <Disclosure defaultOpen={defaultOpen} summary={`Show ${noun}`} summaryOpen={`Hide ${noun}`}>
      <div
        className={`pt-5 pb-1 grid gap-x-8 gap-y-6 ${
          columns ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]"
        }`}
      >
        {groups.map((group) => (
          <div key={group[0].title} className="flex flex-col gap-6">
            {group.map(renderSection)}
          </div>
        ))}
      </div>
    </Disclosure>
  );
}

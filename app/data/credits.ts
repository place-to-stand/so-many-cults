import creditsData from "@/data/credits.json";

/** `parts` lets one line carry several independently-linked names, joined by " & ". */
export type CreditPart = { value: string; url: string };
export type CreditEntry = { label: string; value: string; url: string; parts?: CreditPart[] };
export type CreditSection = { title: string; entries: CreditEntry[] };
export type CreditBlock = { id: string; extends?: string; sections: CreditSection[] };

export const creditBlocks: CreditBlock[] = creditsData.blocks;

/** Resolve a block, applying `extends` (override entries matched by section title + label). */
function resolveBlock(id: string, depth = 0): CreditSection[] {
  const block = creditBlocks.find((b) => b.id === id);
  if (!block || depth > 5) return [];
  const base = block.extends ? resolveBlock(block.extends, depth + 1) : [];
  const merged: CreditSection[] = base.map((s) => ({ ...s, entries: s.entries.map((e) => ({ ...e })) }));
  for (const section of block.sections) {
    const target = merged.find((s) => s.title === section.title);
    if (!target) {
      merged.push({ ...section, entries: section.entries.map((e) => ({ ...e })) });
      continue;
    }
    for (const entry of section.entries) {
      const existing = target.entries.find((e) => e.label === entry.label);
      if (existing) Object.assign(existing, entry);
      else target.entries.push({ ...entry });
    }
  }
  return merged;
}

/** Credits for a release, with empty entries and empty sections stripped. */
export function getCredits(id: string | null | undefined): CreditSection[] {
  if (!id) return [];
  return resolveBlock(id)
    .map((s) => ({ ...s, entries: s.entries.filter((e) => e.value.trim() !== "" || e.label.trim() !== "") }))
    .filter((s) => s.entries.length > 0);
}

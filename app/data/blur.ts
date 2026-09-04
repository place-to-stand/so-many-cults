import placeholders from "@/data/blur-placeholders.json";

const map = placeholders as Record<string, string>;

/**
 * Base64 blur-up placeholder for an image under /public (see scripts/generate-blur-placeholders.mjs).
 * Server-only by intent: call it while building props so the client bundle never carries the whole map.
 */
export function getBlurDataURL(src: string | null | undefined): string | undefined {
  if (!src || src.startsWith("_")) return undefined;
  return map[src];
}

/** Props to spread onto `next/image` so it blurs up when a placeholder exists (and no-ops when it doesn't). */
export function blurProps(src: string | null | undefined): { placeholder: "blur"; blurDataURL: string } | { placeholder?: undefined } {
  const blurDataURL = getBlurDataURL(src);
  return blurDataURL ? { placeholder: "blur", blurDataURL } : {};
}

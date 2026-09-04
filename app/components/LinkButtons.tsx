import Link from "next/link";
import type { ExternalLink } from "../data/links";
import { iconFor } from "../data/links";

type Variant = "pill" | "row";

/**
 * Renders a list of external platform links as pills (inline, compact)
 * or rows (stacked, link-in-bio style).
 */
export function LinkButtons({
  links,
  variant = "pill",
  className = "",
  placeholder = false,
}: {
  links: ExternalLink[];
  variant?: Variant;
  className?: string;
  /** Render as inert "coming soon" pills (no hrefs). */
  placeholder?: boolean;
}) {
  if (links.length === 0) return null;

  if (placeholder) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`} aria-label="Streaming links coming soon">
        {links.map((link) => {
          const Icon = iconFor(link.platform);
          return (
            <span
              key={link.platform}
              title="Coming soon"
              className="inline-flex items-center gap-1.5 text-xs text-[#6a6a6a] px-2.5 py-1 rounded-full border border-[#2e2e2e] cursor-default select-none"
            >
              <Icon className="shrink-0" />
              {link.label}
            </span>
          );
        })}
      </div>
    );
  }

  if (variant === "row") {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        {links.map((link) => {
          const Icon = iconFor(link.platform);
          return (
            <Link
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#ededed] hover:bg-[#252525] hover:border-[#444] hover:no-underline transition-colors"
            >
              <Icon className="shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {links.map((link) => {
        const Icon = iconFor(link.platform);
        if (link.url.trim() === "") {
          return (
            <span
              key={link.platform}
              title="Coming soon"
              aria-label={`${link.label} (coming soon)`}
              className="inline-flex items-center gap-1.5 text-xs text-[#6a6a6a] px-2.5 py-1 rounded-full border border-[#2e2e2e] cursor-default select-none"
            >
              <Icon className="shrink-0" />
              {link.label}
            </span>
          );
        }
        return (
          <Link
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#c4c4c4] px-2.5 py-1 rounded-full border border-[#3a3a3a] hover:text-white hover:border-[#777] hover:no-underline transition-colors"
          >
            <Icon className="shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

import { createElement } from "react";
import Link from "next/link";
import type { ExternalLink } from "../data/links";
import { iconFor } from "../data/links";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { icon: string; gap: string; divider: string }> = {
  sm: { icon: "h-5 w-5", gap: "gap-4", divider: "h-5" },
  md: { icon: "h-6 w-6", gap: "gap-5", divider: "h-6" },
  lg: { icon: "h-6 w-6", gap: "gap-5", divider: "h-6" },
};

function PlatformIcon({ link, iconClass }: { link: ExternalLink; iconClass: string }) {
  const live = link.url.trim() !== "";
  const icon = createElement(iconFor(link.platform), { className: iconClass });
  if (!live) {
    return (
      <span aria-label={`${link.label} (coming soon)`} title={`${link.label} — coming soon`} className="block text-[#3a3a3a] cursor-default">
        {icon}
      </span>
    );
  }
  return (
    <Link
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      title={link.label}
      className="block text-[#888] hover:text-white transition-colors"
    >
      {icon}
    </Link>
  );
}

/**
 * Icon-only platform links, rendered as groups separated by a thin divider
 * (e.g. social | streaming). Platforms without a URL render dimmed and inert.
 */
export function PlatformIcons({
  groups,
  size = "sm",
  className = "",
}: {
  groups: ExternalLink[][];
  size?: Size;
  className?: string;
}) {
  const s = SIZES[size];
  const nonEmpty = groups.filter((g) => g.length > 0);
  return (
    <ul className={`flex flex-wrap items-center ${s.gap} ${className}`}>
      {nonEmpty.map((group, gi) => (
        <li key={gi} className={`flex items-center ${s.gap}`}>
          {gi > 0 && <span aria-hidden className={`w-px ${s.divider} bg-[#333]`} />}
          <ul className={`flex items-center ${s.gap}`}>
            {group.map((link) => (
              <li key={link.platform}>
                <PlatformIcon link={link} iconClass={s.icon} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

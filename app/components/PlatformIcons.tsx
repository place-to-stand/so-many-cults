"use client";

import { createElement, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ExternalLink } from "../data/links";
import { iconFor } from "../data/links";

type Size = "sm" | "md" | "lg";

/**
 * `inset` is the padding between a group's divider and its first icon (= the gap), and `pull` the
 * negative margin that hides a divider starting a wrapped line: gap + the 1px divider.
 * md keeps a 16px gap so the full row fits the About sidebar (369px at the widest layout).
 */
const SIZES: Record<Size, { icon: string; gap: string; inset: string; pull: string }> = {
  sm: { icon: "h-5 w-5", gap: "gap-4", inset: "pl-4", pull: "-ml-[17px]" },
  md: { icon: "h-6 w-6", gap: "gap-4", inset: "pl-4", pull: "-ml-[17px]" },
  // Hero size: 20px on phones so social + streaming fit on one line at 375px, 24px from sm up.
  lg: { icon: "h-5 w-5 sm:h-6 sm:w-6", gap: "gap-4 sm:gap-5", inset: "pl-4 sm:pl-5", pull: "-ml-[17px] sm:-ml-[21px]" },
};

/**
 * Optical size corrections. Bandsintown's mark is a solid square that fills its whole box, so at the
 * same size it reads heavier than the round and open marks beside it. Scaling (not resizing) the
 * glyph keeps its box, and so the row's spacing, identical.
 */
const OPTICAL_SCALE: Record<string, string> = {
  bandsintown: "scale-[0.8]",
};

function PlatformIcon({ link, iconClass }: { link: ExternalLink; iconClass: string }) {
  const live = link.url.trim() !== "";
  const icon = createElement(iconFor(link.platform), {
    className: `${iconClass} ${OPTICAL_SCALE[link.platform] ?? ""}`,
  });
  if (!live) {
    return (
      <span aria-label={`${link.label} (coming soon)`} className="group/soon relative block text-[#3a3a3a] cursor-default">
        {icon}
        <span
          role="tooltip"
          className="pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 whitespace-nowrap border border-[#333] bg-[#161616] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#aaa] opacity-0 transition-opacity duration-150 group-hover/soon:opacity-100"
        >
          Coming soon
        </span>
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
 *
 * Wrapping: icons wrap one at a time, and each group's divider is its left border plus `inset` padding.
 * The list is pulled left by that same width, which keeps every line (left-aligned or centred) exactly
 * where it would be without the divider. A group that starts a line (and always the first) gets a
 * transparent divider, so no line opens with a stray rule. The x-only clip hides the pulled strip before
 * hydration and still lets the "Coming soon" tooltips show above the icons.
 */
export function PlatformIcons({
  groups,
  size = "sm",
  justify = "justify-start",
  className = "",
}: {
  groups: ExternalLink[][];
  size?: Size;
  /** Justify classes for every wrapped line, e.g. "justify-center lg:justify-start". */
  justify?: string;
  className?: string;
}) {
  const s = SIZES[size];
  const nonEmpty = groups.filter((g) => g.length > 0);
  const listRef = useRef<HTMLUListElement>(null);
  // Index of each group that starts a new line (its divider is hidden).
  const [lineStarts, setLineStarts] = useState<number[]>([]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const items = Array.from(list.children) as HTMLElement[];
      // On the same line the boxes overlap vertically (items-center); a new line starts below the last.
      const starts = items.flatMap((el, i) =>
        i > 0 && el.getBoundingClientRect().top >= items[i - 1].getBoundingClientRect().bottom - 1 ? [i] : [],
      );
      setLineStarts((prev) => (prev.join() === starts.join() ? prev : starts));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`overflow-x-clip ${className}`}>
      <ul ref={listRef} className={`flex flex-wrap items-center ${s.gap} ${s.pull} ${justify}`}>
        {nonEmpty.map((group, gi) => (
          <li
            key={gi}
            className={`border-l ${gi === 0 || lineStarts.includes(gi) ? "border-transparent" : "border-[#333]"} ${s.inset}`}
          >
            <ul className={`flex flex-wrap items-center ${s.gap} ${justify}`}>
              {group.map((link) => (
                <li key={link.platform}>
                  <PlatformIcon link={link} iconClass={s.icon} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

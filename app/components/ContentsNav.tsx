"use client";

import { useEffect, useState } from "react";

export type ContentsItem = { id: string; label: string };

/**
 * Sticky in-page contents. Highlights the section currently under the bar
 * by tracking scroll position (last section whose top has passed the bar).
 */
export function ContentsNav({ items, offset = 104 }: { items: ContentsItem[]; offset?: number }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= offset) current = item.id;
      }
      // At the very bottom the last section may never reach the bar; still mark it.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = items[items.length - 1]?.id ?? current;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items, offset]);

  return (
    <nav aria-label="Contents" className="sticky top-0 z-30 -mx-6 sm:-mx-10 px-6 sm:px-10 bg-[#0a0a0a]/90 backdrop-blur border-b border-[#222]">
      <ol className="flex flex-wrap gap-x-6 gap-y-1.5 py-3 text-xs uppercase tracking-[0.15em] whitespace-nowrap">
        {items.map((c, i) => {
          const isActive = c.id === active;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`transition-colors hover:text-white hover:no-underline ${isActive ? "text-white" : "text-[#888]"}`}
              >
                <span className={`mr-1.5 ${isActive ? "text-[#888]" : "text-[#444]"}`}>{String(i + 1).padStart(2, "0")}</span>
                {c.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

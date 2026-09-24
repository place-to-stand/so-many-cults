"use client";

import { useEffect, useId, useLayoutEffect, useState } from "react";

/**
 * Accessible accordion that animates open/closed (grid-rows 0fr → 1fr + fade),
 * which native <details> can't do cross-browser yet.
 */
export function Disclosure({
  summary,
  summaryOpen,
  children,
  defaultOpen = false,
  summaryClassName = "",
  contentClassName = "",
  arrowClassName = "size-3",
  openForHashes,
}: {
  summary: React.ReactNode;
  /** Optional alternate label while open (e.g. "Hide …"). */
  summaryOpen?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  summaryClassName?: string;
  contentClassName?: string;
  /** Size/colour classes for the triangle indicator (e.g. "size-3", "size-5 text-[#888]"). */
  arrowClassName?: string;
  /** Element ids inside the content: a URL hash naming one opens the disclosure and scrolls to it. */
  openForHashes?: string[];
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const hashKey = openForHashes?.join(" ") ?? "";
  // Set while a URL hash has opened the disclosure: the expand skips its animation so the page is full
  // height straight away (a click on the toggle clears it and brings the animation back). `scroll` is
  // only for in-page hash changes; on arrival the page-level HashGlide does the scrolling. A fresh
  // object per hash, so repeating a hash re-scrolls.
  const [jump, setJump] = useState<{ target: string; scroll: boolean } | null>(null);

  // Layout effect: on arrival the content is already open when the page first paints.
  useLayoutEffect(() => {
    if (!hashKey) return;
    const targets = new Set(hashKey.split(" "));
    const reveal = (scroll: boolean) => {
      const target = decodeURIComponent(window.location.hash.slice(1));
      if (!targets.has(target)) return;
      setJump({ target, scroll });
      setOpen(true);
    };
    const onHashChange = () => reveal(true);
    reveal(false);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [hashKey]);

  useEffect(() => {
    if (jump?.scroll) document.getElementById(jump.target)?.scrollIntoView({ block: "start" });
  }, [jump]);

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setJump(null);
          setOpen((o) => !o);
        }}
        className={`flex items-center gap-2 h-[26px] leading-none text-xs text-[#c4c4c4] hover:text-white transition-colors select-none cursor-pointer ${summaryClassName}`}
      >
        <svg
          aria-hidden
          viewBox="0 0 10 10"
          className={`shrink-0 origin-center transition-transform duration-300 ease-out ${arrowClassName} ${open ? "[transform:rotate(90deg)]" : "[transform:rotate(0deg)]"}`}
        >
          <path d="M3 1.75 L8 5 L3 8.25 Z" fill="currentColor" />
        </svg>
        {open && summaryOpen !== undefined ? summaryOpen : summary}
      </button>
      <div
        id={id}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${jump ? "transition-none" : ""} ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className={`min-h-0 overflow-hidden ${contentClassName}`} aria-hidden={!open}>
          {children}
        </div>
      </div>
    </div>
  );
}

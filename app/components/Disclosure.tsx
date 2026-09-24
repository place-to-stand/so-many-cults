"use client";

import { useEffect, useId, useState } from "react";

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
  // Hash target to scroll to once the content is laid out open (a fresh object per jump, so a repeat
  // hash re-scrolls). While set, the expand skips its animation so the page is already full height when
  // we scroll; a click on the toggle clears it and brings the animation back.
  const [jump, setJump] = useState<{ target: string } | null>(null);

  useEffect(() => {
    if (!hashKey) return;
    const targets = new Set(hashKey.split(" "));
    const reveal = () => {
      const target = decodeURIComponent(window.location.hash.slice(1));
      if (!targets.has(target)) return;
      setJump({ target });
      setOpen(true);
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, [hashKey]);

  useEffect(() => {
    if (jump) document.getElementById(jump.target)?.scrollIntoView({ block: "start" });
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

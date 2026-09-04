"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { BAND_NAME, BAND_EMAIL } from "../data/band";
import { siteNav, platformGroups } from "../data/links";
import { PlatformIcons } from "./PlatformIcons";

export function SiteNav() {
  const pathname = usePathname();
  // On desktop the homepage hero already carries the wordmark, so the nav hides it there (animated on
  // route change). On mobile the hero heading is hidden instead, so the nav wordmark always shows.
  // Decided from the layout segment rather than the pathname: during ISR regeneration on Vercel the
  // root route can render with pathname "/index", which made the server send the wordmark visible.
  const segment = useSelectedLayoutSegment();
  const isHome = segment === null;

  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Closing via Escape / the X returns focus to the toggle. Link taps just close (the new page takes focus).
  // preventScroll: focusing an off-screen toggle would otherwise scroll the page back to the header.
  const close = () => {
    setOpen(false);
    toggleRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!open) return;
    // Lock page scroll behind the overlay. Padding replaces the scrollbar's width (0 on phones, ~15px in a
    // narrow desktop window) so the layout doesn't shift when the scrollbar disappears and reappears.
    const { style } = document.body;
    const previous = { overflow: style.overflow, paddingRight: style.paddingRight };
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    style.overflow = "hidden";
    if (scrollbarWidth > 0) style.paddingRight = `${scrollbarWidth}px`;
    // Focus the overlay itself, not the first link: keyboard users still Tab straight into the menu, but a
    // tap doesn't paint a focus ring on "Music".
    menuRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      style.overflow = previous.overflow;
      style.paddingRight = previous.paddingRight;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="font-mono">
      <nav className="px-6 sm:px-10 py-5">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-x-6">
          {/* Always mounted so the wordmark can animate in/out on desktop as the route changes.
              `invisible` (not aria-hidden) keeps it out of the tab order only where it's actually hidden. */}
          <Link
            href="/"
            className={`text-lg font-bold tracking-tight hover:no-underline transition-all duration-500 ease-out motion-reduce:transition-none ${
              isHome ? "sm:invisible sm:opacity-0 sm:-translate-y-2 sm:blur-[2px]" : "opacity-100 translate-y-0 blur-0"
            }`}
          >
            {BAND_NAME}
          </Link>

          {/* Desktop: inline links */}
          <ul className="hidden sm:flex flex-wrap items-center gap-x-5 gap-y-2 text-xs uppercase tracking-wider">
            {siteNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`transition-colors hover:no-underline ${
                    isActive(item.href) ? "text-white" : "text-[#888] hover:text-[#ccc]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile: menu toggle. Negative margin keeps the icon flush with the container edge
              while the padding gives it a 40px tap target. */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label="Open menu"
            className="sm:hidden -mr-2 p-2 text-[#ccc] hover:text-white transition-colors"
          >
            <FiMenu className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </nav>

      {/* Mobile menu: full-screen overlay, always mounted so it can animate both in and out. Its top row is
          pixel-identical to the header (same padding, wordmark and button box) so the crossfade is invisible
          and only the icon appears to swap; the overlay itself must not move or the header looks like it jumps.
          `inert` keeps the closed menu out of the tab order, accessibility tree and hit-testing. */}
      <div
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        ref={menuRef}
        tabIndex={-1}
        className={`sm:hidden fixed inset-0 z-50 flex flex-col bg-background font-mono outline-none transition-opacity duration-200 ease-out motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-6 py-5 flex items-center justify-between gap-x-6">
          <Link href="/" onClick={() => setOpen(false)} className="text-lg font-bold tracking-tight hover:no-underline">
            {BAND_NAME}
          </Link>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="-mr-2 p-2 text-[#ccc] hover:text-white transition-colors"
          >
            <FiX className="h-6 w-6" aria-hidden />
          </button>
        </div>

        <ul
          className={`px-6 mt-4 flex-1 overflow-y-auto transition-transform duration-200 ease-out motion-reduce:transition-none ${
            open ? "translate-y-0" : "-translate-y-2"
          }`}
        >
          {siteNav.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href} className="border-b border-[#1f1f1f]">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-current={active ? "page" : undefined}
                  className={`block py-5 text-2xl uppercase tracking-wider hover:no-underline transition-colors ${
                    active ? "text-white" : "text-[#888] hover:text-[#ccc]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="px-6 py-8 flex flex-col gap-5 text-xs text-[#666]">
          <PlatformIcons groups={platformGroups} size="sm" />
          <a href={`mailto:${BAND_EMAIL}`} className="hover:text-[#ccc]">
            {BAND_EMAIL}
          </a>
        </div>
      </div>
    </header>
  );
}

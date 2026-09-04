"use client";

import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { BAND_NAME } from "../data/band";
import { siteNav } from "../data/links";

export function SiteNav() {
  const pathname = usePathname();
  // The homepage hero already carries the wordmark, so the nav hides it there (animated on route change).
  // Decided from the layout segment rather than the pathname: during ISR regeneration on Vercel the
  // root route can render with pathname "/index", which made the server send the wordmark visible.
  const segment = useSelectedLayoutSegment();
  const isHome = segment === null;

  return (
    <header className="font-mono">
      <nav className="px-6 sm:px-10 py-5">
        <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        {/* Always mounted so the wordmark can animate in/out as the route changes. */}
        <Link
          href="/"
          aria-hidden={isHome}
          tabIndex={isHome ? -1 : 0}
          className={`text-lg font-bold tracking-tight hover:no-underline transition-all duration-500 ease-out motion-reduce:transition-none ${
            isHome ? "opacity-0 -translate-y-2 blur-[2px] pointer-events-none" : "opacity-100 translate-y-0 blur-0"
          }`}
        >
          {BAND_NAME}
        </Link>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs uppercase tracking-wider">
          {siteNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-current={isActive ? "page" : undefined}
                  className={`transition-colors hover:no-underline ${
                    isActive ? "text-white" : "text-[#888] hover:text-[#ccc]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        </div>
      </nav>
    </header>
  );
}

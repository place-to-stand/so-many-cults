import { Fragment } from "react";
import Link from "next/link";
import type { TrustSection } from "../data/trust";
import { SectionHeading } from "./SectionHeading";

/** Turns the [text](url) links in trust-page copy into anchors; everything else is plain text. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!m) return <Fragment key={i}>{part}</Fragment>;
        const [, label, href] = m;
        const external = /^https?:/.test(href);
        return (
          <Link
            key={i}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="text-[#ccc] hover:text-white"
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}

/** Shared layout for /contact and /privacy: title, intro, then headed sections of paragraphs. */
export function TrustPage({
  title,
  eyebrow,
  intro,
  sections,
}: {
  title: string;
  eyebrow?: string;
  intro: string;
  sections: TrustSection[];
}) {
  return (
    <div className="px-6 sm:px-10 pt-8 sm:pt-12 pb-8">
      <main className="mx-auto max-w-5xl font-mono">
        {eyebrow && <p className="text-[11px] uppercase tracking-[0.18em] text-[#666] mb-2">{eyebrow}</p>}
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-6 text-sm leading-relaxed text-[#ccc] max-w-2xl">
          <RichText text={intro} />
        </p>
        <div className="mt-12 sm:mt-16 max-w-2xl space-y-12">
          {sections.map((section) => (
            <section key={section.heading}>
              <SectionHeading size="lg">{section.heading}</SectionHeading>
              <div className="space-y-4 text-sm leading-relaxed text-[#ccc]">
                {section.paragraphs.map((p, i) => (
                  <p key={i}>
                    <RichText text={p} />
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import { BAND_NAME, BAND_EMAIL, members, extendedBio } from "../../data/band";
import { platformGroups } from "../../data/links";
import { PlatformIcons } from "../../components/PlatformIcons";
import { SectionHeading } from "../../components/SectionHeading";
import { LightboxImage } from "../../components/LightboxImage";
import { featuredPhoto, pressPhotos } from "../../data/photos";
import { pageMetadata, descriptions, musicGroupJsonLd } from "../../data/seo";
import { JsonLd } from "../../components/JsonLd";

export const metadata: Metadata = pageMetadata({ title: `About — ${BAND_NAME}`, description: descriptions.about, path: "/about" });

export default function AboutPage() {
  // Second press shot here so About doesn't repeat the homepage hero.
  const heroPhoto = pressPhotos[1] ?? pressPhotos[0] ?? featuredPhoto;
  return (
    <div className="px-6 sm:px-10 pt-8 sm:pt-12">
      <main className="mx-auto max-w-5xl font-mono">
        <JsonLd data={musicGroupJsonLd()} />
        <h1 className="text-3xl font-bold">About</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.6fr] gap-10 mt-12 sm:mt-16">
          <div>
            <LightboxImage
              photos={[heroPhoto]}
              index={0}
              alt={`${BAND_NAME} — ${heroPhoto.venue}. Photo by ${heroPhoto.photographer}`}
              sizes="(max-width: 1024px) 100vw, 600px"
              priority
            />
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-[#ccc]">
              {extendedBio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="space-y-12 order-first lg:order-last">
            <div>
              <SectionHeading size="lg">Members</SectionHeading>
              <ul className="space-y-1.5 text-sm">
                {members.map((member) => (
                  <li key={member.name}>
                    <span className="text-[#ccc]">{member.name}</span>
                    <span className="text-[#666]"> — {member.role}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeading size="lg">Follow</SectionHeading>
              <PlatformIcons groups={platformGroups} size="md" />
            </div>
            <div>
              <SectionHeading size="lg">Contact</SectionHeading>
              <a href={`mailto:${BAND_EMAIL}`} className="text-sm">
                {BAND_EMAIL}
              </a>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

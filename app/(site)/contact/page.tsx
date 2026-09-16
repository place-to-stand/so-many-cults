import type { Metadata } from "next";
import { BAND_NAME } from "../../data/band";
import { contactIntro, contactSections } from "../../data/trust";
import { pageMetadata, descriptions, contactPageJsonLd } from "../../data/seo";
import { JsonLd } from "../../components/JsonLd";
import { TrustPage } from "../../components/TrustPage";

export const metadata: Metadata = pageMetadata({ title: `Contact — ${BAND_NAME}`, description: descriptions.contact, path: "/contact" });

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageJsonLd()} />
      <TrustPage title="Contact" intro={contactIntro} sections={contactSections} />
    </>
  );
}

import type { Metadata } from "next";
import { BAND_NAME } from "../../data/band";
import { privacyIntro, privacySections, PRIVACY_UPDATED } from "../../data/trust";
import { formatLongDate } from "../../data/dates";
import { pageMetadata, descriptions, privacyPageJsonLd } from "../../data/seo";
import { JsonLd } from "../../components/JsonLd";
import { TrustPage } from "../../components/TrustPage";

export const metadata: Metadata = pageMetadata({ title: `Privacy — ${BAND_NAME}`, description: descriptions.privacy, path: "/privacy" });

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={privacyPageJsonLd(PRIVACY_UPDATED)} />
      <TrustPage
        title="Privacy"
        eyebrow={`Last updated ${formatLongDate(PRIVACY_UPDATED)}`}
        intro={privacyIntro}
        sections={privacySections}
      />
    </>
  );
}

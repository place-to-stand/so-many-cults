import React from "react";
import type { Metadata } from "next";
import FifthElementButton from "./FifthElementButton";
import FifthElementVideos from "./FifthElementVideos";
import { BAND_NAME } from "../../data/band";

// Landing page for a QR code shown at a gig: not linked from the site and kept out of search results.
export const metadata: Metadata = {
  title: `Fifth Element — ${BAND_NAME}`,
  robots: { index: false, follow: false },
};

export default function FifthElement() {
  return (
    <div className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-dvh p-8 pb-20 gap-16 sm:p-20 font-(family-name:--font-geist-sans)">
      <main className="flex flex-col gap-[32px] row-start-2 items-center font-mono text-center">
        <FifthElementVideos />
        <FifthElementButton />
      </main>
    </div>
  );
}

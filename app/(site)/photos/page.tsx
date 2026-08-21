import type { Metadata } from "next";
import { BAND_NAME } from "../../data/band";
import { pressPhotos, livePhotos } from "../../data/photos";
import { PhotoGallery } from "../../components/PhotoGallery";
import { SectionHeading } from "../../components/SectionHeading";

export const metadata: Metadata = {
  title: `Photos — ${BAND_NAME}`,
  description: `Press and live photos of ${BAND_NAME}.`,
};

export default function PhotosPage() {
  return (
    <div className="px-6 sm:px-10 pt-8 sm:pt-12">
      <main className="mx-auto max-w-5xl font-mono">
        <h1 className="text-3xl font-bold">Photos</h1>

        {pressPhotos.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <SectionHeading size="lg">Press Photos</SectionHeading>
            <PhotoGallery photos={pressPhotos} columns={3} />
          </section>
        )}

        <section className="mt-12 sm:mt-16">
          <SectionHeading size="lg">Live</SectionHeading>
          <PhotoGallery photos={livePhotos} columns={3} />
        </section>
      </main>
    </div>
  );
}

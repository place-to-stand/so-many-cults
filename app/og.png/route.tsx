import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { ImageResponse } from "next/og";
import { logo } from "../data/band";
import { featuredPhoto } from "../data/photos";
import { featuredRelease } from "../data/releases";

// The default share card (see defaultShareImage in app/data/seo.ts). Rendered once per deploy from the
// current data, so it follows the featured release instead of going stale like a hand-made PNG.
export const dynamic = "force-static";

const WIDTH = 1200;
const HEIGHT = 630;
const COVER_SIZE = 430;
const WORDMARK_WIDTH = 520;

async function publicFile(path: string) {
  return readFile(join(process.cwd(), "public", path));
}

async function dataUri(path: string) {
  const type = extname(path).toLowerCase() === ".png" ? "image/png" : "image/jpeg";
  return `data:${type};base64,${(await publicFile(path)).toString("base64")}`;
}

export async function GET() {
  const cover = await dataUri(featuredRelease?.artwork ?? featuredPhoto.thumbnail);
  // The logo file is black letters on a white box: drop the box and turn the letters off-white for the dark card.
  const logoSvg = (await publicFile(logo.src))
    .toString()
    .replace(/<rect[^>]*\/>/, "")
    .replace('fill="black"', 'fill="#ededed"');
  const wordmark = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 72,
          background: "#0a0a0a",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img>, not next/image */}
        <img src={cover} alt="" width={COVER_SIZE} height={COVER_SIZE} style={{ objectFit: "cover" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={wordmark} alt="" width={WORDMARK_WIDTH} height={Math.round((WORDMARK_WIDTH * logo.height) / logo.width)} />
      </div>
    ),
    { width: WIDTH, height: HEIGHT },
  );
}

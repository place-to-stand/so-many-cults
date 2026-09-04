import { youtubeEmbedUrl } from "../data/releases";

export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const embed = youtubeEmbedUrl(url);
  if (!embed) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm">
        Watch: {title}
      </a>
    );
  }
  return (
    <div className="relative w-full aspect-video overflow-hidden border border-[#333] bg-black">
      <iframe
        src={embed}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

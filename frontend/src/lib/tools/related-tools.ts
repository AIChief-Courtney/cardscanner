import { getToolRecord, toolHref } from "@/lib/tools/registry";

const RELATED: Record<string, string[]> = {
  "image-converter": [
    "webp-to-png",
    "heic-to-jpg",
    "heic-to-png",
    "webp-to-jpg",
    "png-to-svg",
    "jfif-to-png",
    "image-compressor",
    "jpg-to-pdf",
  ],
  "video-converter": ["mp4-converter", "mov-to-mp4", "video-to-mp3", "mp4-to-mp3", "video-to-gif", "video-compressor"],
  "audio-converter": ["mp3-converter", "mp3-to-ogg", "mp3-compressor", "video-to-mp3"],
  "pdf-converter": ["pdf-to-word", "pdf-to-jpg", "docx-to-pdf", "jpg-to-pdf", "compress-pdf"],
};

export function relatedToolsFor(slug: string): { slug: string; label: string; href: string }[] {
  const slugs = RELATED[slug] ?? [];
  return slugs
    .map((s) => getToolRecord(s))
    .filter((t): t is NonNullable<typeof t> => !!t)
    .map((t) => ({ slug: t.slug, label: t.label, href: toolHref(t.slug) }));
}
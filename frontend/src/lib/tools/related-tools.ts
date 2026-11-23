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
  "document-converter": ["docx-to-pdf", "pdf-to-word", "ebook-converter", "jpg-to-pdf"],
  "ebook-converter": ["epub-to-pdf", "pdf-to-epub", "epub-to-mobi", "pdf-converter"],
  "svg-converter": ["png-to-svg", "webp-to-png", "image-converter", "image-compressor"],
  "mp3-converter": ["mp3-to-ogg", "audio-converter", "mp3-compressor", "video-to-mp3"],
  "mp4-converter": ["mov-to-mp4", "mp4-to-mp3", "video-converter", "video-compressor"],
  "archive-converter": ["rar-to-zip", "unit-converter", "time-converter"],
  "webp-to-png": ["webp-to-jpg", "image-converter", "image-compressor", "png-to-svg"],
  "pdf-to-word": ["pdf-converter", "document-converter", "docx-to-pdf", "pdf-to-jpg"],
};

export function relatedToolsFor(slug: string): { slug: string; label: string; href: string }[] {
  const slugs = RELATED[slug] ?? [];
  return slugs
    .map((s) => getToolRecord(s))
    .filter((t): t is NonNullable<typeof t> => !!t)
    .map((t) => ({ slug: t.slug, label: t.label, href: toolHref(t.slug) }));
}
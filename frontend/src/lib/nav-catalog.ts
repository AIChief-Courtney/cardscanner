import type { ToolKind, UserTool } from "@/lib/user-tools";

export type NavMenuKey = "convert" | "compress" | "tools" | "api";

export type NavColumn = {
  id: string;
  title: string;
  tools: UserTool[];
};

/** FreeConvert-style mega menus: many columns, many links per top nav item. */
export const NAV_MEGA_CATALOG: Record<NavMenuKey, NavColumn[]> = {
  convert: [
    {
      id: "video-audio",
      title: "Video & Audio",
      tools: [
        { slug: "video-converter", label: "Video Converter", kind: "video" },
        { slug: "audio-converter", label: "Audio Converter", kind: "audio" },
        { slug: "mp3-converter", label: "MP3 Converter", kind: "audio" },
        { slug: "mp4-to-mp3", label: "MP4 to MP3", kind: "video" },
        { slug: "video-to-mp3", label: "Video to MP3", kind: "video" },
        { slug: "mp4-converter", label: "MP4 Converter", kind: "video" },
        { slug: "mov-to-mp4", label: "MOV to MP4", kind: "video" },
        { slug: "mp3-to-ogg", label: "MP3 to OGG", kind: "audio" },
      ],
    },
    {
      id: "image",
      title: "Image",
      tools: [
        { slug: "image-converter", label: "Image Converter", kind: "image" },
        { slug: "webp-to-png", label: "WEBP to PNG", kind: "image" },
        { slug: "jfif-to-png", label: "JFIF to PNG", kind: "image" },
        { slug: "png-to-svg", label: "PNG to SVG", kind: "image" },
        { slug: "heic-to-jpg", label: "HEIC to JPG", kind: "image" },
        { slug: "heic-to-png", label: "HEIC to PNG", kind: "image" },
        { slug: "webp-to-jpg", label: "WEBP to JPG", kind: "image" },
        { slug: "svg-converter", label: "SVG Converter", kind: "image" },
      ],
    },
    {
      id: "pdf",
      title: "PDF & Documents",
      tools: [
        { slug: "pdf-converter", label: "PDF Converter", kind: "pdf" },
        { slug: "document-converter", label: "Document Converter", kind: "word" },
        { slug: "ebook-converter", label: "Ebook Converter", kind: "pdf" },
        { slug: "pdf-to-word", label: "PDF to Word", kind: "word" },
        { slug: "pdf-to-jpg", label: "PDF to JPG", kind: "image" },
        { slug: "pdf-to-epub", label: "PDF to EPUB", kind: "pdf" },
        { slug: "epub-to-pdf", label: "EPUB to PDF", kind: "pdf" },
        { slug: "heic-to-pdf", label: "HEIC to PDF", kind: "pdf" },
        { slug: "docx-to-pdf", label: "DOCX to PDF", kind: "pdf" },
        { slug: "jpg-to-pdf", label: "JPG to PDF", kind: "pdf" },
      ],
    },
    {
      id: "gif",
      title: "GIF",
      tools: [
        { slug: "video-to-gif", label: "Video to GIF", kind: "gif" },
        { slug: "mp4-to-gif", label: "MP4 to GIF", kind: "gif" },
        { slug: "webm-to-gif", label: "WEBM to GIF", kind: "gif" },
        { slug: "apng-to-gif", label: "APNG to GIF", kind: "gif" },
        { slug: "gif-to-mp4", label: "GIF to MP4", kind: "gif" },
        { slug: "gif-to-apng", label: "GIF to APNG", kind: "gif" },
        { slug: "image-to-gif", label: "Image to GIF", kind: "gif" },
        { slug: "mov-to-gif", label: "MOV to GIF", kind: "gif" },
        { slug: "avi-to-gif", label: "AVI to GIF", kind: "gif" },
      ],
    },
    {
      id: "other",
      title: "Others",
      tools: [
        { slug: "unit-converter", label: "Unit Converter", kind: "utility" },
        { slug: "time-converter", label: "Time Converter", kind: "utility" },
        { slug: "archive-converter", label: "Archive Converter", kind: "utility" },
      ],
    },
  ],
  compress: [
    {
      id: "video-audio",
      title: "Video & Audio",
      tools: [
        { slug: "video-compressor", label: "Video Compressor", kind: "video" },
        { slug: "mp3-compressor", label: "MP3 Compressor", kind: "audio" },
        { slug: "wav-compressor", label: "WAV Compressor", kind: "audio" },
      ],
    },
    {
      id: "image",
      title: "Image",
      tools: [
        { slug: "image-compressor", label: "Image Compressor", kind: "image" },
        { slug: "compress-jpeg", label: "JPEG Compressor", kind: "image" },
        { slug: "compress-png", label: "PNG Compressor", kind: "image" },
      ],
    },
    {
      id: "pdf",
      title: "PDF & Documents",
      tools: [{ slug: "compress-pdf", label: "PDF Compressor", kind: "pdf" }],
    },
    {
      id: "gif",
      title: "GIF",
      tools: [{ slug: "gif-compressor", label: "GIF Compressor", kind: "gif" }],
    },
  ],
  tools: [
    {
      id: "video-gif",
      title: "Video & GIF",
      tools: [
        { slug: "crop-video", label: "Crop Video", kind: "video" },
        { slug: "trim-video", label: "Trim Video", kind: "video" },
        { slug: "gif-maker", label: "GIF Maker", kind: "gif" },
      ],
    },
    {
      id: "image",
      title: "Image",
      tools: [
        { slug: "resize-image", label: "Resize Image", kind: "utility" },
        { slug: "crop-image", label: "Crop Image", kind: "utility" },
        { slug: "color-picker", label: "Color Picker", kind: "utility" },
        { slug: "rotate-image", label: "Rotate Image", kind: "utility" },
        { slug: "flip-image", label: "Flip Image", kind: "utility" },
        { slug: "image-enlarger", label: "Image Enlarger", kind: "utility" },
      ],
    },
    {
      id: "pdf",
      title: "PDF & Documents",
      tools: [
        { slug: "edit-pdf", label: "Edit PDF", kind: "utility" },
        { slug: "annotate-pdf", label: "Annotate PDF", kind: "utility" },
        { slug: "e-sign", label: "E-sign", kind: "utility" },
        { slug: "create-fillable-pdf", label: "Create Fillable PDF", kind: "utility" },
        { slug: "pdf-reader", label: "PDF Reader", kind: "utility" },
        { slug: "merge-pdf", label: "PDF Merge", kind: "utility" },
        { slug: "split-pdf", label: "PDF Split", kind: "utility" },
        { slug: "flatten-pdf", label: "Flatten PDF", kind: "utility" },
        { slug: "resize-pdf", label: "Resize PDF", kind: "utility" },
        { slug: "unlock-pdf", label: "Unlock PDF", kind: "utility" },
        { slug: "rotate-pdf", label: "Rotate PDF", kind: "utility" },
        { slug: "protect-pdf", label: "Protect PDF", kind: "utility" },
        { slug: "crop-pdf", label: "Crop PDF", kind: "utility" },
        { slug: "organize-pdf", label: "Organize PDF", kind: "utility" },
        { slug: "extract-image-from-pdf", label: "Extract image from PDF", kind: "utility" },
        { slug: "pdf-page-remover", label: "PDF page remover", kind: "utility" },
        { slug: "extract-pages-from-pdf", label: "Extract Pages from PDF", kind: "utility" },
      ],
    },
  ],
  api: [
    {
      id: "api-start",
      title: "Get started",
      tools: [
        { slug: "api-job-builder", label: "API Job Builder", kind: "api" },
        { slug: "api-documentation", label: "API Documentation", kind: "api" },
      ],
    },
    {
      id: "api-convert",
      title: "Conversion APIs",
      tools: [
        { slug: "file-conversion-api", label: "File Conversion API", kind: "api" },
        { slug: "image-conversion-api", label: "Image Conversion API", kind: "api" },
        { slug: "audio-conversion-api", label: "Audio Conversion API", kind: "api" },
        { slug: "document-conversion-api", label: "Document Conversion API", kind: "api" },
        { slug: "pdf-conversion-api", label: "PDF Conversion API", kind: "api" },
        { slug: "mp4-conversion-api", label: "MP4 Conversion API", kind: "api" },
        { slug: "video-conversion-api", label: "Video Conversion API", kind: "api" },
      ],
    },
    {
      id: "api-popular",
      title: "Popular APIs",
      tools: [
        { slug: "jpg-to-pdf-api", label: "JPG to PDF API", kind: "api" },
        { slug: "video-to-mp3-api", label: "Video to MP3 API", kind: "api" },
        { slug: "heic-to-jpg-api", label: "HEIC to JPG API", kind: "api" },
        { slug: "pdf-to-jpg-api", label: "PDF to JPG API", kind: "api" },
        { slug: "webp-to-png-api", label: "Webp to PNG API", kind: "api" },
        { slug: "pdf-to-word-api", label: "PDF to WORD API", kind: "api" },
        { slug: "mp4-to-mp3-api", label: "MP4 to MP3 API", kind: "api" },
        { slug: "webp-to-jpg-api", label: "Webp to JPG API", kind: "api" },
        { slug: "word-to-pdf-api", label: "WORD to PDF API", kind: "api" },
        { slug: "html-to-pdf-api", label: "HTML to PDF API", kind: "api" },
        { slug: "website-screenshot-api", label: "Website Screenshot API", kind: "api" },
      ],
    },
    {
      id: "api-compress",
      title: "Compression APIs",
      tools: [
        { slug: "video-compression-api", label: "Video Compression API", kind: "api" },
        { slug: "compress-pdf-api", label: "Compress PDF API", kind: "api" },
        { slug: "image-compression-api", label: "Image Compression API", kind: "api" },
      ],
    },
  ],
};

export function getNavColumns(menu: NavMenuKey): NavColumn[] {
  return NAV_MEGA_CATALOG[menu];
}

export function allUniqueCatalogTools(): { tool: UserTool; columnId: string; columnTitle: string }[] {
  const seen = new Set<string>();
  const out: { tool: UserTool; columnId: string; columnTitle: string }[] = [];
  for (const columns of Object.values(NAV_MEGA_CATALOG)) {
    for (const col of columns) {
      for (const tool of col.tools) {
        if (seen.has(tool.slug)) continue;
        seen.add(tool.slug);
        out.push({ tool, columnId: col.id, columnTitle: col.title });
      }
    }
  }
  return out;
}

export function isUtilityKind(kind: ToolKind): boolean {
  return kind === "utility";
}
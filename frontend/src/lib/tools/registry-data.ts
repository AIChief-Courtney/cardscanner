import type { ToolRecord } from "@/lib/tools/types";
import type { ToolKind } from "@/lib/user-tools";
import {
  AUDIO_OUTPUTS,
  DOCUMENT_OUTPUTS,
  IMAGE_OUTPUTS,
  PDF_OUTPUTS,
  VIDEO_OUTPUTS,
} from "@/lib/tools/category-outputs";

type Def = Partial<ToolRecord> & Pick<ToolRecord, "slug" | "label" | "menuGroup" | "template" | "kind">;

const REF = "https://www.freeconvert.com";

function def(
  d: Def,
): ToolRecord {
  const route = d.route ?? d.slug;
  return {
    route,
    aliases: d.aliases ?? [],
    category: d.category ?? d.menuGroup,
    keywords: d.keywords ?? [d.label.toLowerCase(), d.slug.replace(/-/g, " ")],
    referencePath: d.referencePath ?? d.slug,
    execution: d.execution ?? (d.externalUrl ? "unavailable" : "demo"),
    externalUrl: d.externalUrl,
    inputHints: d.inputHints ?? "Common formats",
    accept: d.accept ?? "*/*",
    outputFormats: d.outputFormats,
    defaultOutput: d.defaultOutput,
    maxFiles: d.maxFiles ?? 10,
    maxSizeMb: d.maxSizeMb ?? 256,
    h1: d.h1 ?? d.label,
    tagline:
      d.tagline ??
      (d.template === "compressor"
        ? `${d.label} online, for free.`
        : `Convert with ${d.label} online, for free.`),
    convertLabel:
      d.convertLabel ??
      (d.template === "compressor"
        ? "Compress"
        : d.template === "pdf-operation"
          ? "Apply"
          : d.template === "media-editor"
            ? "Apply"
            : "Convert"),
    ...d,
  };
}

const SLUG_OUTPUT: Record<string, string> = {
  word: "DOCX",
  docx: "DOCX",
  pdf: "PDF",
  jpg: "JPG",
  jpeg: "JPG",
  png: "PNG",
  webp: "WEBP",
  gif: "GIF",
  mp3: "MP3",
  mp4: "MP4",
  epub: "EPUB",
  mobi: "MOBI",
  ogg: "OGG",
  svg: "SVG",
  zip: "ZIP",
};

const SLUG_ACCEPT: Record<string, { accept: string; inputHints: string }> = {
  pdf: { accept: ".pdf,application/pdf", inputHints: "PDF" },
  word: { accept: ".pdf,application/pdf", inputHints: "PDF" },
  jpg: { accept: "image/*", inputHints: "JPG, PNG, JPEG" },
  jpeg: { accept: "image/*", inputHints: "JPG, PNG, JPEG" },
  png: { accept: "image/*", inputHints: "PNG, JPG, WEBP" },
  webp: { accept: "image/*", inputHints: "WEBP, PNG" },
  heic: { accept: "image/*", inputHints: "HEIC, JPG" },
  mp4: { accept: "video/*", inputHints: "MP4, MOV, WEBM" },
  mov: { accept: "video/*", inputHints: "MOV, MP4" },
  mp3: { accept: "audio/*", inputHints: "MP3, WAV" },
  epub: { accept: ".epub,application/epub+zip", inputHints: "EPUB" },
  gif: { accept: "image/*,video/*", inputHints: "GIF, MP4, WEBP" },
  jfif: { accept: "image/*", inputHints: "JFIF, JPG" },
  rar: { accept: ".rar", inputHints: "RAR archive" },
  apng: { accept: "image/*", inputHints: "APNG, PNG" },
  webm: { accept: "video/*", inputHints: "WEBM, MP4" },
  avi: { accept: "video/*", inputHints: "AVI, MOV" },
  docx: { accept: ".doc,.docx,application/msword", inputHints: "DOC, DOCX" },
};

function pairHints(slug: string): Partial<ToolRecord> {
  if (!slug.includes("-to-")) return {};
  const [from, to] = slug.split("-to-");
  const defaultOutput = SLUG_OUTPUT[to] ?? to.toUpperCase();
  const fromHint = SLUG_ACCEPT[from];
  return {
    defaultOutput,
    outputFormats: [defaultOutput],
    ...(fromHint ?? {}),
  };
}

function conv(slug: string, label: string, kind: ToolKind = "image", extra?: Partial<ToolRecord>) {
  const auto = extra?.defaultOutput ? {} : pairHints(slug);
  return def({ slug, label, menuGroup: "convert", template: "conversion", kind, ...auto, ...extra });
}

function cmp(slug: string, label: string, kind: ToolKind = "image", extra?: Partial<ToolRecord>) {
  const accept =
    kind === "pdf"
      ? { accept: ".pdf,application/pdf", inputHints: "PDF" }
      : kind === "video"
        ? { accept: "video/*", inputHints: "MP4, MOV, WEBM" }
        : kind === "audio"
          ? { accept: "audio/*", inputHints: "MP3, WAV" }
          : kind === "gif"
            ? { accept: "image/gif,video/*", inputHints: "GIF, MP4" }
            : { accept: "image/*", inputHints: "JPG, PNG, WEBP" };
  return def({ slug, label, menuGroup: "compress", template: "compressor", kind, ...accept, ...extra });
}

function tool(slug: string, label: string, template: ToolRecord["template"], kind: ToolKind, extra?: Partial<ToolRecord>) {
  return def({ slug, label, menuGroup: "tools", template, kind, ...extra });
}

function api(slug: string, label: string) {
  return def({
    slug,
    label,
    menuGroup: "api",
    category: "api",
    template: "api-landing",
    kind: "api",
    tagline: `${label} — developer documentation and job builder (demo).`,
    convertLabel: "View docs",
    referencePath: slug.replace(/-api$/, ""),
  });
}

function ext(slug: string, label: string, url: string) {
  return def({
    slug,
    label,
    menuGroup: "tools",
    category: "external",
    template: "external",
    kind: "utility",
    execution: "unavailable",
    externalUrl: url,
    tagline: `Opens ${label} on a partner site (external). Files are not sent from this demo.`,
    convertLabel: "Open",
    referencePath: slug,
  });
}

/** All first-party catalog tools (spec §3 minimum). */
export const TOOL_DEFINITIONS: ToolRecord[] = [
  // A — category landings
  conv("video-converter", "Video Converter", "video", {
    template: "category",
    inputHints: "MP4, MOV, AVI, MKV, WEBM",
    accept: "video/*",
    outputFormats: [...VIDEO_OUTPUTS],
    defaultOutput: "MP4",
    tagline: "Convert videos online, for free.",
    execution: "demo",
  }),
  conv("audio-converter", "Audio Converter", "audio", {
    template: "category",
    accept: "audio/*",
    inputHints: "MP3, WAV, OGG, M4A, FLAC",
    outputFormats: [...AUDIO_OUTPUTS],
    defaultOutput: "MP3",
    tagline: "Convert audio online, for free.",
  }),
  conv("mp3-converter", "MP3 Converter", "audio", {
    template: "category",
    accept: "audio/*",
    outputFormats: [...AUDIO_OUTPUTS],
    defaultOutput: "MP3",
  }),
  conv("mp4-converter", "MP4 Converter", "video", {
    template: "category",
    accept: "video/*",
    outputFormats: [...VIDEO_OUTPUTS],
    defaultOutput: "MP4",
  }),
  conv("image-converter", "Image Converter", "image", {
    template: "category",
    accept: "image/*",
    inputHints: "JPG, PNG, WEBP, HEIC, GIF, BMP, SVG, TIFF",
    outputFormats: [...IMAGE_OUTPUTS],
    defaultOutput: "JPG",
    tagline: "Convert images online, for free.",
    execution: "browser-local",
    convertLabel: "Convert",
  }),
  conv("svg-converter", "SVG Converter", "image", {
    template: "category",
    accept: "image/*,.svg",
    outputFormats: ["PNG", "JPG", "WEBP", "SVG", "PDF"],
    defaultOutput: "PNG",
  }),
  conv("pdf-converter", "PDF Converter", "pdf", {
    template: "category",
    accept: ".pdf,application/pdf",
    outputFormats: [...PDF_OUTPUTS],
    defaultOutput: "PDF",
    tagline: "Convert PDFs online, for free.",
  }),
  conv("document-converter", "Document Converter", "word", {
    template: "category",
    outputFormats: [...DOCUMENT_OUTPUTS],
    defaultOutput: "PDF",
  }),
  conv("ebook-converter", "Ebook Converter", "pdf", {
    template: "category",
    outputFormats: ["EPUB", "MOBI", "PDF", "AZW3"],
    defaultOutput: "EPUB",
  }),
  conv("archive-converter", "Archive Converter", "utility", { template: "category", category: "convert" }),

  // B — pairs (from existing catalog)
  conv("mp4-to-mp3", "MP4 to MP3", "video"),
  conv("video-to-mp3", "Video to MP3", "video"),
  conv("mov-to-mp4", "MOV to MP4", "video"),
  conv("mp3-to-ogg", "MP3 to OGG", "audio"),
  conv("webp-to-png", "WEBP to PNG", "image"),
  conv("jfif-to-png", "JFIF to PNG", "image"),
  conv("png-to-svg", "PNG to SVG", "image"),
  conv("heic-to-jpg", "HEIC to JPG", "image"),
  conv("heic-to-png", "HEIC to PNG", "image"),
  conv("webp-to-jpg", "WEBP to JPG", "image"),
  conv("pdf-to-word", "PDF to Word", "word", { defaultOutput: "DOCX", outputFormats: ["DOCX"] }),
  conv("pdf-to-jpg", "PDF to JPG", "image"),
  conv("pdf-to-epub", "PDF to EPUB", "pdf"),
  conv("epub-to-pdf", "EPUB to PDF", "pdf"),
  conv("epub-to-mobi", "EPUB to MOBI", "pdf"),
  conv("heic-to-pdf", "HEIC to PDF", "pdf"),
  conv("docx-to-pdf", "DOCX to PDF", "pdf"),
  conv("jpg-to-pdf", "JPG to PDF", "pdf"),
  conv("image-to-pdf", "Image to PDF", "pdf"),
  conv("video-to-gif", "Video to GIF", "gif"),
  conv("mp4-to-gif", "MP4 to GIF", "gif"),
  conv("webm-to-gif", "WEBM to GIF", "gif"),
  conv("apng-to-gif", "APNG to GIF", "gif"),
  conv("gif-to-mp4", "GIF to MP4", "gif"),
  conv("gif-to-apng", "GIF to APNG", "gif"),
  conv("image-to-gif", "Image to GIF", "gif"),
  conv("mov-to-gif", "MOV to GIF", "gif"),
  conv("avi-to-gif", "AVI to GIF", "gif"),
  conv("rar-to-zip", "RAR to ZIP", "utility", { category: "convert" }),
  conv("unit-converter", "Unit Converter", "utility", { template: "calculator", category: "calculator", execution: "browser-local" }),
  conv("time-converter", "Time Converter", "utility", { template: "calculator", category: "calculator", execution: "browser-local" }),

  // C — compressors
  cmp("video-compressor", "Video Compressor", "video"),
  cmp("mp3-compressor", "MP3 Compressor", "audio"),
  cmp("wav-compressor", "WAV Compressor", "audio"),
  cmp("image-compressor", "Image Compressor", "image"),
  cmp("compress-jpeg", "JPEG Compressor", "image"),
  cmp("compress-png", "PNG Compressor", "image"),
  cmp("compress-pdf", "PDF Compressor", "pdf"),
  cmp("gif-compressor", "GIF Compressor", "gif"),

  // D — media
  tool("crop-video", "Crop Video", "media-editor", "video"),
  tool("trim-video", "Trim Video", "media-editor", "video", { route: "video-trimmer", referencePath: "video-trimmer" }),
  tool("gif-maker", "GIF Maker", "media-editor", "gif"),

  // E — PDF
  tool("merge-pdf", "PDF Merge", "pdf-operation", "utility"),
  tool("split-pdf", "PDF Split", "pdf-operation", "utility"),
  tool("flatten-pdf", "Flatten PDF", "pdf-operation", "utility"),
  tool("resize-pdf", "Resize PDF", "pdf-operation", "utility"),
  tool("unlock-pdf", "Unlock PDF", "pdf-operation", "utility"),
  tool("rotate-pdf", "Rotate PDF", "pdf-operation", "utility"),
  tool("protect-pdf", "Protect PDF", "pdf-operation", "utility", { referencePath: "password-protect-pdf" }),
  tool("crop-pdf", "Crop PDF", "pdf-operation", "utility"),
  tool("organize-pdf", "Organize PDF", "pdf-operation", "utility"),
  tool("extract-image-from-pdf", "Extract Images from PDF", "pdf-operation", "utility", {
    referencePath: "extract-images-from-pdf",
  }),
  tool("pdf-page-remover", "PDF Page Remover", "pdf-operation", "utility"),
  tool("extract-pages-from-pdf", "Extract Pages from PDF", "pdf-operation", "utility"),

  // F — calculators
  conv("lbs-to-kg", "Lbs to Kg", "utility", {
    template: "calculator",
    category: "calculator",
    menuGroup: "convert",
    execution: "browser-local",
  }),
  conv("kg-to-lbs", "Kg to Lbs", "utility", { template: "calculator", category: "calculator", menuGroup: "convert", execution: "browser-local" }),
  conv("feet-to-meters", "Feet to Meters", "utility", { template: "calculator", category: "calculator", menuGroup: "convert", execution: "browser-local" }),
  conv("pst-to-est", "PST to EST", "utility", { template: "calculator", category: "calculator", menuGroup: "convert", execution: "browser-local" }),
  conv("cst-to-est", "CST to EST", "utility", { template: "calculator", category: "calculator", menuGroup: "convert", execution: "browser-local" }),

  // G — external (ImageResizer / ProPDF per spec)
  ext("resize-image", "Resize Image", "https://www.imageresizer.com/"),
  ext("crop-image", "Crop Image", "https://www.imageresizer.com/"),
  ext("color-picker", "Color Picker", "https://www.imageresizer.com/"),
  ext("rotate-image", "Rotate Image", "https://www.imageresizer.com/"),
  ext("flip-image", "Flip Image", "https://www.imageresizer.com/"),
  ext("image-enlarger", "Image Enlarger", "https://www.imageresizer.com/"),
  ext("edit-pdf", "Edit PDF", "https://www.propdf.com/"),
  ext("annotate-pdf", "Annotate PDF", "https://www.propdf.com/"),
  ext("e-sign", "E-sign", "https://www.propdf.com/"),
  ext("create-fillable-pdf", "Create Fillable PDF", "https://www.propdf.com/"),
  ext("pdf-reader", "PDF Reader", "https://www.propdf.com/"),

  // API landings
  api("api-job-builder", "API Job Builder"),
  api("api-documentation", "API Documentation"),
  api("file-conversion-api", "File Conversion API"),
  api("image-conversion-api", "Image Conversion API"),
  api("audio-conversion-api", "Audio Conversion API"),
  api("document-conversion-api", "Document Conversion API"),
  api("pdf-conversion-api", "PDF Conversion API"),
  api("mp4-conversion-api", "MP4 Conversion API"),
  api("video-conversion-api", "Video Conversion API"),
  api("jpg-to-pdf-api", "JPG to PDF API"),
  api("video-to-mp3-api", "Video to MP3 API"),
  api("heic-to-jpg-api", "HEIC to JPG API"),
  api("pdf-to-jpg-api", "PDF to JPG API"),
  api("webp-to-png-api", "Webp to PNG API"),
  api("pdf-to-word-api", "PDF to WORD API"),
  api("mp4-to-mp3-api", "MP4 to MP3 API"),
  api("webp-to-jpg-api", "Webp to JPG API"),
  api("word-to-pdf-api", "WORD to PDF API"),
  api("html-to-pdf-api", "HTML to PDF API"),
  api("website-screenshot-api", "Website Screenshot API"),
  api("video-compression-api", "Video Compression API"),
  api("compress-pdf-api", "Compress PDF API"),
  api("image-compression-api", "Image Compression API"),

  // Card Scanner–only
  def({
    slug: "bank-statement",
    route: "bank-statement-converter",
    label: "Bank Statement Converter",
    menuGroup: "tools",
    template: "conversion",
    kind: "ocr",
    category: "convert",
    execution: "demo",
    inputHints: "PDF, JPG, PNG",
    accept: "image/*,.pdf",
    tagline: "Extract tables from bank statements (demo OCR).",
    referencePath: "bank-statement",
  }),
];

export const REFERENCE_ORIGIN = REF;
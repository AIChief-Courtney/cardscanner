export type OutputFormatGroup = { id: string; label: string; formats: string[] };

/** Mirrors freeconvert.com pdf-converter output categories (Document grid + sidebar). */
export const PDF_CONVERTER_OUTPUT_GROUPS: OutputFormatGroup[] = [
  {
    id: "ebook",
    label: "Ebook",
    formats: ["EPUB", "MOBI", "AZW3", "FB2"],
  },
  {
    id: "image",
    label: "Image",
    formats: ["JPG", "JPEG", "PNG", "WEBP", "TIFF", "BMP", "GIF", "SVG"],
  },
  {
    id: "document",
    label: "Document",
    formats: [
      "DOC",
      "DOCX",
      "EXCEL",
      "HTML",
      "ODT",
      "PDF",
      "PPT",
      "PPTX",
      "PS",
      "RTF",
      "TEXT",
      "TXT",
      "WORD",
      "XLS",
      "XLSX",
    ],
  },
  {
    id: "report",
    label: "Report",
    formats: ["CSV", "XLS", "XLSX", "PDF"],
  },
];

export const PDF_CONVERTER_OUTPUT_FORMATS = [
  ...new Set(PDF_CONVERTER_OUTPUT_GROUPS.flatMap((g) => g.formats)),
];
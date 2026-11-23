export type OutputFormatGroup = { id: string; label: string; formats: string[] };

/** pdf-convert / pdf-converter sidebar: Ebook, Image, Document (per FreeConvert). */
export const PDF_CONVERTER_OUTPUT_GROUPS: OutputFormatGroup[] = [
  {
    id: "ebook",
    label: "Ebook",
    formats: ["EPUB", "MOBI", "AZW3", "FB2", "LIT", "LRF", "PDB"],
  },
  {
    id: "image",
    label: "Image",
    formats: ["JPG", "JPEG", "PNG", "WEBP", "TIFF", "BMP", "GIF", "SVG", "ICO", "HEIC", "TGA"],
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
      "CSV",
    ],
  },
];

export function usesFcOutputPicker(slug: string, route?: string): boolean {
  if (slug === "pdf-converter") return true;
  if (route === "pdf-convert" || route === "pdf-converter") return true;
  return false;
}

export const PDF_CONVERTER_OUTPUT_FORMATS = [
  ...new Set(PDF_CONVERTER_OUTPUT_GROUPS.flatMap((g) => g.formats)),
];
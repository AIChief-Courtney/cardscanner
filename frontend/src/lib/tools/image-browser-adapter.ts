import type { DemoJobResult, ToolRecord } from "@/lib/tools/types";

export type ImageBrowserRequest = {
  tool: ToolRecord;
  fileEntries: { id: string; file: File }[];
  outputFormat?: string;
  quality?: number;
};

const MIME: Record<string, string> = {
  JPG: "image/jpeg",
  JPEG: "image/jpeg",
  PNG: "image/png",
  WEBP: "image/webp",
  GIF: "image/gif",
  BMP: "image/bmp",
};

function extFor(format: string): string {
  const f = format.toLowerCase();
  if (f === "jpg" || f === "jpeg") return "jpg";
  return f;
}

async function convertFile(file: File, format: string, quality: number): Promise<{ name: string; url: string; size: number } | null> {
  const mime = MIME[format.toUpperCase()];
  if (!mime || !file.type.startsWith("image/")) return null;
  if (format.toUpperCase() === "PDF" || format.toUpperCase() === "TIFF" || format.toUpperCase() === "ICO") {
    return null;
  }
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), mime, quality / 100),
  );
  if (!blob) return null;
  const base = file.name.replace(/\.[^.]+$/, "");
  return {
    name: `${base}.${extFor(format)}`,
    url: URL.createObjectURL(blob),
    size: blob.size,
  };
}

export async function processImageBrowser(
  request: ImageBrowserRequest,
): Promise<DemoJobResult & { downloads?: { id: string; name: string; url: string; size: number }[] }> {
  const format = request.outputFormat ?? request.tool.defaultOutput ?? "JPG";
  const quality = request.quality ?? 85;
  const downloads: { id: string; name: string; url: string; size: number }[] = [];
  for (const item of request.fileEntries) {
    const out = await convertFile(item.file, format, quality);
    if (out) downloads.push({ id: item.id, ...out });
  }
  if (downloads.length === 0) {
    return {
      status: "failed",
      message: "Browser conversion supports JPG, PNG, WEBP, and GIF from raster images in this build.",
      sampleOutput: true,
    };
  }
  return {
    status: "complete",
    message: `Converted ${downloads.length} file(s) in your browser to ${format}.`,
    outputLabel: format,
    sampleOutput: false,
    downloads,
  };
}
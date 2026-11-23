import { Code2, FileSpreadsheet, FileText, FileType2, Film, IdCard, ImageIcon, Music, Wrench } from "lucide-react";
import type { ToolKind } from "@/lib/user-tools";

const LABELS: Record<ToolKind, string> = {
  text: "Text",
  word: "Word",
  excel: "Excel",
  pdf: "PDF",
  image: "Image",
  video: "Video",
  audio: "Audio",
  gif: "GIF",
  ocr: "OCR",
  utility: "Tool",
  api: "API",
};

export function ToolTypeIcon({ kind, size = 18 }: { kind: ToolKind; size?: number }) {
  const className = `tool-type-icon tool-type-icon--${kind}`;

  if (kind === "word") {
    return (
      <span className={className} aria-hidden>
        <FileType2 size={size} />
      </span>
    );
  }
  if (kind === "excel") {
    return (
      <span className={className} aria-hidden>
        <FileSpreadsheet size={size} />
      </span>
    );
  }
  if (kind === "pdf") {
    return (
      <span className={className} aria-hidden>
        <FileText size={size} />
      </span>
    );
  }
  if (kind === "image") {
    return (
      <span className={className} aria-hidden>
        <ImageIcon size={size} />
      </span>
    );
  }
  if (kind === "video" || kind === "gif") {
    return (
      <span className={className} aria-hidden>
        <Film size={size} />
      </span>
    );
  }
  if (kind === "audio") {
    return (
      <span className={className} aria-hidden>
        <Music size={size} />
      </span>
    );
  }
  if (kind === "ocr") {
    return (
      <span className={className} aria-hidden>
        <IdCard size={size} />
      </span>
    );
  }
  if (kind === "api") {
    return (
      <span className={className} aria-hidden>
        <Code2 size={size} />
      </span>
    );
  }
  if (kind === "utility") {
    return (
      <span className={className} aria-hidden>
        <Wrench size={size} />
      </span>
    );
  }

  return (
    <span className={className} aria-hidden title={LABELS[kind]}>
      <FileText size={size} />
    </span>
  );
}
import type { QueuedFile } from "@/lib/tools/types";
import type { ToolPageMeta } from "@/lib/tool-registry";

const id = () => crypto.randomUUID();

export function validateIncomingFile(file: File, meta: ToolPageMeta, existingNames: Set<string>): QueuedFile {
  if (file.size === 0) {
    return { id: id(), name: file.name, size: 0, status: "invalid", error: "Empty file" };
  }
  if (existingNames.has(file.name)) {
    return { id: id(), name: file.name, size: file.size, status: "invalid", error: "Duplicate file in queue" };
  }
  const maxBytes = meta.maxSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return { id: id(), name: file.name, size: file.size, status: "oversized", error: `Over ${meta.maxSizeMb} MB limit` };
  }
  if (meta.accept && meta.accept !== "*/*" && meta.accept !== "") {
    const ok = fileMatchesAccept(file, meta.accept);
    if (!ok) {
      return {
        id: id(),
        name: file.name,
        size: file.size,
        status: "unsupported",
        error: "File type not supported for this tool",
      };
    }
  }
  const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
  return { id: id(), name: file.name, size: file.size, status: "valid", previewUrl };
}

function fileMatchesAccept(file: File, accept: string): boolean {
  const parts = accept.split(",").map((p) => p.trim().toLowerCase());
  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();
  for (const part of parts) {
    if (part === "*/*") return true;
    if (part.startsWith(".")) {
      if (name.endsWith(part)) return true;
      continue;
    }
    if (part.endsWith("/*")) {
      const prefix = part.slice(0, part.indexOf("/"));
      if (type.startsWith(`${prefix}/`)) return true;
      continue;
    }
    if (type === part) return true;
  }
  return parts.length === 0;
}

export function isValidUrlSyntax(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  try {
    const u = new URL(trimmed);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
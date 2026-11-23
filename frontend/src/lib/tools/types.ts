import type { ToolKind } from "@/lib/user-tools";

export type ToolTemplate =
  | "category"
  | "conversion"
  | "compressor"
  | "media-editor"
  | "pdf-operation"
  | "calculator"
  | "api-landing"
  | "external";

export type ExecutionMode = "demo" | "browser-local" | "integrated" | "unavailable";

export type ToolRecord = {
  slug: string;
  route: string;
  aliases?: string[];
  label: string;
  category: "convert" | "compress" | "tools" | "api" | "calculator" | "external" | "other";
  menuGroup: "convert" | "compress" | "tools" | "api" | "other";
  template: ToolTemplate;
  kind: ToolKind;
  keywords: string[];
  referencePath: string;
  execution: ExecutionMode;
  externalUrl?: string;
  inputHints: string;
  accept: string;
  outputFormats?: string[];
  defaultOutput?: string;
  maxFiles: number;
  maxSizeMb: number;
  h1: string;
  tagline: string;
  convertLabel: string;
};

export type ToolMenuColumn = {
  id: string;
  title: string;
  toolSlugs: string[];
};

export type JobStatus =
  | "ready"
  | "submitting"
  | "queued"
  | "processing"
  | "complete"
  | "failed"
  | "canceled"
  | "expired";

export type QueuedFile = {
  id: string;
  name: string;
  size: number;
  status: "valid" | "invalid" | "oversized" | "unsupported";
  error?: string;
  previewUrl?: string;
};

export type DemoJobResult = {
  status: JobStatus;
  message: string;
  outputLabel?: string;
  sampleOutput?: boolean;
};
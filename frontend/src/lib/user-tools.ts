export type ToolKind =
  | "text"
  | "word"
  | "excel"
  | "pdf"
  | "image"
  | "video"
  | "audio"
  | "gif"
  | "ocr"
  | "utility"
  | "api";

export type UserTool = {
  slug: string;
  label: string;
  kind: ToolKind;
};

export type UserToolCategory = {
  id: string;
  title: string;
  tools: UserTool[];
};
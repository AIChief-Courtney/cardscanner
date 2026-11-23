"use client";

import type { ToolPageMeta } from "@/lib/tool-registry";
import { FileWorkspace } from "@/components/user/file-workspace";

export function ToolWorkspace({ meta }: { meta: ToolPageMeta }) {
  return <FileWorkspace meta={meta} />;
}
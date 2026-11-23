"use client";

import type { ToolPageMeta } from "@/lib/tool-registry";
import { FileWorkspace } from "@/components/user/file-workspace";

export function HomeWorkspace({ meta }: { meta: ToolPageMeta }) {
  return (
    <section className="home-workspace panel" aria-labelledby="home-workspace-title">
      <h2 id="home-workspace-title">Convert files</h2>
      <p className="home-workspace-lead">Start with the image converter — same workspace as tool pages, no sign-in required.</p>
      <FileWorkspace meta={meta} />
    </section>
  );
}
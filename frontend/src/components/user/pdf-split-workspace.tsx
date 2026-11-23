"use client";

import { useState } from "react";
import type { ToolPageMeta } from "@/lib/tool-registry";
import { FileWorkspace } from "@/components/user/file-workspace";

export function PdfSplitWorkspace({ meta }: { meta: ToolPageMeta }) {
  const [mode, setMode] = useState<"range" | "pages">("range");
  const [range, setRange] = useState("1-3");
  const expected = mode === "range" && /^\d+\s*-\s*\d+$/.test(range) ? 3 : 1;

  return (
    <main id="main-content" className="tool-page tool-page--filedock">
      <header className="tool-page-hero">
        <h1>{meta.h1}</h1>
        <p className="tool-page-tagline">{meta.tagline}</p>
      </header>
      <div className="panel pdf-split-options">
        <fieldset>
          <legend>Split mode</legend>
          <label>
            <input type="radio" checked={mode === "range"} onChange={() => setMode("range")} /> Page range
          </label>
          <label>
            <input type="radio" checked={mode === "pages"} onChange={() => setMode("pages")} /> Extract every page
          </label>
        </fieldset>
        {mode === "range" && (
          <label>
            Range (e.g. 1-3)
            <input value={range} onChange={(e) => setRange(e.target.value)} aria-invalid={!range.trim()} />
          </label>
        )}
        <p>Expected outputs: ~{expected} file(s) (demo estimate)</p>
      </div>
      <FileWorkspace meta={meta} />
    </main>
  );
}
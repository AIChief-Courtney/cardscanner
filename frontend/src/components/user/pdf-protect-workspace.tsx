"use client";

import { useState } from "react";
import type { ToolPageMeta } from "@/lib/tool-registry";
import { FileWorkspace } from "@/components/user/file-workspace";

export function PdfProtectWorkspace({ meta }: { meta: ToolPageMeta }) {
  const [password, setPassword] = useState("");
  return (
    <main id="main-content" className="tool-page tool-page--filedock">
      <header className="tool-page-hero">
        <h1>{meta.h1}</h1>
        <p className="tool-page-tagline">{meta.tagline}</p>
      </header>
      <div className="panel">
        <p className="tool-demo-banner">Password is not stored — demo only.</p>
        <label>
          {meta.slug === "unlock-pdf" ? "Current document password" : "Document password"}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </label>
      </div>
      <FileWorkspace meta={meta} />
    </main>
  );
}
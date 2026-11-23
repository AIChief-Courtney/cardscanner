"use client";

import { useState } from "react";
import type { ToolPageMeta } from "@/lib/tool-registry";
import { FileWorkspace } from "@/components/user/file-workspace";

type Item = { id: string; name: string };

export function PdfMergeWorkspace({ meta }: { meta: ToolPageMeta }) {
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "Document A.pdf" },
    { id: "2", name: "Document B.pdf" },
  ]);

  function move(id: string, dir: -1 | 1) {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <main id="main-content" className="tool-page tool-page--filedock">
      <header className="tool-page-hero">
        <h1>{meta.h1}</h1>
        <p className="tool-page-tagline">{meta.tagline}</p>
      </header>
      <div className="panel pdf-merge-order">
        <h2>Document order</h2>
        <p className="tool-demo-banner">Reorder merged PDFs before export (demo list).</p>
        <ol className="pdf-merge-list">
          {items.map((item, index) => (
            <li key={item.id}>
              <span>
                {index + 1}. {item.name}
              </span>
              <span className="pdf-merge-actions">
                <button type="button" className="text-link" onClick={() => move(item.id, -1)} disabled={index === 0}>
                  Up
                </button>
                <button type="button" className="text-link" onClick={() => move(item.id, 1)} disabled={index === items.length - 1}>
                  Down
                </button>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <FileWorkspace meta={meta} />
    </main>
  );
}
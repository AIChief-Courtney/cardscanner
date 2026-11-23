"use client";

import { useCallback, useState } from "react";
import type { ToolPageMeta } from "@/lib/tool-registry";
import { FileWorkspace } from "@/components/user/file-workspace";

type PageThumb = { id: string; label: string; rotation: number };

const SAMPLE: PageThumb[] = [
  { id: "p1", label: "Page 1", rotation: 0 },
  { id: "p2", label: "Page 2", rotation: 0 },
  { id: "p3", label: "Page 3", rotation: 0 },
];

export function PdfOrganizeWorkspace({ meta }: { meta: ToolPageMeta }) {
  const [pages, setPages] = useState(SAMPLE);
  const [focusId, setFocusId] = useState<string | null>(null);

  const move = useCallback((id: string, dir: -1 | 1) => {
    setPages((prev) => {
      const i = prev.findIndex((p) => p.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }, []);

  function onKey(id: string, e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      move(id, -1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      move(id, 1);
    }
    if (e.key === "r") {
      setPages((prev) => prev.map((p) => (p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p)));
    }
  }

  return (
    <main id="main-content" className="tool-page tool-page--filedock">
      <header className="tool-page-hero">
        <h1>{meta.h1}</h1>
        <p className="tool-page-tagline">{meta.tagline}</p>
      </header>
      <div className="panel pdf-organize">
        <p className="tool-demo-banner">Reorder with pointer or keyboard (← → move, R rotate).</p>
        <ul className="pdf-thumb-grid">
          {pages.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className={`pdf-thumb ${focusId === p.id ? "pdf-thumb--focus" : ""}`}
                style={{ transform: `rotate(${p.rotation}deg)` }}
                onClick={() => setFocusId(p.id)}
                onKeyDown={(e) => onKey(p.id, e)}
              >
                {p.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <FileWorkspace meta={meta} />
    </main>
  );
}
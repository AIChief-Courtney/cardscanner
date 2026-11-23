"use client";

import { useState } from "react";
import type { ToolPageMeta } from "@/lib/tool-registry";
import { FileWorkspace } from "@/components/user/file-workspace";

function parseTime(s: string): number | null {
  const m = /^(\d+):(\d{2})(?:\.(\d+))?$/.exec(s.trim());
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]) + (m[3] ? Number(`0.${m[3]}`) : 0);
}

export function VideoTrimWorkspace({ meta }: { meta: ToolPageMeta }) {
  const [duration, setDuration] = useState(120);
  const [start, setStart] = useState("0:00");
  const [end, setEnd] = useState("0:30");
  const startSec = parseTime(start);
  const endSec = parseTime(end);
  const invalid =
    startSec === null || endSec === null || startSec < 0 || endSec > duration || endSec <= startSec;
  const span = startSec !== null && endSec !== null && !invalid ? endSec - startSec : 0;

  return (
    <main id="main-content" className="tool-page tool-page--filedock">
      <header className="tool-page-hero">
        <h1>{meta.h1}</h1>
        <p className="tool-page-tagline">{meta.tagline}</p>
      </header>
      <div className="panel dedicated-trim">
        <p className="tool-demo-banner">Set trim bounds (demo). Duration assumed {duration}s until preview loads.</p>
        <label>
          Assumed duration (seconds)
          <input
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>
        <div className="trim-controls">
          <label>
            Start (m:ss)
            <input value={start} onChange={(e) => setStart(e.target.value)} aria-invalid={invalid} />
          </label>
          <label>
            End (m:ss)
            <input value={end} onChange={(e) => setEnd(e.target.value)} aria-invalid={invalid} />
          </label>
          {invalid ? (
            <p className="tool-queue-error" role="alert">
              End must be after start and within duration.
            </p>
          ) : (
            <p>Selected span: {span.toFixed(1)}s</p>
          )}
        </div>
      </div>
      <FileWorkspace meta={meta} />
    </main>
  );
}
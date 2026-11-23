"use client";

import { useMemo, useState } from "react";
import type { ToolPageMeta } from "@/lib/tool-registry";

const ZONES = [
  { id: "America/Los_Angeles", label: "Pacific (PT)" },
  { id: "America/Chicago", label: "Central (CT)" },
  { id: "America/New_York", label: "Eastern (ET)" },
];

const PRESETS: Record<string, { from: string; to: string }> = {
  "pst-to-est": { from: "America/Los_Angeles", to: "America/New_York" },
  "cst-to-est": { from: "America/Chicago", to: "America/New_York" },
  "time-converter": { from: "America/Los_Angeles", to: "America/New_York" },
};

function formatInZone(date: Date, zone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    dateStyle: "medium",
    timeStyle: "short",
    timeZoneName: "short",
  }).format(date);
}

export function TimeCalculator({ meta }: { meta: ToolPageMeta }) {
  const preset = PRESETS[meta.slug] ?? PRESETS["time-converter"];
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [from, setFrom] = useState(preset.from);
  const [to, setTo] = useState(preset.to);

  const parts = useMemo(() => {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return { fromLabel: "Invalid", toLabel: "Invalid", note: "" };
    const fromLabel = formatInZone(d, from);
    const toLabel = formatInZone(d, to);
    const fromDay = new Intl.DateTimeFormat("en-US", { timeZone: from, day: "numeric" }).format(d);
    const toDay = new Intl.DateTimeFormat("en-US", { timeZone: to, day: "numeric" }).format(d);
    const note = fromDay !== toDay ? "Note: day rolls over between zones (DST-aware regional time)." : "";
    return { fromLabel, toLabel, note };
  }, [date, from, to]);

  return (
    <main id="main-content" className="tool-page tool-page--filedock">
      <header className="tool-page-hero">
        <h1>{meta.h1}</h1>
        <p className="tool-page-tagline">Uses IANA zones with DST — not fixed UTC offsets.</p>
      </header>
      <div className="panel calculator-panel">
        <label>
          Local date &amp; time
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <div className="calc-unit-row">
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            {ZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
          <span aria-hidden>→</span>
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            {ZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
        </div>
        <dl className="calc-time-results">
          <div>
            <dt>From</dt>
            <dd>{parts.fromLabel}</dd>
          </div>
          <div>
            <dt>To</dt>
            <dd>{parts.toLabel}</dd>
          </div>
        </dl>
        {parts.note ? <p className="calc-rollover">{parts.note}</p> : null}
      </div>
    </main>
  );
}
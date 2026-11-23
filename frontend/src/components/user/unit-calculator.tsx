"use client";

import { useMemo, useState } from "react";
import type { ToolPageMeta } from "@/lib/tool-registry";

type UnitKey = "lb" | "kg" | "ft" | "m";

const LABELS: Record<UnitKey, string> = { lb: "Pounds", kg: "Kilograms", ft: "Feet", m: "Meters" };

const PRESETS: Record<string, { from: UnitKey; to: UnitKey; units: UnitKey[] }> = {
  "lbs-to-kg": { from: "lb", to: "kg", units: ["lb", "kg"] },
  "kg-to-lbs": { from: "kg", to: "lb", units: ["lb", "kg"] },
  "feet-to-meters": { from: "ft", to: "m", units: ["ft", "m"] },
  "unit-converter": { from: "lb", to: "kg", units: ["lb", "kg", "ft", "m"] },
};

function convert(n: number, from: UnitKey, to: UnitKey): number {
  if (from === to) return n;
  if ((from === "lb" || from === "kg") && (to === "lb" || to === "kg")) {
    const kg = from === "lb" ? n * 0.45359237 : n;
    return to === "kg" ? kg : kg * 2.2046226218;
  }
  const meters = from === "ft" ? n * 0.3048 : n;
  return to === "ft" ? meters / 0.3048 : meters;
}

export function UnitCalculator({ meta }: { meta: ToolPageMeta }) {
  const preset = PRESETS[meta.slug] ?? PRESETS["unit-converter"];
  const [fromUnit, setFromUnit] = useState<UnitKey>(preset.from);
  const [toUnit, setToUnit] = useState<UnitKey>(preset.to);
  const [value, setValue] = useState("1");
  const units = preset.units;

  const result = useMemo(() => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "—";
    return convert(n, fromUnit, toUnit)
      .toFixed(4)
      .replace(/\.?0+$/, "");
  }, [value, fromUnit, toUnit]);

  return (
    <main id="main-content" className="tool-page tool-page--filedock">
      <header className="tool-page-hero">
        <h1>{meta.h1}</h1>
        <p className="tool-page-tagline">Runs entirely in your browser — no upload.</p>
      </header>
      <div className="panel calculator-panel">
        <label>
          Amount
          <input inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        <div className="calc-unit-row">
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value as UnitKey)}>
            {units.map((u) => (
              <option key={u} value={u}>
                {LABELS[u]}
              </option>
            ))}
          </select>
          <span aria-hidden>→</span>
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value as UnitKey)}>
            {units.map((u) => (
              <option key={u} value={u}>
                {LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        <p className="calc-result" aria-live="polite">
          = {result} {LABELS[toUnit]}
        </p>
      </div>
    </main>
  );
}
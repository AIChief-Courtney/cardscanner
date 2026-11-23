"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import type { OutputFormatGroup } from "@/lib/tools/pdf-converter-outputs";

type Props = {
  groups: OutputFormatGroup[];
  value: string;
  onChange: (fmt: string) => void;
  label?: string;
  /** Compact “Output: DOCX” control (queue row). */
  compact?: boolean;
};

function groupForFormat(groups: OutputFormatGroup[], fmt: string): string {
  for (const g of groups) {
    if (g.formats.includes(fmt)) return g.id;
  }
  return groups[0]?.id ?? "document";
}

export function FcOutputFormatPicker({ groups, value, onChange, label = "Output", compact }: Props) {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(() => groupForFormat(groups, value));
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const active = groups.find((g) => g.id === activeGroup) ?? groups[0];
  const filteredFormats = useMemo(() => {
    const q = search.trim().toLowerCase();
    const pool = q
      ? groups.flatMap((g) => g.formats)
      : active?.formats ?? [];
    const unique = [...new Set(pool)];
    if (!q) return unique;
    return unique.filter((f) => f.toLowerCase().includes(q));
  }, [active, groups, search]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`fc-output-picker ${compact ? "fc-output-picker--compact" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="fc-output-picker-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="fc-output-picker-label">{label}:</span>
        <span className="fc-output-picker-value">{value}</span>
        <ChevronDown size={16} aria-hidden className={open ? "fc-output-picker-chevron--open" : ""} />
      </button>

      {open ? (
        <div id={panelId} className="fc-output-picker-panel" role="dialog" aria-label="Choose output format">
          <label className="fc-output-picker-search">
            <Search size={18} aria-hidden />
            <input
              type="search"
              placeholder="Search Format"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <div className="fc-output-picker-body">
            <nav className="fc-output-picker-categories" aria-label="Format categories">
              {groups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={`fc-output-picker-category ${g.id === activeGroup ? "fc-output-picker-category--active" : ""}`}
                  onClick={() => {
                    setActiveGroup(g.id);
                    setSearch("");
                  }}
                >
                  {g.label}
                </button>
              ))}
            </nav>
            <div className="fc-output-picker-grid" role="listbox" aria-label="Formats">
              {filteredFormats.map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  role="option"
                  aria-selected={value === fmt}
                  className={`fc-output-picker-tile ${value === fmt ? "fc-output-picker-tile--active" : ""}`}
                  onClick={() => {
                    onChange(fmt);
                    setOpen(false);
                    setActiveGroup(groupForFormat(groups, fmt));
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
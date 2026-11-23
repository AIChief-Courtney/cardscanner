"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  return "document";
}

export function FcOutputFormatPicker({ groups, value, onChange, label = "Output", compact }: Props) {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(() => groupForFormat(groups, value));
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0, width: 420 });
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const active = groups.find((g) => g.id === activeGroup) ?? groups.find((g) => g.id === "document") ?? groups[0];
  const filteredFormats = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q) {
      const hits: string[] = [];
      for (const g of groups) {
        for (const fmt of g.formats) {
          if (fmt.toLowerCase().includes(q)) hits.push(fmt);
        }
      }
      return [...new Set(hits)];
    }
    return active?.formats ?? [];
  }, [active, groups, search]);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!open || !rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const width = Math.min(420, window.innerWidth - 16);
    let left = compact ? rect.left : rect.right - width;
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
    const top = rect.bottom + 8;
    setPanelPos({ top, left, width });
  }, [open, compact]);

  useEffect(() => {
    if (open) {
      setActiveGroup(groupForFormat(groups, value));
      setSearch("");
    }
  }, [open, value, groups]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        const panel = document.getElementById(panelId);
        if (panel?.contains(e.target as Node)) return;
        setOpen(false);
      }
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
  }, [open, panelId]);

  const panel = open ? (
    <div
      id={panelId}
      className="fc-output-picker-panel fc-output-picker-panel--portal"
      role="dialog"
      aria-label="Choose output format"
      style={{
        position: "fixed",
        top: panelPos.top,
        left: panelPos.left,
        width: panelPos.width,
        zIndex: 10000,
      }}
    >
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
              <span>{g.label}</span>
              {g.id === activeGroup ? <span className="fc-output-picker-category-chevron" aria-hidden>›</span> : null}
            </button>
          ))}
        </nav>
        <div className="fc-output-picker-grid" role="listbox" aria-label="Formats">
          {filteredFormats.map((fmt) => (
            <button
              key={`${activeGroup}-${fmt}`}
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
  ) : null;

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
      {mounted && panel ? createPortal(panel, document.body) : null}
    </div>
  );
}
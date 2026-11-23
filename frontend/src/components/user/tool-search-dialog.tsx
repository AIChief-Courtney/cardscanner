"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { searchTools, toolHref } from "@/lib/tools/registry";

export function ToolSearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = searchTools(q);

  useEffect(() => {
    if (open) {
      setQ("");
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="search-dialog-backdrop" role="presentation" onClick={onClose}>
      <dialog open className="search-dialog" aria-labelledby="search-title" onClick={(e) => e.stopPropagation()}>
        <div className="search-dialog-head">
          <h2 id="search-title">Search tools</h2>
          <button type="button" className="icon-btn" aria-label="Close search" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <SearchField q={q} setQ={setQ} inputRef={inputRef} />
        <ul className="search-results" role="listbox">
          {q && results.length === 0 ? (
            <li className="search-empty">No tools match “{q}”.</li>
          ) : (
            results.map((t) => (
              <li key={t.slug}>
                <Link href={toolHref(t.slug)} onClick={onClose} role="option">
                  {t.label}
                  <span className="search-result-meta">{t.template}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </dialog>
    </div>
  );
}

function SearchField({
  q,
  setQ,
  inputRef,
}: {
  q: string;
  setQ: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <label className="search-field">
      <Search size={18} aria-hidden />
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Formats, extensions, or tool name"
        autoComplete="off"
      />
    </label>
  );
}

export function ToolSearchTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="fc-search-btn" aria-label="Search tools" onClick={() => setOpen(true)}>
        <Search size={18} aria-hidden />
      </button>
      <ToolSearchDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { allToolRecords, toolHref } from "@/lib/tools/registry";

export function ToolDirectory({
  title,
  description,
  filter,
}: {
  title: string;
  description: string;
  filter: "convert" | "compress" | "tools" | "all";
}) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const tools = useMemo(() => {
    return allToolRecords().filter((t) => {
      if (filter === "convert" && t.menuGroup !== "convert") return false;
      if (filter === "compress" && t.menuGroup !== "compress") return false;
      if (filter === "tools" && t.menuGroup !== "tools") return false;
      if (category !== "all" && t.template !== category && t.kind !== category) return false;
      const query = q.trim().toLowerCase();
      if (!query) return true;
      return (
        t.label.toLowerCase().includes(query) ||
        t.slug.includes(query) ||
        t.keywords.some((k) => k.includes(query))
      );
    });
  }, [filter, q, category]);

  return (
    <main id="main-content" className="directory-page">
      <header className="directory-hero">
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <div className="directory-filters panel">
        <label>
          Search
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tools" />
        </label>
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All</option>
            <option value="conversion">Conversion</option>
            <option value="compressor">Compression</option>
            <option value="pdf-operation">PDF tools</option>
            <option value="media-editor">Media editors</option>
            <option value="calculator">Calculators</option>
            <option value="api-landing">API</option>
          </select>
        </label>
      </div>
      <ul className="directory-grid">
        {tools.map((t) => (
          <li key={t.slug}>
            <Link href={toolHref(t.slug)} className="directory-card">
              <strong>{t.label}</strong>
              <span>{t.tagline}</span>
              <span className="directory-card-meta">{t.execution}</span>
            </Link>
          </li>
        ))}
      </ul>
      {tools.length === 0 && <p className="search-empty">No tools match your filters.</p>}
    </main>
  );
}
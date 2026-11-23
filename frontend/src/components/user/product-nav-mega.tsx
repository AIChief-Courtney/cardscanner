"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import {
  ChevronDown,
  Clapperboard,
  Code2,
  FileText,
  Film,
  Grid3x3,
  IdCard,
  ImageIcon,
  Layers,
  ScanLine,
} from "lucide-react";
import { categoriesForNavMenu, type ProductNavMenu } from "@/lib/nav-menus";
import { toolHref } from "@/lib/tool-registry";
import { ToolNavLink } from "./tool-nav-link";

function columnIcon(columnId: string) {
  if (columnId === "video-audio") return <Clapperboard size={18} aria-hidden />;
  if (columnId === "image") return <ImageIcon size={18} aria-hidden />;
  if (columnId === "pdf") return <FileText size={18} aria-hidden />;
  if (columnId === "gif") return <Film size={18} aria-hidden />;
  if (columnId === "other") return <Grid3x3 size={18} aria-hidden />;
  if (columnId === "video-gif") return <Film size={18} aria-hidden />;
  if (columnId.startsWith("api-")) return <Code2 size={18} aria-hidden />;
  if (columnId === "ocr" || columnId === "cards") return <ScanLine size={18} aria-hidden />;
  if (columnId === "vcf") return <IdCard size={18} aria-hidden />;
  return <Layers size={18} aria-hidden />;
}

export function ProductNavMega({
  menu,
  label,
  open,
  onOpenChange,
}: {
  menu: ProductNavMenu;
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const categories = categoriesForNavMenu(menu);
  const columnCount = Math.max(1, categories.length);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <div className={`tools-mega tools-mega--${menu} ${open ? "tools-mega--open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="tools-mega-trigger nav-mega-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
      >
        {label} <ChevronDown size={16} aria-hidden className="tools-mega-chevron" />
      </button>
      <div
        id={panelId}
        className="tools-mega-panel tools-mega-panel--nav tools-mega-panel--mega"
        hidden={!open}
        role="region"
        aria-label={label}
        style={{ "--mega-cols": columnCount } as React.CSSProperties}
      >
        <div className="tools-mega-grid tools-mega-grid--nav tools-mega-grid--mega">
          {categories.map((cat) => (
            <div key={cat.id} className="tools-mega-col tools-mega-col--bordered">
              <h3 className="tools-mega-col-title">
                <span className="tools-mega-col-icon">{columnIcon(cat.id)}</span>
                {cat.title}
              </h3>
              <ul className="tools-mega-list">
                {cat.tools.map((tool) => (
                  <li key={tool.slug}>
                    <ToolNavLink className="tools-mega-link" href={toolHref(tool.slug)} onClick={close}>
                      {null}
                      <span>{tool.label}</span>
                    </ToolNavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
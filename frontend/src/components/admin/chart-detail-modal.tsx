"use client";

import { useEffect, useId } from "react";
import { X } from "lucide-react";

export function AdminChartDetailModal({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="admin-chart-modal-backdrop" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="admin-chart-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="admin-chart-modal-head">
          <div>
            <h2 id={titleId}>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button type="button" className="admin-chart-modal-close" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <div className="admin-chart-modal-body">{children}</div>
      </div>
    </div>
  );
}
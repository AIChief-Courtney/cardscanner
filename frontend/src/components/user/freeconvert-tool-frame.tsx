"use client";

import { useId } from "react";
import type { ToolPageMeta } from "@/lib/tool-registry";
import { freeConvertPath } from "@/lib/freeconvert-url";

export function FreeConvertToolFrame({ meta }: { meta: ToolPageMeta }) {
  const titleId = useId();
  const fcPath = freeConvertPath(meta.slug, meta.kind);
  if (!fcPath) return null;

  const src = `/fc/${fcPath}`;

  return (
    <section className="fc-embed-shell" aria-labelledby={titleId}>
      <h2 id={titleId} className="visually-hidden">
        {meta.h1} — FreeConvert workspace
      </h2>
      <iframe
        className="fc-embed-frame"
        title={meta.h1}
        src={src}
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
}
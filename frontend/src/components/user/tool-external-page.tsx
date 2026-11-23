import { ExternalLink } from "lucide-react";
import type { ToolPageMeta } from "@/lib/tool-registry";

export function ToolExternalPage({ meta }: { meta: ToolPageMeta }) {
  const href = meta.externalUrl ?? "#";
  return (
    <main id="main-content" className="tool-page tool-page--filedock">
      <header className="tool-page-hero">
        <h1>{meta.h1}</h1>
        <p className="tool-page-tagline">{meta.tagline}</p>
      </header>
      <ExternalPanel href={href} label={meta.label} />
    </main>
  );
}

function ExternalPanel({ href, label }: { href: string; label: string }) {
  return (
    <div className="panel tool-external-panel">
      <p className="tool-external-badge">External destination</p>
      <p>
        {label} is hosted on a partner site. We do not send files from this demo — open the tool in a new tab when you are
        ready.
      </p>
      <a className="button dark button--filedock" href={href} target="_blank" rel="noopener noreferrer">
        Open {label} <ExternalLink size={16} aria-hidden />
      </a>
    </div>
  );
}
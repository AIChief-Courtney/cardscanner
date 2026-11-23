import Link from "next/link";
import type { ToolPageMeta } from "@/lib/tool-registry";
import { freeConvertUrl } from "@/lib/freeconvert-url";
import { buildToolPageContent, toolPrivacyNote } from "@/lib/tool-page-content";

export function ApiToolPage({ meta }: { meta: ToolPageMeta }) {
  const content = buildToolPageContent(meta);
  const docsUrl = freeConvertUrl(meta.slug, meta.kind) ?? "https://www.freeconvert.com/api";

  return (
    <main id="main-content" className="tool-page tool-page--fc tool-page--simple">
      <header className="tool-page-hero">
        <h1>{meta.h1}</h1>
        <p className="tool-page-tagline">
          Integrate {meta.label} into your app — same docs and workflow as FreeConvert.com.
        </p>
      </header>

      <section className="fc-api-panel panel" aria-labelledby="fc-api-cta">
        <h2 id="fc-api-cta" className="fc-api-panel-title">
          FreeConvert API
        </h2>
        <p className="fc-api-panel-lead">
          Read the official API documentation, try the job builder, and copy endpoints for this conversion type.
        </p>
        <div className="fc-api-actions">
          <a className="button dark button--blue" href={docsUrl} target="_blank" rel="noopener noreferrer">
            Open API docs
          </a>
          <a
            className="button outline"
            href="https://www.freeconvert.com/api/job-builder"
            target="_blank"
            rel="noopener noreferrer"
          >
            API Job Builder
          </a>
          <Link className="button outline" href="/signin">
            Sign in for dashboard
          </Link>
        </div>
      </section>

      <p className="tool-privacy-note">{toolPrivacyNote()}</p>

      <section className="tool-section" aria-labelledby="api-features">
        <h2 id="api-features">{content.featuresTitle}</h2>
        <div className="tool-features-grid">
          {content.features.map((f) => (
            <article key={f.title} className="tool-feature-card">
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
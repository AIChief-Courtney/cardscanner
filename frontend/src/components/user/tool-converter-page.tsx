import Link from "next/link";
import type { ToolPageMeta } from "@/lib/tool-registry";
import { buildToolPageContent, toolPrivacyNote } from "@/lib/tool-page-content";
import { relatedToolsFor } from "@/lib/tools/related-tools";
import { ToolBreadcrumb } from "@/components/user/tool-breadcrumb";
import { ToolWorkspace } from "@/components/user/tool-workspace";

export function ToolConverterPage({ meta }: { meta: ToolPageMeta }) {
  const content = buildToolPageContent(meta);
  const related = relatedToolsFor(meta.slug);
  const breadcrumbTrail =
    meta.slug === "pdf-converter"
      ? [{ href: "/document-converter", label: "Document Converter" }]
      : undefined;

  return (
    <main id="main-content" className="tool-page tool-page--filedock">
      <ToolBreadcrumb label={meta.h1} trail={breadcrumbTrail} />
      <header className="tool-page-hero">
        <h1>{meta.h1}</h1>
        <p className="tool-page-tagline">{meta.tagline}</p>
      </header>

      <ToolWorkspace meta={meta} />

      <p className="tool-privacy-note">{toolPrivacyNote()}</p>

      {related.length > 0 && (
        <section className="tool-section" aria-labelledby="related-tools">
          <h2 id="related-tools">Related tools</h2>
          <ul className="related-tools-list">
            {related.map((t) => (
              <li key={t.slug}>
                <Link href={t.href}>{t.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="tool-section" aria-labelledby="tool-steps">
        <h2 id="tool-steps">{content.stepsTitle}</h2>
        <ol className="tool-steps tool-steps--simple">
          {content.steps.map((step, i) => (
            <li key={step.title}>
              <strong>
                {i + 1}. {step.title}
              </strong>
              <span>{step.body}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="tool-section" aria-labelledby="tool-features">
        <h2 id="tool-features">{content.featuresTitle}</h2>
        <div className="tool-features-grid">
          {content.features.map((f) => (
            <article key={f.title} className="panel tool-feature-card">
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tool-section" aria-labelledby="tool-faq">
        <h2 id="tool-faq">{content.faqTitle}</h2>
        <div className="tool-faq-list">
          {content.faqs.map((faq) => (
            <details key={faq.q} className="tool-faq-item">
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
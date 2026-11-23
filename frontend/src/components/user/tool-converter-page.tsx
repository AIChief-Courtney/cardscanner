import type { ToolPageMeta } from "@/lib/tool-registry";
import { buildToolPageContent, toolPrivacyNote } from "@/lib/tool-page-content";
import { ToolWorkspace } from "@/components/user/tool-workspace";

export function ToolConverterPage({ meta }: { meta: ToolPageMeta }) {
  const content = buildToolPageContent(meta);

  return (
    <main id="main-content" className="tool-page tool-page--fc tool-page--simple">
      <header className="tool-page-hero">
        <h1>{meta.h1}</h1>
        <p className="tool-page-tagline">{meta.tagline}</p>
      </header>

      <ToolWorkspace meta={meta} />

      <p className="tool-privacy-note">{toolPrivacyNote()}</p>

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

      <section className="tool-section tool-section--features" aria-labelledby="tool-features">
        <h2 id="tool-features">{content.featuresTitle}</h2>
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
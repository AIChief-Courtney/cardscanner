import type { ToolPageMeta } from "@/lib/tool-registry";
import { buildToolPageContent, toolPrivacyNote } from "@/lib/tool-page-content";
import { ToolWorkspace } from "@/components/user/tool-workspace";

/** Fallback when no FreeConvert page exists (e.g. bank-statement). */
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
    </main>
  );
}
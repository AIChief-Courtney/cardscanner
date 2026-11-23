"use client";

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import type { ToolPageMeta } from "@/lib/tool-registry";

const SAMPLE_REQUEST = `POST /v1/jobs
Authorization: Bearer YOUR_DEMO_KEY
Content-Type: application/json

{
  "operation": "convert",
  "input": { "format": "pdf" },
  "output": { "format": "docx" },
  "tasks": [{ "url": "https://example.com/input.pdf" }]
}`;

const SAMPLE_RESPONSE = `{
  "id": "job_demo_01",
  "status": "queued",
  "tasks": [{ "id": "tsk_1", "status": "queued" }]
}`;

export function ToolApiPage({ meta }: { meta: ToolPageMeta }) {
  const [step, setStep] = useState<"import" | "operate" | "export">("import");
  const [copied, setCopied] = useState<string | null>(null);
  const jsonPreview = useMemo(
    () =>
      JSON.stringify(
        {
          tool: meta.slug,
          step,
          input: meta.fileSupported,
          output: meta.outputHint ?? "varies",
        },
        null,
        2,
      ),
    [meta, step],
  );

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1500);
  }

  return (
    <main id="main-content" className="tool-page tool-page--filedock">
      <header className="tool-page-hero">
        <h1>{meta.h1}</h1>
        <p className="tool-page-tagline">{meta.tagline}</p>
        <p className="tool-demo-banner">FileDock API is demo-only — do not use in production.</p>
      </header>

      <div className="panel api-landing">
        <h2>Overview</h2>
        <p>
          This page documents the expected shape of a FileDock API job. Connect a real worker and API gateway to replace
          the sample JSON below.
        </p>
        <dl className="api-meta-dl">
          <div>
            <dt>Input</dt>
            <dd>{meta.fileSupported}</dd>
          </div>
          <div>
            <dt>Output</dt>
            <dd>{meta.outputHint ?? "Configured per job"}</dd>
          </div>
        </dl>
      </div>

      <div className="panel api-job-builder">
        <h2>Job builder (browser demo)</h2>
        <div className="api-builder-steps" role="tablist">
          {(["import", "operate", "export"] as const).map((s) => (
            <button key={s} type="button" role="tab" aria-selected={step === s} onClick={() => setStep(s)}>
              {s}
            </button>
          ))}
        </div>
        <pre className="api-code-block">{jsonPreview}</pre>
        <button type="button" className="button outline small" onClick={() => copy(jsonPreview, "preview")}>
          {copied === "preview" ? <Check size={14} /> : <Copy size={14} />} Copy preview
        </button>
      </div>

      <div className="api-samples-grid">
        <CodeSample title="Sample request" body={SAMPLE_REQUEST} copied={copied === "req"} onCopy={() => copy(SAMPLE_REQUEST, "req")} />
        <CodeSample title="Sample response" body={SAMPLE_RESPONSE} copied={copied === "res"} onCopy={() => copy(SAMPLE_RESPONSE, "res")} />
      </div>
    </main>
  );
}

function CodeSample({
  title,
  body,
  onCopy,
  copied,
}: {
  title: string;
  body: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="panel">
      <div className="api-sample-head">
        <h3>{title}</h3>
        <button type="button" className="button outline small" onClick={onCopy}>
          {copied ? <Check size={14} /> : <Copy size={14} />} Copy
        </button>
      </div>
      <pre className="api-code-block">{body}</pre>
    </div>
  );
}
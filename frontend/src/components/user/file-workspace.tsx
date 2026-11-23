"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CloudUpload, FileImage, LoaderCircle, Settings2, Trash2, XCircle, CheckCircle2 } from "lucide-react";
import type { JobStatus, QueuedFile } from "@/lib/tools/types";
import type { ToolPageMeta } from "@/lib/tool-registry";
import { getToolRecord } from "@/lib/tools/registry";
import { validateIncomingFile, isValidUrlSyntax } from "@/lib/tools/validate-queue";
import { demoConversionAdapter } from "@/lib/tools/demo-adapter";
import { saveDemoJob, type DemoJob } from "@/lib/tools/job-history";

type SourceTab = "device" | "dropbox" | "drive" | "onedrive" | "url";

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileWorkspace({ meta }: { meta: ToolPageMeta }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<SourceTab>("device");
  const [url, setUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [outputFormat, setOutputFormat] = useState(meta.defaultOutput ?? meta.outputFormats?.[0] ?? "");
  const [jobStatus, setJobStatus] = useState<JobStatus>("ready");
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const [sampleOutput, setSampleOutput] = useState(false);
  const [settingsScope, setSettingsScope] = useState<"batch" | "one">("batch");
  const [quality, setQuality] = useState(80);

  const record = getToolRecord(meta.slug);
  const fixedOutput = meta.template === "conversion" && meta.defaultOutput;
  const validCount = queue.filter((f) => f.status === "valid").length;

  const revokePreviews = useCallback((files: QueuedFile[]) => {
    for (const f of files) {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    }
  }, []);

  useEffect(() => () => revokePreviews(queue), [queue, revokePreviews]);

  const addFiles = useCallback(
    (list: FileList | null) => {
      if (!list?.length) return;
      setQueue((prev) => {
        const names = new Set(prev.map((f) => f.name));
        const next = [...prev];
        for (const file of Array.from(list)) {
          if (next.length >= meta.maxFiles) break;
          const row = validateIncomingFile(file, meta, names);
          names.add(file.name);
          next.push(row);
        }
        return next;
      });
      setResultMsg(null);
      setJobStatus("ready");
    },
    [meta],
  );

  function removeFile(id: string) {
    setQueue((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  }

  async function runJob() {
    if (!record || validCount === 0 || jobStatus === "processing" || jobStatus === "submitting") return;
    setJobStatus("submitting");
    setResultMsg(null);
    setSampleOutput(false);
    await new Promise((r) => setTimeout(r, 200));
    setJobStatus("processing");
    const res = await demoConversionAdapter.process({
      tool: record,
      files: queue,
      outputFormat: outputFormat || undefined,
    });
    setJobStatus(res.status);
    setResultMsg(res.message);
    setSampleOutput(!!res.sampleOutput);
    const job: DemoJob = {
      id: crypto.randomUUID(),
      jobId: `job_${Date.now().toString(36)}`,
      toolSlug: meta.slug,
      toolLabel: meta.h1,
      createdAt: new Date().toISOString(),
      status: res.status === "failed" ? "failed" : queue.some((f) => f.status !== "valid") ? "mixed" : "complete",
      tasks: queue.map((f) => ({
        id: f.id,
        fileName: f.name,
        status: f.status === "valid" ? (res.status === "failed" ? "failed" : "complete") : "failed",
        outputLabel: res.outputLabel,
        sampleOutput: res.sampleOutput,
      })),
    };
    saveDemoJob(job);
  }

  return (
    <div className="tool-workspace panel tool-workspace--filedock">
      <p className="tool-demo-banner" role="status">
        Demo mode — outputs are labeled samples. Files stay in your browser and are not uploaded.
      </p>

      <ul className="tool-source-tabs" role="tablist" aria-label="Upload source">
        {(
          [
            ["device", "From Device"],
            ["dropbox", "Dropbox"],
            ["drive", "Google Drive"],
            ["onedrive", "OneDrive"],
            ["url", "URL"],
          ] as const
        ).map(([key, label]) => (
          <li key={key} role="presentation">
            <button
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={`tool-source-tabs-item ${tab === key ? "tool-source-tabs-item--active" : "tool-source-tabs-item--muted"}`}
              onClick={() => setTab(key)}
            >
              {label}
              {key !== "device" && key !== "url" ? (
                <span className="tool-source-badge">Integration required</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {tab === "url" ? (
        <div className="tool-url-source">
          <label htmlFor="tool-url-input">Paste a file URL</label>
          <input
            id="tool-url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/file.pdf"
          />
          <p className="tool-url-hint">
            {url && !isValidUrlSyntax(url) ? (
              <span className="tool-queue-error">Enter a valid http(s) URL (demo does not fetch remote files).</span>
            ) : (
              "URL syntax is validated only — demo does not download remote files."
            )}
          </p>
        </div>
      ) : tab !== "device" ? (
        <p className="tool-integration-note">Connect cloud storage in account settings (not wired in this demo).</p>
      ) : (
        <div className="tool-workspace-upload-row">
          <div
            className={`tool-upload-drop ${dragging ? "tool-upload-drop--active" : ""} ${validCount ? "tool-upload-drop--has-file" : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
          >
            <input
              ref={inputRef}
              type="file"
              className="upload-input"
              accept={meta.accept || undefined}
              multiple={meta.maxFiles > 1}
              onChange={(e) => addFiles(e.target.files)}
            />
            <UploadIcon hasFile={validCount > 0} />
            <p className="upload-drop-strong">Choose Files</p>
            <p className="upload-drop-hint">
              Up to {meta.maxFiles} files · max {meta.maxSizeMb} MB each · {meta.fileSupported}
            </p>
          </div>
        </div>
      )}

      {queue.length > 0 && (
        <section className="tool-queue" aria-label="File queue">
          <div className="tool-queue-head">
            <h2 className="tool-queue-title">Queue ({queue.length})</h2>
            <button type="button" className="text-link" onClick={() => inputRef.current?.click()}>
              Add more
            </button>
          </div>
          <ul className="tool-queue-list">
            {queue.map((f) => (
              <li key={f.id} className={`tool-queue-row tool-queue-row--${f.status}`}>
                {f.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.previewUrl} alt="" className="tool-queue-thumb" />
                ) : (
                  <span className="tool-queue-thumb tool-queue-thumb--empty" aria-hidden>
                    <FileImage size={20} />
                  </span>
                )}
                <span className="tool-queue-name">{f.name}</span>
                <span className="tool-queue-size">{formatBytes(f.size)}</span>
                <span className="tool-queue-status">
                  {f.status === "valid" ? (
                    <CheckCircle2 size={16} aria-hidden />
                  ) : (
                    <XCircle size={16} aria-hidden />
                  )}
                  {f.status === "valid" ? "Valid" : f.error ?? f.status}
                </span>
                <button type="button" className="icon-btn" aria-label={`Remove ${f.name}`} onClick={() => removeFile(f.id)}>
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!fixedOutput && meta.outputFormats && meta.outputFormats.length > 1 && (
        <div className="tool-output-picker">
          <label htmlFor="output-format">Output format (batch default)</label>
          <select id="output-format" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)}>
            {meta.outputFormats.map((fmt) => (
              <option key={fmt} value={fmt}>
                {fmt}
              </option>
            ))}
          </select>
        </div>
      )}

      <details className="tool-advanced-settings" open={meta.template === "compressor"}>
        <summary>
          <Settings2 size={16} aria-hidden /> Settings ({settingsScope === "batch" ? "apply to all" : "per file"})
        </summary>
        <WorkspaceSettings quality={quality} setQuality={setQuality} scope={settingsScope} setScope={setSettingsScope} meta={meta} />
      </details>

      <div className="tool-workspace-actions">
        <button
          type="button"
          className="button dark button--filedock tool-convert-btn"
          disabled={validCount === 0 || jobStatus === "processing" || jobStatus === "submitting"}
          onClick={runJob}
        >
          {jobStatus === "processing" || jobStatus === "submitting" ? (
            <LoaderCircle size={17} className="spin" aria-hidden />
          ) : null}
          {meta.convertLabel}
        </button>
        <span className="tool-job-status" aria-live="polite">
          Status: {jobStatus}
        </span>
      </div>

      {resultMsg && (
        <div className="tool-result panel" role="status">
          <p>{resultMsg}</p>
          {sampleOutput && <p className="tool-sample-badge">Sample output — not your converted file.</p>}
          <WorkspaceDownloads validCount={validCount} label={outputFormat || meta.outputHint} sample={sampleOutput} />
          <button type="button" className="button outline small" onClick={() => setJobStatus("ready")}>
            Start another
          </button>
        </div>
      )}
    </div>
  );
}

function WorkspaceSettings({
  quality,
  setQuality,
  scope,
  setScope,
  meta,
}: {
  quality: number;
  setQuality: (n: number) => void;
  scope: "batch" | "one";
  setScope: (s: "batch" | "one") => void;
  meta: ToolPageMeta;
}) {
  return (
    <div className="tool-settings-grid">
      {meta.template === "compressor" || meta.kind === "image" ? (
        <label>
          Quality ({quality}%)
          <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
        </label>
      ) : null}
      <fieldset className="tool-settings-scope">
        <legend>Apply settings</legend>
        <label>
          <input type="radio" name="scope" checked={scope === "batch"} onChange={() => setScope("batch")} /> Apply to all
        </label>
        <label>
          <input type="radio" name="scope" checked={scope === "one"} onChange={() => setScope("one")} /> Per file (demo)
        </label>
      </fieldset>
      <button type="button" className="text-link" onClick={() => setQuality(80)}>
        Reset defaults
      </button>
    </div>
  );
}

function WorkspaceDownloads({
  validCount,
  label,
  sample,
}: {
  validCount: number;
  label?: string;
  sample: boolean;
}) {
  if (!validCount) return null;
  return (
    <ul className="tool-downloads">
      {Array.from({ length: Math.min(validCount, 3) }).map((_, i) => (
        <li key={i}>
          <button type="button" className="text-link" disabled>
            Download {label ?? "output"} #{i + 1}
            {sample ? " (sample)" : ""}
          </button>
        </li>
      ))}
      {validCount > 1 && (
        <li>
          <button type="button" className="text-link" disabled>
            Download all as ZIP (demo)
          </button>
        </li>
      )}
    </ul>
  );
}

function UploadIcon({ hasFile }: { hasFile: boolean }) {
  return (
    <div className="upload-drop-icon" aria-hidden>
      {hasFile ? <FileImage size={36} /> : <CloudUpload size={36} />}
    </div>
  );
}
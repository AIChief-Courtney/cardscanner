"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CloudUpload, FileImage, LoaderCircle, Settings2, Trash2, XCircle, CheckCircle2, RotateCcw } from "lucide-react";
import type { JobStatus, QueuedFile } from "@/lib/tools/types";
import type { ToolPageMeta } from "@/lib/tool-registry";
import { getToolRecord } from "@/lib/tools/registry";
import { validateIncomingFile, isValidUrlSyntax } from "@/lib/tools/validate-queue";
import { demoConversionAdapter } from "@/lib/tools/demo-adapter";
import { processImageBrowser } from "@/lib/tools/image-browser-adapter";
import { saveDemoJob } from "@/lib/tools/job-history";
import { OutputFormatPicker } from "@/components/user/output-format-picker";
import { FcOutputFormatPicker } from "@/components/user/fc-output-format-picker";
import { PDF_CONVERTER_OUTPUT_GROUPS } from "@/lib/tools/pdf-converter-outputs";

type SourceTab = "device" | "dropbox" | "drive" | "onedrive" | "url";
type DownloadItem = { id: string; name: string; url: string; size: number };

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileWorkspace({ meta }: { meta: ToolPageMeta }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<Map<string, File>>(new Map());
  const [tab, setTab] = useState<SourceTab>("device");
  const [url, setUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [outputFormat, setOutputFormat] = useState(meta.defaultOutput ?? meta.outputFormats?.[0] ?? "");
  const [perFileOutput, setPerFileOutput] = useState<Record<string, string>>({});
  const [jobStatus, setJobStatus] = useState<JobStatus>("ready");
  const [progress, setProgress] = useState(0);
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const [sampleOutput, setSampleOutput] = useState(false);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [settingsScope, setSettingsScope] = useState<"batch" | "one">("batch");
  const [quality, setQuality] = useState(85);

  const record = getToolRecord(meta.slug);
  const lockOutput =
    meta.template === "conversion" && !!meta.defaultOutput && (!meta.outputFormats || meta.outputFormats.length <= 1);
  const showOutputPicker = !lockOutput && !!meta.outputFormats?.length;
  const validCount = queue.filter((f) => f.status === "valid").length;
  const isImageBrowser = record?.execution === "browser-local" && meta.kind === "image";
  const useFcOutputPicker = meta.slug === "pdf-converter";

  const revokePreviews = useCallback((files: QueuedFile[]) => {
    for (const f of files) {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    }
  }, []);

  useEffect(
    () => () => {
      revokePreviews(queue);
      downloads.forEach((d) => URL.revokeObjectURL(d.url));
    },
    [queue, downloads, revokePreviews],
  );

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
          if (row.status === "valid") filesRef.current.set(row.id, file);
          next.push(row);
        }
        return next;
      });
      setResultMsg(null);
      setDownloads([]);
      setJobStatus("ready");
      setProgress(0);
    },
    [meta],
  );

  function removeFile(id: string) {
    setQueue((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      filesRef.current.delete(id);
      return prev.filter((f) => f.id !== id);
    });
  }

  function outputForFile(fileId: string): string {
    if (settingsScope === "one" && perFileOutput[fileId]) return perFileOutput[fileId];
    return outputFormat;
  }

  async function runJob() {
    if (!record || validCount === 0 || jobStatus === "processing" || jobStatus === "submitting") return;
    downloads.forEach((d) => URL.revokeObjectURL(d.url));
    setDownloads([]);
    setJobStatus("submitting");
    setResultMsg(null);
    setSampleOutput(false);
    setProgress(15);
    await new Promise((r) => setTimeout(r, 200));
    setJobStatus("processing");
    setProgress(50);

    const validEntries = queue
      .filter((f) => f.status === "valid")
      .map((f) => ({ id: f.id, file: filesRef.current.get(f.id) }))
      .filter((x): x is { id: string; file: File } => !!x.file);

    const res = isImageBrowser
      ? await processImageBrowser({
          tool: record,
          fileEntries: validEntries,
          outputFormat: outputFormat || undefined,
          quality,
        })
      : await demoConversionAdapter.process({ tool: record, files: queue, outputFormat: outputFormat || undefined });

    setProgress(100);
    setJobStatus(res.status);
    setResultMsg(res.message);
    setSampleOutput(!!res.sampleOutput);
    if ("downloads" in res && Array.isArray(res.downloads)) setDownloads(res.downloads);

    saveDemoJob({
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
    });
  }

  function resetWorkspace() {
    revokePreviews(queue);
    downloads.forEach((d) => URL.revokeObjectURL(d.url));
    filesRef.current.clear();
    setQueue([]);
    setDownloads([]);
    setResultMsg(null);
    setJobStatus("ready");
    setProgress(0);
  }

  return (
    <div className="tool-workspace panel tool-workspace--filedock">
      {!isImageBrowser ? (
        <p className="tool-demo-banner" role="status">
          Demo mode — outputs are labeled samples. Files stay in your browser and are not uploaded.
        </p>
      ) : (
        <p className="tool-browser-local-banner" role="status">
          JPG, PNG, WEBP, and GIF export run in your browser for supported raster images.
        </p>
      )}

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

      {showOutputPicker && meta.outputFormats && useFcOutputPicker && (
        <FcOutputFormatPicker
          groups={PDF_CONVERTER_OUTPUT_GROUPS}
          value={outputFormat}
          onChange={setOutputFormat}
          label="Output"
        />
      )}
      {showOutputPicker && meta.outputFormats && !useFcOutputPicker && (
        <OutputFormatPicker
          formats={meta.outputFormats}
          value={outputFormat}
          onChange={setOutputFormat}
          label={meta.template === "category" ? "Convert to" : "Output format"}
        />
      )}

      {tab === "url" ? (
        <div className="tool-url-source">
          <label htmlFor="tool-url-input">Paste a file URL</label>
          <input
            id="tool-url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
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
            <div className="upload-drop-icon" aria-hidden>
              {validCount > 0 ? <FileImage size={36} /> : <CloudUpload size={36} />}
            </div>
            <p className="upload-drop-strong">{dragging ? "Drop any files here!" : "Choose Files"}</p>
            <p className="upload-drop-hint">
              Max {meta.maxFiles} files · {meta.maxSizeMb} MB each · supports {meta.fileSupported}
            </p>
          </div>
          <p className="tool-terms-line">
            By proceeding, you confirm you own the rights to your files and agree to our{" "}
            <Link href="/terms">Terms of Use</Link>.
          </p>
        </div>
      )}

      {queue.length > 0 && (
        <section className="tool-queue" aria-label="File queue">
          <div className="tool-queue-head">
            <h2 className="tool-queue-title">Files ({queue.length})</h2>
            <button type="button" className="text-link" onClick={() => inputRef.current?.click()}>
              Add more
            </button>
          </div>
          <ul className="tool-queue-list">
            {queue.map((f) => (
              <li key={f.id} className={`tool-queue-row tool-queue-row--${f.status} tool-queue-row--responsive`}>
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
                {showOutputPicker && f.status === "valid" && settingsScope === "one" && useFcOutputPicker && (
                  <FcOutputFormatPicker
                    groups={PDF_CONVERTER_OUTPUT_GROUPS}
                    value={outputForFile(f.id)}
                    onChange={(fmt) => setPerFileOutput((prev) => ({ ...prev, [f.id]: fmt }))}
                    label="Output"
                    compact
                  />
                )}
                {showOutputPicker && f.status === "valid" && settingsScope === "one" && !useFcOutputPicker && (
                  <select
                    className="tool-queue-format"
                    aria-label={`Output for ${f.name}`}
                    value={outputForFile(f.id)}
                    onChange={(e) => setPerFileOutput((prev) => ({ ...prev, [f.id]: e.target.value }))}
                  >
                    {meta.outputFormats!.map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {fmt}
                      </option>
                    ))}
                  </select>
                )}
                {showOutputPicker && f.status === "valid" && settingsScope === "batch" && !useFcOutputPicker && (
                  <span className="tool-queue-format-label">{outputFormat}</span>
                )}
                {showOutputPicker && f.status === "valid" && settingsScope === "batch" && useFcOutputPicker && (
                  <FcOutputFormatPicker
                    groups={PDF_CONVERTER_OUTPUT_GROUPS}
                    value={outputFormat}
                    onChange={setOutputFormat}
                    label="Output"
                    compact
                  />
                )}
                <span className="tool-queue-status">
                  {f.status === "valid" ? <CheckCircle2 size={16} aria-hidden /> : <XCircle size={16} aria-hidden />}
                  {f.status === "valid" ? "Ready" : f.error ?? f.status}
                </span>
                <button type="button" className="icon-btn" aria-label={`Remove ${f.name}`} onClick={() => removeFile(f.id)}>
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <details className="tool-advanced-settings" open={meta.template === "category" && meta.kind === "image"}>
        <summary>
          <Settings2 size={16} aria-hidden /> Advanced settings (optional)
        </summary>
        <WorkspaceSettings
          quality={quality}
          setQuality={setQuality}
          scope={settingsScope}
          setScope={setSettingsScope}
          meta={meta}
        />
      </details>

      {(jobStatus === "processing" || jobStatus === "submitting") && (
        <div className="tool-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="tool-progress-bar" style={{ width: `${progress}%` }} />
          <span>Processing…</span>
        </div>
      )}

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
        <button type="button" className="button outline small" onClick={resetWorkspace} disabled={!queue.length && !resultMsg}>
          <RotateCcw size={14} aria-hidden /> Reset
        </button>
        <span className="tool-job-status" aria-live="polite">
          {jobStatus === "ready" ? "Ready" : jobStatus}
        </span>
      </div>

      {resultMsg && (
        <ResultPanel
          resultMsg={resultMsg}
          sampleOutput={sampleOutput}
          downloads={downloads}
          validCount={validCount}
          outputFormat={outputFormat}
          jobStatus={jobStatus}
          onRetry={runJob}
          onReset={resetWorkspace}
        />
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
          <input type="radio" name="scope" checked={scope === "one"} onChange={() => setScope("one")} /> Per file
        </label>
      </fieldset>
      <button type="button" className="text-link" onClick={() => setQuality(85)}>
        Reset defaults
      </button>
    </div>
  );
}

function ResultPanel({
  resultMsg,
  sampleOutput,
  downloads,
  validCount,
  outputFormat,
  jobStatus,
  onRetry,
  onReset,
}: {
  resultMsg: string;
  sampleOutput: boolean;
  downloads: DownloadItem[];
  validCount: number;
  outputFormat: string;
  jobStatus: JobStatus;
  onRetry: () => void;
  onReset: () => void;
}) {
  return (
    <div className="tool-result panel" role="status">
      <p>{resultMsg}</p>
      {sampleOutput && <p className="tool-sample-badge">Sample output — not your converted file.</p>}
      <WorkspaceDownloads downloads={downloads} validCount={validCount} label={outputFormat} sample={sampleOutput} />
      {jobStatus === "failed" && (
        <button type="button" className="button outline small" onClick={onRetry}>
          Retry
        </button>
      )}
      <button type="button" className="button outline small" onClick={onReset}>
        Start another conversion
      </button>
    </div>
  );
}

function WorkspaceDownloads({
  downloads,
  validCount,
  label,
  sample,
}: {
  downloads: DownloadItem[];
  validCount: number;
  label?: string;
  sample: boolean;
}) {
  if (downloads.length) {
    return (
      <ul className="tool-downloads">
        {downloads.map((d) => (
          <li key={d.id}>
            <a className="button outline small" href={d.url} download={d.name}>
              Download {d.name} ({formatBytes(d.size)})
            </a>
          </li>
        ))}
      </ul>
    );
  }
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
    </ul>
  );
}

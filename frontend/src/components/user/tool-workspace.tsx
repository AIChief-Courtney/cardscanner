"use client";

import { useCallback, useRef, useState } from "react";
import { CloudUpload, FileImage, LoaderCircle, Settings2 } from "lucide-react";
import type { ToolPageMeta } from "@/lib/tool-registry";

export function ToolWorkspace({ meta }: { meta: ToolPageMeta }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const onFiles = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
  }, []);

  function convert() {
    if (!fileName) return;
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setResult(
        `Preview — full ${meta.h1} conversion will run on the server. File: ${fileName}. Output: ${meta.outputHint ?? "text"}.`,
      );
    }, 900);
  }

  return (
    <div className="tool-workspace panel tool-workspace--simple">
      <ul className="tool-source-tabs" aria-label="Upload source">
        <li className="tool-source-tabs-item tool-source-tabs-item--active">From Device</li>
        <li className="tool-source-tabs-item tool-source-tabs-item--muted">Dropbox</li>
        <li className="tool-source-tabs-item tool-source-tabs-item--muted">Google Drive</li>
        <li className="tool-source-tabs-item tool-source-tabs-item--muted">OneDrive</li>
        <li className="tool-source-tabs-item tool-source-tabs-item--muted">URL</li>
      </ul>

      <div className="tool-workspace-upload-row tool-workspace-upload-row--simple">
        <div
          className={`tool-upload-drop ${dragging ? "tool-upload-drop--active" : ""} ${fileName ? "tool-upload-drop--has-file" : ""}`}
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
            onFiles(e.dataTransfer.files);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            className="upload-input"
            accept={meta.accept || undefined}
            onChange={(e) => onFiles(e.target.files)}
          />
          <UploadIcon hasFile={!!fileName} />
          {fileName ? (
            <>
              <p className="upload-drop-strong">{fileName}</p>
              <p className="upload-drop-hint">Click or drop to replace · then Convert</p>
            </>
          ) : (
            <>
              <p className="upload-drop-strong">Choose Files</p>
              <p className="upload-drop-hint">Upload file or drag and drop</p>
            </>
          )}
        </div>
      </div>

      <details className="tool-advanced-settings">
        <summary>
          <Settings2 size={16} aria-hidden /> Advanced settings (optional)
        </summary>
        <p>Fine-tune quality and format options when server conversion is enabled.</p>
      </details>

      <div className="tool-workspace-actions">
        <button type="button" className="button dark button--blue tool-convert-btn" disabled={!fileName || busy} onClick={convert}>
          {busy ? <LoaderCircle size={17} className="spin" aria-hidden /> : null}
          {meta.convertLabel}
        </button>
      </div>

      {result && <ToolResult result={result} />}
    </div>
  );
}

function UploadIcon({ hasFile }: { hasFile: boolean }) {
  return (
    <div className="upload-drop-icon" aria-hidden>
      {hasFile ? <FileImage size={36} /> : <CloudUpload size={36} />}
    </div>
  );
}

function ToolResult({ result }: { result: string }) {
  return (
    <div className="tool-result panel-glass" role="status">
      <h3 className="tool-result-title">Result</h3>
      <p className="tool-result-body">{result}</p>
      <div className="tool-result-actions">
        <button type="button" className="button outline small" onClick={() => navigator.clipboard?.writeText(result)}>
          Copy
        </button>
        <button type="button" className="button dark small" disabled>
          Download
        </button>
      </div>
    </div>
  );
}
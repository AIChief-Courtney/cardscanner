"use client";

import { useCallback, useRef, useState } from "react";
import { CloudUpload, FileImage } from "lucide-react";

export function UploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const onFiles = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setFileName(file.name);
    setNotice("File received — conversion tools will process uploads here soon.");
  }, []);

  return (
    <section className="upload-zone panel" aria-labelledby="upload-title">
      <h2 id="upload-title" className="upload-zone-title">
        Upload for scanning
      </h2>
      <p className="upload-zone-lead">
        Drop an image, PDF, or card scan. Your workspace keeps conversions organized in one place.
      </p>

      <div
        className={`upload-drop ${dragging ? "upload-drop--active" : ""} ${fileName ? "upload-drop--has-file" : ""}`}
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
          accept="image/*,.pdf,application/pdf"
          onChange={(e) => onFiles(e.target.files)}
        />
        <div className="upload-drop-icon" aria-hidden>
          {fileName ? <FileImage size={36} /> : <CloudUpload size={36} />}
        </div>
        {fileName ? (
          <>
            <p className="upload-drop-strong">{fileName}</p>
            <p className="upload-drop-hint">Click or drop another file to replace</p>
          </>
        ) : (
          <>
            <p className="upload-drop-strong">Choose a file or drag it here</p>
            <p className="upload-drop-hint">PNG, JPG, PDF · up to 25 MB recommended</p>
          </>
        )}
      </div>

      {notice && (
        <p className="upload-notice" role="status">
          {notice}
        </p>
      )}

      <div className="upload-zone-footer">
        <span className="upload-store-badge" aria-hidden>
          App Store
        </span>
        <a className="upload-more-apps" href="#tools-catalog">
          More Apps
        </a>
      </div>
    </section>
  );
}
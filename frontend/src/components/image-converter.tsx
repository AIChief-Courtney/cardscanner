"use client";

import { ArrowDownToLine, ChevronDown, FilePlus } from "lucide-react";
import { useRef, useState } from "react";
import styles from "./dashboard.module.css";

const formats = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
} as const;
type Format = keyof typeof formats;

export function ImageConverter() {
  const picker = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [format, setFormat] = useState<Format>("png");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [sourcesOpen, setSourcesOpen] = useState(false);

  function selectFile(candidate?: File) {
    if (!candidate) return;
    if (!/\.(jpe?g|png|webp)$/i.test(candidate.name)) {
      setFile(undefined);
      setMessage("Choose a JPG, PNG, or WebP image.");
      return;
    }
    setFile(candidate);
    setMessage("");
  }

  async function convert() {
    if (!file || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const image = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      try {
        const context = canvas.getContext("2d", { alpha: format !== "jpg" });
        if (!context) throw new Error("Canvas unavailable");
        if (format === "jpg") {
          context.fillStyle = "#fff";
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
        context.drawImage(image, 0, 0);
      } finally {
        image.close();
      }

      const mimeType = formats[format];
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mimeType));
      if (!blob || blob.type !== mimeType) {
        setMessage("Your browser could not export this format. Try PNG or JPG.");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name.replace(/\.[^.]+$/, "") + "." + format;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
      setMessage("Download started.");
    } catch {
      setMessage("Could not read this image. Try a different file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="converter" className={styles.converter} aria-label="Convert an image">
      <div
        className={styles.dropZone}
        data-dragging={dragging}
        onDragOver={(event) => {
          event.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!busy) selectFile(event.dataTransfer.files[0]);
        }}
      >
        <input
          ref={picker}
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          hidden
          onChange={(event) => {
            selectFile(event.currentTarget.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
        <div className={styles.filePicker} onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setSourcesOpen(false);
        }} onKeyDown={(event) => {
          if (event.key === "Escape" && sourcesOpen) {
            setSourcesOpen(false);
            event.currentTarget.querySelector<HTMLButtonElement>("[aria-expanded]")?.focus();
          }
        }}>
          <button type="button" disabled={busy} onClick={() => {
            setSourcesOpen(false);
            picker.current?.click();
          }}>
            <FilePlus size={16} aria-hidden /> Choose Files
          </button>
          <button type="button" aria-label="File sources" aria-expanded={sourcesOpen} disabled={busy}
            onClick={() => setSourcesOpen(!sourcesOpen)}>
            <ChevronDown size={16} aria-hidden />
          </button>
          {sourcesOpen && (
            <button className={styles.source} type="button" onClick={() => {
              setSourcesOpen(false);
              picker.current?.click();
            }}>From device</button>
          )}
        </div>
        <p>{file?.name ?? "Drop a JPG, PNG, or WebP image here"}</p>
        <small>Your files are processed on your device.</small>
      </div>

      {file && <div className={styles.controls}>
        <label>
          Output format
          <select value={format} disabled={busy} onChange={(event) => setFormat(event.target.value as Format)}>
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="webp">WebP</option>
          </select>
        </label>
        <button className={styles.primary} type="button" disabled={!file || busy} onClick={convert}>
          <ArrowDownToLine size={17} aria-hidden />
          {busy ? "Converting…" : "Convert and download"}
        </button>
      </div>}
      <p className={styles.status} role="status">{message}</p>
    </section>
  );
}

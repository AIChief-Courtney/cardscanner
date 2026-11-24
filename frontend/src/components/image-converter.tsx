"use client";

import { ArrowDownToLine, ChevronDown, Cloud, FilePlus, Folder, Link2, PackageOpen, Triangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import styles from "./dashboard.module.css";

const formats = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
} as const;
type Format = keyof typeof formats;

const cloudSources = [
  { id: "dropbox", label: "Dropbox", icon: PackageOpen },
  { id: "drive", label: "Google Drive", icon: Triangle },
  { id: "onedrive", label: "OneDrive", icon: Cloud },
] as const;

type ImportSource = "url" | "clipboard" | (typeof cloudSources)[number]["id"];

export function ImageConverter() {
  const picker = useRef<HTMLInputElement>(null);
  const importDialog = useRef<HTMLDialogElement>(null);
  const sourceToggle = useRef<HTMLButtonElement>(null);
  const [file, setFile] = useState<File>();
  const [format, setFormat] = useState<Format>("png");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [source, setSource] = useState<ImportSource>("url");
  const [importError, setImportError] = useState("");
  const [loading, setLoading] = useState(false);
  const cloudSource = cloudSources.find(({ id }) => id === source);

  useEffect(() => {
    function applyOutputLink() {
      const output = window.location.hash;
      if (output === "#output-png" || output === "#output-jpg") {
        setFormat(output === "#output-png" ? "png" : "jpg");
        window.history.replaceState(window.history.state, "", "#converter");
        document.getElementById("converter")?.scrollIntoView();
      }
    }

    applyOutputLink();
    window.addEventListener("hashchange", applyOutputLink);
    return () => window.removeEventListener("hashchange", applyOutputLink);
  }, []);

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

  function openImport(nextSource: ImportSource) {
    setSourcesOpen(false);
    setSource(nextSource);
    setImportError("");
    importDialog.current?.showModal();
    requestAnimationFrame(() => importDialog.current?.querySelector<HTMLElement>("input, textarea")?.focus());
  }

  async function importUrl(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const address = String(new FormData(event.currentTarget).get("url"));
    const url = URL.canParse(address) ? new URL(address) : null;
    if (!url || !["https:", "http:"].includes(url.protocol) || url.username || url.password) {
      setImportError("Enter an HTTP or HTTPS image URL without credentials.");
      return;
    }

    setLoading(true);
    setImportError("");
    try {
      const response = await fetch(url, {
        credentials: "omit",
        referrerPolicy: "no-referrer",
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) throw new Error("Image request failed");
      const mime = response.headers.get("content-type")?.split(";")[0]?.trim();
      const format = (Object.keys(formats) as Format[]).find((key) => formats[key] === mime);
      if (!format) {
        setImportError("Use a direct link to a JPG, PNG, or WebP image.");
        return;
      }
      const blob = await response.blob();
      const name = url.pathname.split("/").pop()?.replace(/\.[^.]+$/, "") || "image";
      selectFile(new File([blob], `${name}.${format}`, { type: blob.type }));
      importDialog.current?.close();
    } catch {
      setImportError("Could not load this link. Use a public image URL that allows browser access, or download it and choose From device.");
    } finally {
      setLoading(false);
    }
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
          <button ref={sourceToggle} type="button" aria-label="File sources" aria-expanded={sourcesOpen} disabled={busy}
            onClick={() => setSourcesOpen(!sourcesOpen)}>
            <ChevronDown size={16} aria-hidden />
          </button>
          {sourcesOpen && (
            <div className={styles.source}>
              <button type="button" onClick={() => {
                setSourcesOpen(false);
                sourceToggle.current?.focus();
                picker.current?.click();
              }}><Folder size={14} aria-hidden /> From Device</button>
              {cloudSources.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => openImport(id)}><Icon size={14} aria-hidden /> From {label}</button>
              ))}
              <button type="button" onClick={() => openImport("url")}><Link2 size={14} aria-hidden /> From URL</button>
            </div>
          )}
        </div>
        <p>{file?.name ?? "Drop a JPG, PNG, or WebP image here"}</p>
        <small>Your files are processed on your device. <button id="paste-image" className={styles.pasteLink} type="button" disabled={busy} onClick={() => openImport("clipboard")}>Paste image</button></small>
      </div>

      <dialog ref={importDialog} className={styles.importDialog} aria-labelledby="import-heading"
        onCancel={(event) => { if (loading) event.preventDefault(); }}
        onClose={() => sourceToggle.current?.focus()}>
        <h2 id="import-heading">Import from {cloudSource?.label ?? (source === "url" ? "URL" : "clipboard")}</h2>
        {source !== "clipboard" ? (
          <form key={source} onSubmit={importUrl}>
            {cloudSource && <p>Use a public direct image link. If your link opens a preview or requires sign-in, download the image and choose From Device.</p>}
            <label>{cloudSource ? `${cloudSource.label} image link` : "Public image URL"}<input type="url" name="url" required placeholder="https://" /></label>
            <button type="submit" className={styles.primary} disabled={loading}>{loading ? "Importing…" : "Import image"}</button>
          </form>
        ) : (
          <label>Paste an image here
            <textarea rows={2} onPaste={(event) => {
              event.preventDefault();
              const image = Array.from(event.clipboardData.files).find((file) =>
                Object.values(formats).some((mime) => mime === file.type)
              );
              if (!image) {
                setImportError("Copy a JPG, PNG, or WebP image and paste it here.");
                return;
              }
              const extension = image.type.split("/")[1];
              selectFile(new File([image], `clipboard.${extension}`, { type: image.type }));
              importDialog.current?.close();
            }} />
          </label>
        )}
        {importError && <p role="alert">{importError}</p>}
        <button className={styles.cancel} type="button" disabled={loading} onClick={() => importDialog.current?.close()}>Cancel</button>
      </dialog>

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

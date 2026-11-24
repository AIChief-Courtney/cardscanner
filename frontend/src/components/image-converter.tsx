"use client";

import { ArrowDownToLine, CloudUpload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { imageLimitText, imageMime, maxImageBytes, readImageBytes } from "@/lib/image-import";
import styles from "./dashboard.module.css";

const formats = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
} as const;
type Format = keyof typeof formats;

type SourceTab = "device" | "dropbox" | "drive" | "onedrive" | "url";

const SOURCE_TABS: { id: SourceTab; label: string; cloud?: boolean }[] = [
  { id: "device", label: "From Device" },
  { id: "dropbox", label: "Dropbox", cloud: true },
  { id: "drive", label: "Google Drive", cloud: true },
  { id: "onedrive", label: "OneDrive", cloud: true },
  { id: "url", label: "URL" },
];

export function ImageConverter() {
  const picker = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [format, setFormat] = useState<Format>("png");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<SourceTab>("device");
  const [linkUrl, setLinkUrl] = useState("");
  const [importError, setImportError] = useState("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    setLinkUrl("");
    setImportError("");
  }, [tab]);

  function selectFile(candidate?: File) {
    if (!candidate) return;
    if (candidate.size > maxImageBytes) {
      setFile(undefined);
      setMessage(`Choose an image up to ${imageLimitText}.`);
      return;
    }
    if (!/\.(jpe?g|png|webp)$/i.test(candidate.name)) {
      setFile(undefined);
      setMessage("Choose a JPG, PNG, or WebP image.");
      return;
    }
    setFile(candidate);
    setMessage("");
  }

  async function importFromLink(event: FormEvent) {
    event.preventDefault();
    if (loading) return;

    const address = linkUrl.trim();
    const url = URL.canParse(address) ? new URL(address) : null;
    if (!url || !["https:", "http:"].includes(url.protocol) || url.username || url.password) {
      setImportError("Enter a valid http(s) URL.");
      return;
    }

    const cloudProvider = tab === "dropbox" || tab === "drive" || tab === "onedrive" ? tab : null;

    setLoading(true);
    setImportError("");
    try {
      const response = cloudProvider
        ? await fetch("/api/import/cloud", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ provider: cloudProvider, url: url.href }),
            signal: AbortSignal.timeout(25_000),
          })
        : await fetch(url, {
            credentials: "omit",
            referrerPolicy: "no-referrer",
            signal: AbortSignal.timeout(20_000),
          });

      if (!response.ok) {
        const details = cloudProvider ? await response.json().catch(() => null) : null;
        if (typeof details?.error === "string") {
          setImportError(details.error);
          return;
        }
        throw new Error("Image request failed");
      }

      const blob = await readImageBytes(response);
      const mime = await imageMime(blob);
      const outFormat = (Object.keys(formats) as Format[]).find((key) => formats[key] === mime);
      if (!outFormat) {
        setImportError("Use a direct link to a JPG, PNG, or WebP image.");
        return;
      }
      const lastSegment = url.pathname.split("/").pop() ?? "";
      const name = /\.(jpe?g|png|webp)$/i.test(lastSegment) ? lastSegment.replace(/\.[^.]+$/, "") : "image";
      selectFile(new File([blob], `${name}.${outFormat}`, { type: mime ?? "" }));
      setTab("device");
      setLinkUrl("");
    } catch (error) {
      setImportError(
        error instanceof Error && error.message.startsWith("Choose an image smaller")
          ? error.message
          : cloudProvider
            ? "Could not import from this share link. Check sharing settings, or download the file and use From Device."
            : "Could not load this link. Use a public image URL, or download the file and use From Device.",
      );
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

  const showDeviceDrop = tab === "device";

  return (
    <section id="converter" className={styles.converter} aria-label="Convert an image">
      <ul className={styles.sourceTabs} role="tablist" aria-label="Upload source">
        {SOURCE_TABS.map(({ id, label, cloud }) => (
          <li key={id} role="presentation">
            <button
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={`${styles.sourceTab} ${tab === id ? styles.sourceTabActive : styles.sourceTabMuted}`}
              onClick={() => setTab(id)}
            >
              {label}
              {cloud ? <span className={styles.sourceTabBadge}>Integration required</span> : null}
            </button>
          </li>
        ))}
      </ul>

      {showDeviceDrop ? (
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
          <button
            type="button"
            className={styles.chooseFiles}
            disabled={busy}
            onClick={() => picker.current?.click()}
          >
            <CloudUpload size={16} aria-hidden />
            Choose Files
          </button>
          <p>
            {file?.name ??
              (dragging ? "Drop a JPG, PNG, or WebP image here" : `Max file size ${imageLimitText}. JPG, PNG, and WebP.`)}
          </p>
          <small>Only import files you have the right to use.</small>
        </div>
      ) : (
        <div className={styles.linkPanel} role="tabpanel">
          <form onSubmit={importFromLink}>
            <label htmlFor="import-link">
              {tab === "url"
                ? "Paste a public image URL"
                : `Paste a ${SOURCE_TABS.find((t) => t.id === tab)?.label ?? "cloud"} share link`}
            </label>
            <input
              id="import-link"
              type="url"
              name="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://"
              required
              disabled={loading}
            />
            <button type="submit" className={styles.primary} disabled={loading || !linkUrl.trim()}>
              {loading ? "Importing…" : "Add file"}
            </button>
          </form>
          {importError && (
            <p className={styles.importError} role="alert">
              {importError}
            </p>
          )}
          <p className={styles.linkHint}>
            {tab === "url"
              ? "Direct link to JPG, PNG, or WebP. Some sites block browser downloads."
              : "Use a share link with download access. Sign-in is required for cloud imports."}
          </p>
        </div>
      )}

      {file && (
        <div className={styles.controls}>
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
        </div>
      )}
      <p className={styles.status} role="status">
        {message}
      </p>
    </section>
  );
}
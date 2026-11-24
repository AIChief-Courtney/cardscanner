"use client";

import {
  ArrowDownToLine,
  ChevronDown,
  Cloud,
  FilePlus,
  Folder,
  Link2,
  PackageOpen,
  Triangle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { imageLimitText, imageMime, maxImageBytes, readImageBytes } from "@/lib/image-import";
import styles from "./dashboard.module.css";

const formats = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
} as const;
type Format = keyof typeof formats;

type ImportSource = "url" | "dropbox" | "drive" | "onedrive";

const cloudSources = [
  { id: "dropbox" as const, label: "Dropbox", icon: PackageOpen },
  { id: "drive" as const, label: "Google Drive", icon: Triangle },
  { id: "onedrive" as const, label: "OneDrive", icon: Cloud },
];

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
  const [importSource, setImportSource] = useState<ImportSource>("url");
  const [linkUrl, setLinkUrl] = useState("");
  const [importError, setImportError] = useState("");
  const [loading, setLoading] = useState(false);

  const cloudSource = cloudSources.find(({ id }) => id === importSource);

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

  function openImport(nextSource: ImportSource) {
    setSourcesOpen(false);
    setImportSource(nextSource);
    setImportError("");
    setLinkUrl("");
    importDialog.current?.showModal();
    requestAnimationFrame(() => importDialog.current?.querySelector<HTMLInputElement>("input[type=url]")?.focus());
  }

  async function importFromLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const address = linkUrl.trim();
    const url = URL.canParse(address) ? new URL(address) : null;
    if (!url || !["https:", "http:"].includes(url.protocol) || url.username || url.password) {
      setImportError("Enter a valid http(s) URL.");
      return;
    }

    const cloudProvider = cloudSource?.id ?? null;

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
      importDialog.current?.close();
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

        <div
          className={styles.filePicker}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setSourcesOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && sourcesOpen) {
              setSourcesOpen(false);
              sourceToggle.current?.focus();
            }
          }}
        >
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setSourcesOpen(false);
              picker.current?.click();
            }}
          >
            <FilePlus size={16} aria-hidden />
            Choose Files
          </button>
          <button
            ref={sourceToggle}
            type="button"
            aria-label="More file sources"
            aria-expanded={sourcesOpen}
            disabled={busy}
            onClick={() => setSourcesOpen((open) => !open)}
          >
            <ChevronDown size={16} aria-hidden />
          </button>
          {sourcesOpen && (
            <div className={styles.sourceMenu} role="menu">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setSourcesOpen(false);
                  picker.current?.click();
                }}
              >
                <Folder size={14} aria-hidden />
                From Device
              </button>
              {cloudSources.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" role="menuitem" onClick={() => openImport(id)}>
                  <Icon size={14} aria-hidden />
                  From {label}
                </button>
              ))}
              <button type="button" role="menuitem" onClick={() => openImport("url")}>
                <Link2 size={14} aria-hidden />
                From Url
              </button>
            </div>
          )}
        </div>

        <p>
          {file?.name ??
            (dragging ? "Drop a JPG, PNG, or WebP image here" : `Max file size ${imageLimitText}. JPG, PNG, and WebP.`)}
        </p>
        <small className={styles.termsNote}>
          By proceeding, you confirm you own the rights to your files and agree to our{" "}
          <Link href="/security-and-compliance">Terms of Use</Link>.
        </small>
      </div>

      <dialog
        ref={importDialog}
        className={styles.importDialog}
        aria-labelledby="import-heading"
        onCancel={(event) => {
          if (loading) event.preventDefault();
        }}
        onClose={() => sourceToggle.current?.focus()}
      >
        <h2 id="import-heading">Import from {cloudSource?.label ?? "URL"}</h2>
        <form onSubmit={importFromLink}>
          {cloudSource && (
            <p className={styles.importLead}>
              Paste a share link to a single image with public access and downloads enabled.
            </p>
          )}
          <label>
            {cloudSource ? `${cloudSource.label} share link` : "Public image URL"}
            <input
              type="url"
              name="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://"
              required
              disabled={loading}
            />
          </label>
          <button type="submit" className={styles.primary} disabled={loading || !linkUrl.trim()}>
            {loading ? "Importing…" : "Import image"}
          </button>
        </form>
        {importError && (
          <p className={styles.importError} role="alert">
            {importError}
          </p>
        )}
        <button className={styles.cancel} type="button" disabled={loading} onClick={() => importDialog.current?.close()}>
          Cancel
        </button>
      </dialog>

      {file && (
        <div className={styles.controls}>
          <label>
            Output format
            <select value={format} disabled={busy} onChange={(event) => setFormat(event.target.value as Format)}>
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="webp">WEBP</option>
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
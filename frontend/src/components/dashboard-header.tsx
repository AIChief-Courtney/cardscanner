"use client";

import { ChevronDown, FileText, Image as ImageIcon, LayoutGrid, Search, Video } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Brand } from "./brand";
import styles from "./dashboard.module.css";

const menus = {
  Convert: [
    { title: "Video & Audio", icon: Video, items: ["Video Converter", "Audio Converter", "MP3 Converter", "MP4 to MP3", "Video to MP3", "MP4 Converter", "MOV to MP4", "MP3 to OGG"] },
    { title: "Image", icon: ImageIcon, items: ["Image Converter", "WebP to PNG", "JFIF to PNG", "PNG to SVG", "HEIC to JPG", "HEIC to PNG", "WebP to JPG", "SVG Converter"] },
    { title: "PDF & Documents", icon: FileText, items: ["PDF Converter", "Document Converter", "Ebook Converter", "PDF to Word", "PDF to JPG", "PDF to EPUB", "EPUB to PDF", "HEIC to PDF", "DOCX to PDF", "JPG to PDF"] },
    { title: "GIF", icon: ImageIcon, items: ["Video to GIF", "MP4 to GIF", "WebM to GIF", "APNG to GIF", "GIF to MP4", "GIF to APNG", "Image to GIF", "MOV to GIF", "AVI to GIF"] },
    { title: "Others", icon: LayoutGrid, items: ["Unit Converter", "Time Converter", "Archive Converter"] },
  ],
  Compress: [
    { title: "Video & Audio", icon: Video, items: ["Video Compressor", "MP3 Compressor", "WAV Compressor"] },
    { title: "Image", icon: ImageIcon, items: ["Image Compressor", "JPEG Compressor", "PNG Compressor"] },
    { title: "PDF & Documents", icon: FileText, items: ["PDF Compressor"] },
    { title: "GIF", icon: ImageIcon, items: ["GIF Compressor"] },
  ],
  Tools: [
    { title: "Video Tools", icon: Video, items: ["Crop Video", "Trim Video"] },
    { title: "Image Tools", icon: ImageIcon, items: ["GIF Maker", "Resize Image", "Crop Image", "Color Picker", "Rotate Image", "Flip Image", "Image Enlarger", "Paste Image"] },
    { title: "PDF Tools", icon: FileText, items: ["Edit PDF", "Annotate PDF", "E-sign", "Create Fillable PDF", "PDF Reader", "PDF Merge", "PDF Split", "Flatten PDF", "Resize PDF", "Unlock PDF", "Rotate PDF", "Protect PDF", "Crop PDF", "Organize PDF", "Extract Image from PDF", "PDF Page Remover", "Extract Pages from PDF"] },
  ],
  API: [
    { title: "Documentation", icon: FileText, items: ["API Job Builder", "API Documentation"] },
    { title: "Conversion APIs", icon: LayoutGrid, items: ["File Conversion API", "Image Conversion API", "Audio Conversion API", "Document Conversion API", "PDF Conversion API", "MP4 Conversion API", "Video Conversion API"] },
    { title: "Specific APIs", icon: LayoutGrid, items: ["JPG to PDF API", "Video to MP3 API", "HEIC to JPG API", "PDF to JPG API", "WebP to PNG API", "PDF to Word API", "MP4 to MP3 API", "WebP to JPG API", "Word to PDF API", "HTML to PDF API", "Website Screenshot API"] },
    { title: "Compression APIs", icon: LayoutGrid, items: ["Video Compression API", "Compress PDF API", "Image Compression API"] },
  ],
};

const availableTools = new Map([
  ["Image Converter", "#converter"],
  ["WebP to PNG", "#output-png"],
  ["WebP to JPG", "#output-jpg"],
  ["Paste Image", "#paste-image"],
]);

type Menu = keyof typeof menus | "Search";
const menuNames = Object.keys(menus) as (keyof typeof menus)[];

export function DashboardHeader({ onDashboard = true, signedIn = true }: { onDashboard?: boolean; signedIn?: boolean }) {
  const [open, setOpen] = useState<Menu | null>(null);
  const [query, setQuery] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open === "Search") search.current?.focus();
  }, [open]);

  function close(restoreFocus = false) {
    setOpen(null);
    if (restoreFocus) trigger.current?.focus();
  }

  function toggle(menu: Menu, button: HTMLButtonElement) {
    trigger.current = button;
    setOpen(open === menu ? null : menu);
  }

  const searchResults = [...availableTools].filter(([name]) =>
    name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <header className={styles.topbar} data-open={open !== null}
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          event.preventDefault();
          close(true);
        }
      }}
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) close();
      }}>
      {open && <div className={styles.navBackdrop} aria-hidden="true" onClick={() => close(true)} />}
      <div className={styles.navFrame}>
        <div className={styles.navRow}>
          <Brand href={onDashboard ? "#main-content" : "/"} />
          <nav className={styles.navTabs} aria-label="Main navigation">
            {menuNames.map((menu) => (
              <button key={menu} type="button" aria-expanded={open === menu}
                aria-controls={open === menu ? "dashboard-nav-panel" : undefined}
                onClick={(event) => toggle(menu, event.currentTarget)}>
                {menu} <ChevronDown size={12} aria-hidden />
              </button>
            ))}
            <span aria-disabled="true" title="Pricing is unavailable">Pricing</span>
          </nav>
          <div className={styles.navAccount}>
            <button className={styles.searchToggle} type="button" aria-label="Search tools" aria-expanded={open === "Search"}
              aria-controls={open === "Search" ? "dashboard-nav-panel" : undefined}
              onClick={(event) => toggle("Search", event.currentTarget)}>
              <Search size={14} aria-hidden />
            </button>
            {signedIn ? (
              <>
                <Link href={onDashboard ? "#account" : "/dashboard#account"} onClick={() => close()}>My account</Link>
                <button className={styles.logout} type="button" onClick={() => signOut({ callbackUrl: "/" })}>Log out</button>
              </>
            ) : (
              <>
                <Link href="/signin">Log In</Link>
                <Link className={styles.logout} href="/signup">Sign Up</Link>
              </>
            )}
          </div>
        </div>

        {open === "Search" && (
          <section id="dashboard-nav-panel" className={styles.toolSearch} aria-label="Search available tools">
            <input ref={search} type="search" aria-label="Search available tools" placeholder="Search tools" value={query}
              onChange={(event) => setQuery(event.target.value)} />
            <ul>
              {searchResults.map(([name, href]) => <li key={name}><a href={onDashboard ? href : `/dashboard${href}`} onClick={() => close()}>{name}</a></li>)}
            </ul>
            {searchResults.length === 0 && <p>No tools found.</p>}
          </section>
        )}

        {open && open !== "Search" && (
          <section id="dashboard-nav-panel" className={styles.megaMenu} data-menu={open} aria-label={open}>
            {menus[open].map(({ title, icon: Icon, items }) => (
              <div key={title} className={styles.menuCategory}>
                <h2><Icon size={13} aria-hidden /> {title}</h2>
                <ul>
                  {items.map((item) => {
                    const href = availableTools.get(item);
                    return <li key={item}>{href ? <a href={onDashboard ? href : `/dashboard${href}`} onClick={() => close()}>{item}</a> :
                      <span aria-disabled="true" title="Unavailable">{item}</span>}</li>;
                  })}
                </ul>
              </div>
            ))}
          </section>
        )}
      </div>
    </header>
  );
}

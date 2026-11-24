import { Globe } from "lucide-react";
import Link from "next/link";
import { Brand } from "./brand";
import styles from "./reference-footer.module.css";

const referenceFooter = [
  ["Video Converter", "MP4 Converter", "Video to GIF", "MOV to MP4", "Video Converter"],
  ["Audio Converter", "MP3 Converter", "MP4 to MP3", "Video to MP3", "Audio Converter"],
  ["Image Converter", "JPG to PDF", "PDF to JPG", "HEIC to JPG", "Image to PDF", "Image Converter"],
  ["Document & Ebook", "PDF to Word", "EPUB to PDF", "EPUB to MOBI", "Document Converter"],
  ["Archive & Time", "RAR to Zip", "PST to EST", "CST to EST", "Archive Converter"],
  ["Unit Converter", "Lbs to Kg", "Kg to Lbs", "Feet to Meters", "Unit Converter"],
  ["Web Apps", "Collage Maker", "Image Resizer", "Crop Image", "Color Picker"],
  ["Mobile Apps", "Collage Maker Android", "Collage Maker iOS", "Image Converter Android", "Image Converter iOS"],
];

export function ReferenceFooter({ currentPage = false }: { currentPage?: boolean }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerGrid} aria-label="FreeConvert reference catalog">
          {referenceFooter.map(([title, ...items]) => (
            <section key={title}>
              <h2>{title}</h2>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item === "Image Converter" ? <Link href="/dashboard#converter">{item}</Link> : item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <nav className={styles.footerLinks} aria-label="Footer">
          <span>About Us</span>
          <span>Blog</span>
          <span>Donate</span>
          <span>Privacy</span>
          <span>Terms</span>
          <Link href="/security-and-compliance" aria-current={currentPage ? "page" : undefined}>Security and Compliance</Link>
          <span>Contact</span>
          <a href="https://status.freeconvert.com/" aria-label="FreeConvert Status">Status</a>
        </nav>
        <div className={styles.footerBottom}>
          <Brand />
          <small>© {new Date().getFullYear()} OnlineConvert</small>
          <span><Globe size={13} aria-hidden /> English</span>
        </div>
      </div>
    </footer>
  );
}

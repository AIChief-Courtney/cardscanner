import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Card Scanner | Convert & OCR", template: "%s | Card Scanner" },
  description:
    "Convert images, PDFs, and cards with Card Scanner. Sign in for your dashboard, uploads, and profile.",
  applicationName: "Card Scanner",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Card Scanner | Convert & OCR",
    description: "Tools mega menu, clean dashboard, and secure sign-in for your document workspace.",
    siteName: "Card Scanner",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a73e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="site-body">
        <div className="ambient-bg" aria-hidden="true">
          <span className="ambient-orb ambient-orb-a" />
          <span className="ambient-orb ambient-orb-b" />
          <span className="ambient-orb ambient-orb-c" />
          <span className="ambient-grid" />
        </div>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <div className="site-content">{children}</div>
      </body>
    </html>
  );
}
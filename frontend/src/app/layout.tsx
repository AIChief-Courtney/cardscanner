import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "FileDock | Convert, compress, and edit files", template: "%s | FileDock" },
  description: "FileDock is a demo-first conversion platform with honest adapters, pricing, and account shells.",
  applicationName: "FileDock",
  robots: { index: true, follow: true },
  openGraph: {
    title: "FileDock | Convert, compress, and edit files",
    description: "Guest-friendly workspace, typed tool registry, and labeled demo outputs.",
    siteName: "FileDock",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
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
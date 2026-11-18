import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Scratch | Sign in and get started", template: "%s | Scratch" },
  description:
    "Create a free Scratch account, sign in anytime, and use your personal dashboard. Admins manage users from one place.",
  applicationName: "Scratch",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Scratch | Sign in and get started",
    description: "Create your Scratch account or sign in to continue to your dashboard.",
    siteName: "Scratch",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0d1a",
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
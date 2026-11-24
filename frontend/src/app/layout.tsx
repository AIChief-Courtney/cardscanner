import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "OnlineConvert", template: "%s · OnlineConvert" },
  description: "Sign in, manage your balance, and use the OnlineConvert dashboard.",
  applicationName: "OnlineConvert",
  robots: { index: true, follow: true },
  openGraph: {
    title: "OnlineConvert",
    description: "User dashboard with sign-in and admin console.",
    siteName: "OnlineConvert",
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
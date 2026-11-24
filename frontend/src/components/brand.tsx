"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ChevronDown, Layers, Shield } from "lucide-react";

const dashboardMenus = [
  { label: "Convert", links: [{ href: "#converter", label: "Image Converter" }, { href: "#features", label: "Supported Formats" }] },
  { label: "Tools", links: [{ href: "#converter", label: "File Converter" }, { href: "#privacy", label: "Local Processing" }] },
];

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="brand brand--fc" aria-label="OnlineConvert home">
      <span className="brand-icon brand-icon--fc" aria-hidden>
        <Layers size={22} strokeWidth={2.25} />
      </span>
      <span className="brand-word-fc">
        Online<span className="brand-word-fc-accent">Convert</span>
      </span>
    </Link>
  );
}

export function Header({
  signedIn = false,
  admin = false,
  variant = "default",
  dashboard = false,
}: {
  signedIn?: boolean;
  admin?: boolean;
  variant?: "default" | "admin";
  dashboard?: boolean;
}) {
  if (variant === "admin") {
    return (
      <header className="header header--admin">
        <div className="header-inner header-inner--fc">
          <Brand href="/admin/overview" />
          <nav className="header-nav header-nav--fc" aria-label="Main navigation">
            <Link className="fc-nav-link" href="/admin/overview">
              <Shield size={16} aria-hidden />
              Admin
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="header header--product header--fc">
      <div className="header-inner header-inner--fc">
        <Brand href={dashboard ? "#main-content" : "/"} />
        {dashboard && (
          <nav className="dashboard-nav" aria-label="Main navigation">
            {dashboardMenus.map(({ label, links }) => (
              <details key={label} onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
              }} onKeyDown={(event) => {
                if (event.key !== "Escape" || !event.currentTarget.open) return;
                event.currentTarget.open = false;
                event.currentTarget.querySelector("summary")?.focus();
              }}>
                <summary>{label} <ChevronDown size={12} aria-hidden /></summary>
                <div>
                  {links.map((link) => (
                    <a key={link.href} href={link.href} onClick={(event) => {
                      const menu = event.currentTarget.closest("details");
                      if (menu) menu.open = false;
                    }}>{link.label}</a>
                  ))}
                </div>
              </details>
            ))}
          </nav>
        )}
        <div className="header-actions header-actions--fc">
          {!signedIn ? (
            <>
              <Link className="fc-login-link" href="/signin">
                Log In
              </Link>
              <Link className="fc-signup-btn" href="/signup">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {dashboard && <a className="fc-login-link" href="#account">My account</a>}
              {!admin && !dashboard && (
                <Link className="fc-login-link" href="/dashboard">
                  Dashboard
                </Link>
              )}
              {admin && (
                <Link className="fc-login-link" href="/admin/overview">
                  Admin
                </Link>
              )}
              <button type="button" className="fc-logout-link" onClick={() => signOut({ callbackUrl: "/" })}>
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

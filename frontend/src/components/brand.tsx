"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Layers, Shield } from "lucide-react";

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
              <a href="#converter">Convert</a>
              <a href="#features">Formats</a>
              <a href="#privacy">Privacy</a>
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

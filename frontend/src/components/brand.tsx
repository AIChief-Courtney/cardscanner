"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Layers, Shield } from "lucide-react";
import { ProductNavBar } from "@/components/user/product-nav-bar";
import { ToolSearchTrigger } from "@/components/user/tool-search-dialog";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="brand brand--fc" aria-label="FileDock home">
      <span className="brand-icon brand-icon--fc" aria-hidden>
        <Layers size={22} strokeWidth={2.25} />
      </span>
      <span className="brand-word-fc">
        File<span className="brand-word-fc-accent">Dock</span>
      </span>
    </Link>
  );
}

export function Header({
  signedIn = false,
  admin = false,
  variant = "default",
}: {
  signedIn?: boolean;
  admin?: boolean;
  variant?: "default" | "admin";
  tone?: "default" | "dashboard";
}) {
  const signupHref = signedIn ? "/dashboard" : "/signup";
  const plansHref = "/pricing";
  const brandHref = "/";

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
        <Brand href={brandHref} />

        <nav className="header-nav header-nav--fc" aria-label="Main navigation">
          <ProductNavBar />
          <Link className="fc-nav-link fc-nav-link--plain" href={plansHref}>
            Pricing
          </Link>
        </nav>

        <div className="header-actions header-actions--fc">
          <ToolSearchTrigger />
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
              <Link className="fc-signup-btn" href={signupHref}>
                Dashboard
              </Link>
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
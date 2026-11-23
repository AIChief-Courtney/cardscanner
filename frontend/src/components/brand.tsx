"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  ArrowUpRight,
  ChevronDown,
  CreditCard,
  Gem,
  LayoutDashboard,
  LogOut,
  Shield,
  UserRound,
} from "lucide-react";
import { ProductNavBar } from "@/components/user/product-nav-bar";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="brand brand--product" aria-label="Card Scanner home">
      <span className="brand-icon brand-icon--product">
        <CreditCard size={20} aria-hidden />
      </span>
      <span className="brand-word-split">
        <span className="brand-word-card">Card</span>
        <span className="brand-word-scanner">Scanner</span>
      </span>
    </Link>
  );
}

export function Header({
  signedIn = false,
  admin = false,
  variant = "default",
  tone = "default",
}: {
  signedIn?: boolean;
  admin?: boolean;
  variant?: "default" | "admin";
  tone?: "default" | "dashboard";
}) {
  const accountHref = admin ? "/admin/overview" : "/profile";
  const plansHref = signedIn ? "/dashboard#plans" : "/#plans";
  const brandHref = signedIn && !admin ? "/dashboard" : "/";

  if (variant === "admin") {
    return (
      <header className="header header--admin">
        <div className="header-inner header-inner--product">
          <Brand href="/admin/overview" />
          <nav className="header-nav" aria-label="Main navigation">
            <Link className="nav-link" href="/admin/overview">
              <Shield size={16} aria-hidden />
              Admin
            </Link>
          </nav>
          <div className="header-actions">
            <Link className="button dark small" href={accountHref}>
              Admin panel <ArrowUpRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`header header--product ${tone === "dashboard" ? "header--dashboard" : ""}`}
    >
      <div className="header-inner header-inner--product">
        <Brand href={brandHref} />
        <nav className="header-nav header-nav--product" aria-label="Main navigation">
          {signedIn && (
            <Link className="nav-link nav-link--active-hint" href="/dashboard">
              <LayoutDashboard size={16} aria-hidden />
              Dashboard
            </Link>
          )}
          <ProductNavBar />
          <Link className="nav-link nav-link--plans" href={plansHref}>
            <Gem size={16} aria-hidden className="nav-plans-icon" />
            Plans
          </Link>
        </nav>
        <div className="header-actions header-actions--product">
          <span className="lang-pill" aria-label="Language English">
            EN <ChevronDown size={14} aria-hidden />
          </span>
          {!signedIn ? (
            <Link className="button login-pill" href="/signin">
              <UserRound size={16} aria-hidden />
              Login
            </Link>
          ) : (
            <div className="account-menu">
              <Link className="button login-pill login-pill--filled" href={accountHref}>
                <UserRound size={16} aria-hidden />
                Account
              </Link>
              <button
                type="button"
                className="button outline small account-signout"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut size={15} aria-hidden /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
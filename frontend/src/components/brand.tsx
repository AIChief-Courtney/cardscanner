import Link from "next/link";
import { ScanLine, ArrowUpRight, LayoutDashboard, Shield, UserRound } from "lucide-react";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Scratch home">
      <span className="brand-icon">
        <ScanLine size={20} aria-hidden />
      </span>
      <span className="brand-word">Scratch</span>
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
}) {
  const accountHref = admin ? "/admin/overview" : "/dashboard";

  return (
    <header className={variant === "admin" ? "header header--admin" : "header"}>
      <div className="header-inner">
        <Brand />
        <nav className="header-nav" aria-label="Main navigation">
          <Link className="nav-link" href="/">
            Home
          </Link>
          {signedIn && !admin && (
            <>
              <Link className="nav-link" href="/dashboard">
                <LayoutDashboard size={16} aria-hidden />
                Dashboard
              </Link>
              <Link className="nav-link" href="/profile">
                <UserRound size={16} aria-hidden />
                Profile
              </Link>
            </>
          )}
          {signedIn && admin && (
            <Link className="nav-link" href="/admin/overview">
              <Shield size={16} aria-hidden />
              Admin
            </Link>
          )}
          {signedIn ? (
            <Link className="button dark small" href={accountHref}>
              {admin ? (
                <>
                  Admin panel <ArrowUpRight size={16} aria-hidden />
                </>
              ) : (
                <>
                  Your account <ArrowUpRight size={16} aria-hidden />
                </>
              )}
            </Link>
          ) : (
            <>
              <Link className="nav-link" href="/signin">
                Sign in
              </Link>
              <Link className="button dark small" href="/signup">
                Sign up free <ArrowUpRight size={16} aria-hidden />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
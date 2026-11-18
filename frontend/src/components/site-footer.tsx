import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="site-footer-tagline">
          <span className="text-gradient" style={{ fontWeight: 700 }}>
            Scratch
          </span>{" "}
          — simple sign-in, a personal dashboard, and admin tools when you need them.
        </p>
        <nav className="site-footer-nav" aria-label="Footer">
          <Link href="/">Home</Link>
          <Link href="/signin">Sign in</Link>
          <Link href="/signup">Sign up</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/profile">Profile</Link>
        </nav>
        <p className="site-footer-copy">© {new Date().getFullYear()} Scratch. All rights reserved.</p>
      </div>
    </footer>
  );
}
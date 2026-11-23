import Link from "next/link";

export function SiteFooter({
  signedIn = false,
  admin = false,
}: {
  signedIn?: boolean;
  admin?: boolean;
}) {
  return (
    <footer className="site-footer site-footer--product">
      <div className="site-footer-inner">
        <p className="site-footer-tagline">
          <span className="text-gradient text-gradient--blue" style={{ fontWeight: 700 }}>
            Card Scanner
          </span>{" "}
          — {signedIn ? "Convert, scan, and manage files from your dashboard." : "Browse tools as a guest — sign in for uploads and your workspace."}
        </p>
        <nav className="site-footer-nav" aria-label="Footer">
          {!signedIn && <Link href="/">Home</Link>}
          {signedIn && !admin && (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/profile">Account</Link>
            </>
          )}
          {signedIn && admin && <Link href="/admin/overview">Admin</Link>}
          {!signedIn && (
            <>
              <Link href="/signin">Login</Link>
              <Link href="/signup">Sign up</Link>
            </>
          )}
        </nav>
        <p className="site-footer-copy">© {new Date().getFullYear()} Card Scanner. All rights reserved.</p>
      </div>
    </footer>
  );
}
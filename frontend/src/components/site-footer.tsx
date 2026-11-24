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
          — {signedIn ? "Signed-in workspace." : "Sign in to open your dashboard."}
        </p>
        <nav className="site-footer-nav" aria-label="Footer">
          {!signedIn && (
            <>
              <Link href="/signin">Sign in</Link>
              <Link href="/signup">Sign up</Link>
            </>
          )}
          {signedIn && !admin && <Link href="/dashboard">Dashboard</Link>}
          {signedIn && admin && <Link href="/admin/overview">Admin</Link>}
        </nav>
        <p className="site-footer-copy">© {new Date().getFullYear()} Card Scanner. All rights reserved.</p>
      </div>
    </footer>
  );
}
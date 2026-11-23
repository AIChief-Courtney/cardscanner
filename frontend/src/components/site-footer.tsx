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
            FileDock
          </span>{" "}
          — {signedIn ? "Tasks, jobs, and billing in your account." : "Guest demos in the browser — sign in for history."}
        </p>
        <nav className="site-footer-nav" aria-label="Footer">
          <Link href="/convert">Convert</Link>
          <Link href="/compress">Compress</Link>
          <Link href="/tools">Tools</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/privacy">Privacy (draft)</Link>
          {!signedIn && <Link href="/">Home</Link>}
          {signedIn && !admin && (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/account/profile">Account</Link>
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
        <p className="site-footer-copy">© {new Date().getFullYear()} FileDock. All rights reserved.</p>
      </div>
    </footer>
  );
}
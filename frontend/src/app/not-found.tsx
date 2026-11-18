import Link from "next/link";
import { Header } from "@/components/brand";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="workspace">
        <div className="panel empty-state" style={{ marginTop: 24 }}>
          <span className="eyebrow">404</span>
          <h1 style={{ marginTop: 12 }}>Page not found</h1>
          <p className="placeholder-note">This page doesn’t exist or was moved.</p>
          <div className="empty-state-actions">
            <Link className="button dark small" href="/">
              Back home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
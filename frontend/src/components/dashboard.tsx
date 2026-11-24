import Link from "next/link";
import { CreditCard, ShieldCheck, Wallet } from "lucide-react";
import { formatUsd } from "@/lib/money";

export function Dashboard({
  email,
  balanceUsd,
}: {
  email: string;
  balanceUsd: string;
}) {
  const initial = (email.trim()[0] ?? "?").toUpperCase();

  return (
    <main id="main-content" className="user-dashboard">
      <header className="panel user-dashboard-hero">
        <div className="user-dashboard-hero-text">
          <span className="eyebrow eyebrow--product">Your workspace</span>
          <h1>Dashboard</h1>
          <p>Signed-in home for Card Scanner. More product tools will appear here as you wire them in.</p>
        </div>
        <div className="user-dashboard-account">
          <span className="user-dashboard-avatar" aria-hidden>
            {initial}
          </span>
          <div>
            <p className="user-dashboard-label">Signed in as</p>
            <p className="user-dashboard-email">{email}</p>
          </div>
        </div>
      </header>

      <div className="user-dashboard-stats">
        <article className="user-stat-card">
          <Wallet className="user-stat-icon" size={22} aria-hidden />
          <div>
            <p className="user-stat-label">Balance</p>
            <p className="user-stat-value">{formatUsd(balanceUsd)}</p>
          </div>
        </article>
        <article className="user-stat-card user-stat-card--muted">
          <ShieldCheck className="user-stat-icon" size={22} aria-hidden />
          <div>
            <p className="user-stat-label">Session</p>
            <p className="user-stat-value" style={{ fontSize: "1rem" }}>
              Active
            </p>
          </div>
        </article>
      </div>

      <section className="panel user-dashboard-tips" aria-labelledby="dash-tips">
        <h2 id="dash-tips">Next steps</h2>
        <ul className="help-list">
          <li>Use the header to sign out on shared devices.</li>
          <li>Balance updates when billing adapters are connected on the server.</li>
          <li>Need help? Contact your administrator.</li>
        </ul>
      </section>

      <section className="user-dashboard-actions" aria-labelledby="dash-actions">
        <h2 id="dash-actions">Quick links</h2>
        <div className="user-action-grid">
          <Link href="/" className="user-action-card">
            <CreditCard size={20} aria-hidden />
            <div>
              <h3>Home</h3>
              <p>Return to the public landing page.</p>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
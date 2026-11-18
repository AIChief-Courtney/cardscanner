"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Home, LayoutDashboard, LogOut, Shield, UserRound, Wallet } from "lucide-react";
import { formatUsd } from "@/lib/money";

export function Dashboard({
  email,
  balanceUsd,
  admin = false,
  adminAccessDenied = false,
}: {
  email: string;
  balanceUsd: string;
  admin?: boolean;
  adminAccessDenied?: boolean;
}) {
  const initial = (email.trim()[0] ?? "?").toUpperCase();

  return (
    <main id="main-content" className="workspace">
      <div className="workspace-heading">
        <div>
          <span className="eyebrow">Your account</span>
          <h1>Dashboard</h1>
          <div className="account-chip" aria-label={`Signed in as ${email}`}>
            <span className="account-avatar" aria-hidden>
              {initial}
            </span>
            <span>{email}</span>
          </div>
        </div>
        <button
          className="button outline small"
          type="button"
          aria-label="Sign out"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut size={16} aria-hidden /> Sign out
        </button>
      </div>

      {adminAccessDenied && !admin && (
        <div className="message error" role="alert">
          Admin access needs <strong>role = 1</strong> on your account. Set it in the database, then refresh this
          page or sign out and sign in again.
        </div>
      )}

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <div className="stat">
          <p>Balance</p>
          <strong>{formatUsd(balanceUsd)}</strong>
        </div>
      </div>

      <div className="quick-grid">
        <Link className="quick-card" href="/profile">
          <UserRound size={20} aria-hidden />
          <h3>Your profile</h3>
          <p>Edit email, balance, and password in one place.</p>
        </Link>
        <Link className="quick-card" href="/">
          <Home size={20} aria-hidden />
          <h3>Back to home</h3>
          <p>Read how Scratch works and jump into sign-up or sign-in again.</p>
        </Link>
        <div className="quick-card">
          <Wallet size={20} aria-hidden />
          <h3>Account balance</h3>
          <p>Your balance is {formatUsd(balanceUsd)} USD. Contact support if something looks wrong.</p>
        </div>
        {admin && (
          <Link className="quick-card" href="/admin">
            <Shield size={20} aria-hidden />
            <h3>Admin overview</h3>
            <p>View all users, roles, and account dates in one table.</p>
          </Link>
        )}
      </div>

      <div className="panel panel-glass">
        <div className="empty-state">
          <div className="empty-state-icon">
            <LayoutDashboard size={26} strokeWidth={1.5} aria-hidden />
          </div>
          <h3>Your workspace is ready</h3>
          <p className="placeholder-note">
            This is your personal hub after sign-in. More tools can live here later—for now, use the
            cards above to move around the site.
          </p>
          <div className="empty-state-actions">
            <Link className="button dark small" href="/">
              Explore the home page
            </Link>
            {admin && (
              <Link className="button outline small" href="/admin">
                Open admin
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 17, marginBottom: 10 }}>Quick tips</h2>
        <ul className="help-list">
          <li>Use the header anytime to reach Home or Dashboard.</li>
          <li>Sign out before using a shared or public computer.</li>
          <li>Need admin access? Ask your team owner to run the admin CLI for your email.</li>
        </ul>
      </div>
    </main>
  );
}
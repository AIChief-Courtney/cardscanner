"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { formatUsd } from "@/lib/money";
import { roleLabel } from "@backend/lib/roles";

export type ProfileUser = {
  id: string;
  email: string;
  role: number;
  roleLabel: string;
  balanceUsd: string;
  createdAt: string;
};

export function ProfileForm({ user: initial }: { user: ProfileUser }) {
  const router = useRouter();
  const [email, setEmail] = useState(initial.email);
  const [balanceUsd, setBalanceUsd] = useState(initial.balanceUsd);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const memberSince = new Date(initial.createdAt).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    const payload: Record<string, string | number> = {};
    if (email.trim().toLowerCase() !== initial.email) payload.email = email.trim();
    if (balanceUsd !== initial.balanceUsd) payload.balanceUsd = Number(balanceUsd);
    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
      payload.confirmPassword = confirmPassword;
    }

    if (!Object.keys(payload).length) {
      setError("Change at least one field before saving.");
      setBusy(false);
      return;
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error?.message ?? "Could not save profile.");

      const saved = body.user as ProfileUser;
      setEmail(saved.email);
      setBalanceUsd(saved.balanceUsd);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNotice("Profile saved.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main id="main-content" className="workspace">
      <div className="workspace-heading">
        <div>
          <span className="eyebrow">Your account</span>
          <h1>Profile</h1>
          <p>View and update your account details, balance, and password.</p>
        </div>
      </div>

      {error && (
        <div className="message error" role="alert">
          {error}
        </div>
      )}
      {notice && (
        <div className="message success" role="status">
          {notice}
        </div>
      )}

      <div className="profile-layout">
        <section className="panel profile-summary" aria-labelledby="summary-title">
          <h2 id="summary-title" style={{ fontSize: 18, marginBottom: 16 }}>
            Account overview
          </h2>
          <dl className="profile-details">
            <div>
              <dt>Account ID</dt>
              <dd className="profile-mono">{initial.id}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>
                {roleLabel(initial.role)} ({initial.role})
              </dd>
            </div>
            <div>
              <dt>Member since</dt>
              <dd>{memberSince}</dd>
            </div>
            <div>
              <dt>Balance</dt>
              <dd className="profile-balance">{formatUsd(balanceUsd)}</dd>
            </div>
          </dl>
        </section>

        <section className="panel" aria-labelledby="edit-title">
          <h2 id="edit-title" style={{ fontSize: 18, marginBottom: 8 }}>
            Edit profile
          </h2>
          <p className="placeholder-note" style={{ marginBottom: 20 }}>
            Email and balance changes save together. Password updates require your current password.
          </p>

          <form className="profile-form" onSubmit={submit}>
            <label>
              <span>Email address</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                maxLength={254}
                value={email}
                disabled={busy}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label>
              <span>Balance (USD)</span>
              <input
                type="number"
                name="balanceUsd"
                step="0.01"
                min={0}
                max={999_999_999.99}
                value={balanceUsd}
                disabled={busy}
                onChange={(e) => setBalanceUsd(e.target.value)}
              />
              <p className="field-hint">Shown as {formatUsd(balanceUsd)}</p>
            </label>

            <hr className="profile-divider" />

            <h3 className="profile-section-title">Change password</h3>
            <label>
              <span>Current password</span>
              <input
                type="password"
                name="currentPassword"
                autoComplete="current-password"
                minLength={12}
                maxLength={72}
                value={currentPassword}
                disabled={busy}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </label>
            <label>
              <span>New password</span>
              <input
                type="password"
                name="newPassword"
                autoComplete="new-password"
                minLength={12}
                maxLength={72}
                placeholder="At least 12 characters"
                value={newPassword}
                disabled={busy}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <label>
              <span>Confirm new password</span>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                minLength={12}
                maxLength={72}
                value={confirmPassword}
                disabled={busy}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>

            <button className="button dark" type="submit" disabled={busy}>
              {busy ? (
                <LoaderCircle size={17} className="spin" aria-hidden />
              ) : (
                <Save size={17} aria-hidden />
              )}
              Save changes
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
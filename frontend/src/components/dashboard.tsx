"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { formatUsd } from "@/lib/money";
import { UploadZone } from "@/components/user/upload-zone";
import { ToolsCatalog } from "@/components/user/tools-catalog";

export function Dashboard({
  email,
  balanceUsd,
}: {
  email: string;
  balanceUsd: string;
}) {
  const initial = (email.trim()[0] ?? "?").toUpperCase();

  return (
    <main id="main-content" className="user-workspace">
      <header className="dashboard-hero panel-glass" aria-labelledby="dashboard-title">
        <div className="dashboard-hero-main">
          <span className="dashboard-hero-badge">Your workspace</span>
          <h1 id="dashboard-title">Dashboard</h1>
          <p>
            Convert, compress, and edit files from the header — FreeConvert-style tools, one account.
          </p>
          <div className="dashboard-hero-pills" role="list">
            <span className="dashboard-hero-pill" role="listitem">
              Convert
            </span>
            <span className="dashboard-hero-pill" role="listitem">
              Compress
            </span>
            <span className="dashboard-hero-pill" role="listitem">
              Tools
            </span>
            <span className="dashboard-hero-pill" role="listitem">
              API
            </span>
          </div>
        </div>
        <aside className="dashboard-hero-account" aria-label="Account summary">
          <span className="dashboard-hero-avatar" aria-hidden>
            {initial}
          </span>
          <div className="dashboard-hero-account-body">
            <p className="dashboard-hero-label">Signed in as</p>
            <p className="dashboard-hero-email">{email}</p>
            <p className="dashboard-hero-balance">
              <Wallet size={16} aria-hidden />
              Balance {formatUsd(balanceUsd)}
            </p>
          </div>
          <Link className="button dark small button--blue dashboard-hero-account-btn" href="/profile">
            Account <ArrowRight size={15} aria-hidden />
          </Link>
        </aside>
      </header>

      <UploadZone />

      <section className="user-dash-highlights" aria-labelledby="dash-highlights-title">
        <h2 id="dash-highlights-title" className="sr-only">
          Highlights
        </h2>
        <article className="user-highlight-card">
          <Sparkles size={20} aria-hidden />
          <div>
            <h3>Convert · Compress · Tools</h3>
            <p>Three header menus — converters, compression, and OCR — each with its own dropdown.</p>
          </div>
        </article>
        <article className="user-highlight-card">
          <ShieldCheck size={20} aria-hidden />
          <div>
            <h3>Secure session</h3>
            <p>Sign out from the header when you leave a shared device.</p>
          </div>
        </article>
      </section>

      <ToolsCatalog signedIn />

      <section className="plans-strip panel" id="plans" aria-labelledby="plans-title">
        <div className="plans-strip-head">
          <span className="eyebrow eyebrow--product">Plans</span>
          <h2 id="plans-title">Simple pricing for growing teams</h2>
          <p>Start free on your dashboard. Upgrade when you need higher limits and priority OCR.</p>
        </div>
        <div className="plans-strip-cards">
          <article className="plan-card">
            <h3>Free</h3>
            <p className="plan-price">$0</p>
            <ul>
              <li>Core converters</li>
              <li>Standard upload size</li>
              <li>Email support</li>
            </ul>
            <span className="plan-badge">Current</span>
          </article>
          <article className="plan-card plan-card--accent">
            <h3>Pro</h3>
            <p className="plan-price">Coming soon</p>
            <ul>
              <li>Batch OCR &amp; ID card scans</li>
              <li>Larger files</li>
              <li>Priority processing</li>
            </ul>
            <button type="button" className="button dark small" disabled>
              Notify me
            </button>
          </article>
        </div>
      </section>
    </main>
  );
}
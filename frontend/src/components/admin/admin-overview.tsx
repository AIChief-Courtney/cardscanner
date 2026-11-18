"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, DollarSign, RefreshCw, UserPlus, Users } from "lucide-react";
import { formatUsd } from "@/lib/money";

type OverviewData = {
  totalUsers: number;
  adminUsers: number;
  memberUsers: number;
  totalActivities: number;
  totalRequests: number;
  totalBalanceUsd: string;
  signupsLast7Days: number;
  recentActivities: {
    id: string;
    action: string;
    summary: string;
    email: string | null;
    createdAt: string;
  }[];
  activityByAction: { action: string; count: number }[];
};

export function AdminOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error?.message ?? "Could not load overview.");
      setData(body);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load overview.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  return (
    <main id="main-content" className="admin-workspace">
      <header className="admin-page-head">
        <div>
          <h1>Overview</h1>
          <p>Platform health, balances, requests, and recent events at a glance.</p>
        </div>
        <button className="button outline small" type="button" disabled={loading} onClick={() => void load()}>
          <RefreshCw size={15} className={loading ? "spin" : undefined} aria-hidden />
          Refresh
        </button>
      </header>

      {error && (
        <div className="message error" role="alert">
          {error}
        </div>
      )}

      {loading && !data && <div className="admin-skeleton-row" aria-busy="true" />}

      {data && (
        <>
          <div className="admin-stats">
            {[
              { label: "Total users", value: data.totalUsers, icon: Users },
              { label: "Admins", value: data.adminUsers, icon: Users },
              { label: "Members", value: data.memberUsers, icon: Users },
              { label: "Sign-ups (7d)", value: data.signupsLast7Days, icon: UserPlus },
              { label: "Total balance", value: formatUsd(data.totalBalanceUsd), icon: DollarSign },
              { label: "Tracked requests", value: data.totalRequests, icon: Activity },
              { label: "Activity events", value: data.totalActivities, icon: Activity },
            ].map(({ label, value, icon: Icon }) => (
              <div className="admin-stat-card" key={label}>
                <span className="admin-stat-icon">
                  <Icon size={18} aria-hidden />
                </span>
                <p>{label}</p>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <div className="admin-split">
            <section className="admin-panel" aria-labelledby="recent-activity">
              <h2 id="recent-activity">Recent activity</h2>
              <ul className="admin-activity-feed">
                {data.recentActivities.map((row) => (
                  <li key={row.id}>
                    <div className="admin-activity-feed-main">
                      <span className="admin-activity-action">{row.action}</span>
                      <p>{row.summary}</p>
                      {row.email && <span className="admin-activity-email">{row.email}</span>}
                    </div>
                    <time dateTime={row.createdAt}>
                      {new Date(row.createdAt).toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </time>
                  </li>
                ))}
                {!data.recentActivities.length && (
                  <li className="admin-activity-empty">No activity recorded yet.</li>
                )}
              </ul>
            </section>

            <section className="admin-panel" aria-labelledby="action-breakdown">
              <h2 id="action-breakdown">Events by type</h2>
              <ul className="admin-breakdown-list">
                {data.activityByAction.map((row) => (
                  <li key={row.action}>
                    <span>{row.action}</span>
                    <strong>{row.count}</strong>
                  </li>
                ))}
                {!data.activityByAction.length && (
                  <li className="admin-activity-empty">No breakdown yet.</li>
                )}
              </ul>
            </section>
          </div>
        </>
      )}
    </main>
  );
}
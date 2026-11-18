"use client";

import { useCallback, useEffect, useState } from "react";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { formatUsd } from "@/lib/money";
import { roleLabel } from "@backend/lib/roles";

type ActivityRow = {
  id: string;
  action: string;
  summary: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    role: number;
    balanceUsd: string;
    requestCount: number;
  } | null;
};

type ActivityData = {
  page: number;
  pageSize: number;
  total: number;
  totalActivities: number;
  totalRequests: number;
  totalBalanceUsd: string;
  actionTypes: { action: string; count: number }[];
  activities: ActivityRow[];
};

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export function AdminActivity() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [actionFilter, setActionFilter] = useState("");
  const [data, setData] = useState<ActivityData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (actionFilter) params.set("action", actionFilter);
      const res = await fetch(`/api/admin/activity?${params}`, { cache: "no-store" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error?.message ?? "Could not load activity.");
      setData(body);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load activity.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, actionFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;

  return (
    <main id="main-content" className="admin-workspace">
      <header className="admin-page-head">
        <div>
          <h1>Activity</h1>
          <p>Audit trail of sign-ins, sign-ups, profile edits, and admin changes.</p>
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

      {data && (
        <div className="admin-overview" aria-label="Totals">
          <div className="admin-overview-item">
            <span>Events (filtered)</span>
            <strong>{data.total}</strong>
          </div>
          <div className="admin-overview-item">
            <span>All events</span>
            <strong>{data.totalActivities}</strong>
          </div>
          <div className="admin-overview-item">
            <span>User requests</span>
            <strong>{data.totalRequests}</strong>
          </div>
          <div className="admin-overview-item">
            <span>Total balance</span>
            <strong>{formatUsd(data.totalBalanceUsd)}</strong>
          </div>
        </div>
      )}

      {loading && !data && <div className="admin-skeleton-row" aria-busy="true" />}

      {data && (
        <section className="admin-panel">
          <div className="admin-table-toolbar">
            <h2>Event log</h2>
            <div className="admin-filters">
              <label className="page-size-control">
                Filter
                <select
                  className="table-select"
                  value={actionFilter}
                  onChange={(e) => {
                    setActionFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All types</option>
                  {data.actionTypes.map((a) => (
                    <option key={a.action} value={a.action}>
                      {a.action} ({a.count})
                    </option>
                  ))}
                </select>
              </label>
              <label className="page-size-control">
                Per page
                <select
                  className="table-select"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">When</th>
                  <th scope="col">Action</th>
                  <th scope="col">Summary</th>
                  <th scope="col">User</th>
                  <th scope="col">Role</th>
                  <th scope="col">Balance</th>
                  <th scope="col">Requests</th>
                </tr>
              </thead>
              <tbody>
                {data.activities.map((row) => (
                  <tr key={row.id}>
                    <td className="table-muted">
                      {new Date(row.createdAt).toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td>
                      <span className="admin-activity-action">{row.action}</span>
                    </td>
                    <td>{row.summary}</td>
                    <td>{row.user?.email ?? "—"}</td>
                    <td>{row.user ? roleLabel(row.user.role) : "—"}</td>
                    <td>{row.user ? formatUsd(row.user.balanceUsd) : "—"}</td>
                    <td>{row.user?.requestCount ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.activities.length && (
              <div className="empty-state">
                <h3>No activity</h3>
                <p>Try another filter or perform actions as a user.</p>
              </div>
            )}
          </div>

          <div className="pagination" aria-label="Pagination">
            <span>
              Page {page} of {totalPages}
            </span>
            <div>
              <button
                className="button outline small"
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <button
                className="button outline small"
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      )}

      {loading && data && (
        <p className="table-muted" role="status">
          <LoaderCircle size={14} className="spin" style={{ display: "inline" }} /> Updating…
        </p>
      )}
    </main>
  );
}
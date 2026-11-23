"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, LoaderCircle } from "lucide-react";
import { formatUsd } from "@/lib/money";

type ActivityRow = {
  id: string;
  kind: "AUTH" | "TRANSACTION";
  action: string;
  summary: string;
  amountUsd: string | null;
  balanceAfterUsd: string | null;
  createdAt: string;
};

function actionLabel(action: string): string {
  switch (action) {
    case "sign_in":
      return "Sign in";
    case "sign_up":
      return "Sign up";
    case "sign_out":
      return "Sign out";
    case "balance_change":
      return "Balance";
    default:
      return action.replaceAll("_", " ");
  }
}

export function ProfileActivity() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<ActivityRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/profile/activity?page=${page}&pageSize=15`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error?.message ?? "Could not load activity.");
      setRows(body.activities);
      setTotal(body.total);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load activity.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / 15));

  return (
    <section className="panel profile-activity" aria-labelledby="profile-activity-heading">
      <div className="workspace-heading" style={{ marginBottom: 16 }}>
        <div>
          <span className="eyebrow">History</span>
          <h2 id="profile-activity-heading">Your activity</h2>
          <p>Sign-in events and balance transactions on your account.</p>
        </div>
      </div>

      {error && (
        <div className="message error" role="alert">
          {error}
        </div>
      )}

      {loading && !rows.length && (
        <p className="placeholder-note" role="status">
          <LoaderCircle size={16} className="spin" aria-hidden /> Loading activity…
        </p>
      )}

      <ul className="profile-activity-list">
        {rows.map((row) => (
          <li key={row.id} className={`profile-activity-item profile-activity-item--${row.kind.toLowerCase()}`}>
            <span className="profile-activity-icon" aria-hidden>
              <Activity size={16} />
            </span>
            <div className="profile-activity-main">
              <span className="profile-activity-type">{actionLabel(row.action)}</span>
              <p>{row.summary}</p>
              {row.kind === "TRANSACTION" && row.amountUsd != null && (
                <span
                  className={
                    Number(row.amountUsd) >= 0 ? "profile-activity-delta credit" : "profile-activity-delta debit"
                  }
                >
                  {Number(row.amountUsd) >= 0 ? "+" : ""}
                  {formatUsd(row.amountUsd)}
                </span>
              )}
            </div>
            <time className="profile-activity-time" dateTime={row.createdAt}>
              {new Date(row.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
            </time>
          </li>
        ))}
      </ul>

      {!loading && !rows.length && !error && (
        <div className="empty-state">
          <p>No sign-ins or transactions recorded yet.</p>
        </div>
      )}

      {total > 15 && (
        <div className="pagination" style={{ marginTop: 16 }}>
          <span>
            Page {page} of {totalPages}
          </span>
          <div>
            <button
              className="button outline small"
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <button
              className="button outline small"
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, LoaderCircle, RefreshCw, RotateCcw } from "lucide-react";
import { ROLE_ADMIN, ROLE_USER, isAdmin, roleLabel } from "@backend/lib/roles";

type AdminUser = {
  id: string;
  email: string;
  role: number;
  balanceUsd: string;
  requestCount: number;
  createdAt: string;
};

type AdminData = {
  totalUsers: number;
  adminUsers: number;
  users: AdminUser[];
  page: number;
  pageSize: number;
};

type RowDraft = { email: string; role: number; balanceUsd: string };

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export function AdminUsers() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [data, setData] = useState<AdminData | null>(null);
  const [drafts, setDrafts] = useState<Record<string, RowDraft>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const applyAdminPayload = useCallback((body: AdminData) => {
    setData(body);
    const next: Record<string, RowDraft> = {};
    for (const u of body.users) {
      next[u.id] = { email: u.email, role: u.role, balanceUsd: u.balanceUsd };
    }
    setDrafts(next);
  }, []);

  const load = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!opts?.silent) setLoading(true);
      try {
        const res = await fetch(`/api/admin?page=${page}&pageSize=${pageSize}`, { cache: "no-store" });
        const body = (await res.json()) as AdminData & { error?: { message: string } };
        if (!res.ok) throw new Error(body.error?.message ?? "Could not load users.");
        applyAdminPayload(body);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load users.");
      } finally {
        if (!opts?.silent) setLoading(false);
      }
    },
    [page, pageSize, applyAdminPayload],
  );

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onFocus = () => void load({ silent: true });
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  function setDraft(id: string, patch: Partial<RowDraft>) {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));
  }

  function resetRow(user: AdminUser) {
    setDraft(user.id, { email: user.email, role: user.role, balanceUsd: user.balanceUsd });
    setNotice("");
  }

  function rowDirty(user: AdminUser): boolean {
    const d = drafts[user.id];
    if (!d) return false;
    return d.email !== user.email || d.role !== user.role || d.balanceUsd !== user.balanceUsd;
  }

  async function saveRow(user: AdminUser) {
    const draft = drafts[user.id];
    if (!draft || !rowDirty(user)) return;

    setSavingId(user.id);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          email: draft.email !== user.email ? draft.email : undefined,
          role: draft.role !== user.role ? draft.role : undefined,
          balanceUsd:
            draft.balanceUsd !== user.balanceUsd ? Number(draft.balanceUsd) : undefined,
        }),
        cache: "no-store",
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error?.message ?? "Could not save changes.");

      const saved = body.user as AdminUser;
      setNotice(`Saved changes for ${saved.email}.`);
      await load({ silent: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save changes.");
    } finally {
      setSavingId(null);
    }
  }

  const memberUsers = data ? data.totalUsers - data.adminUsers : 0;
  const effectivePageSize = data?.pageSize ?? pageSize;
  const totalPages = data ? Math.max(1, Math.ceil(data.totalUsers / effectivePageSize)) : 1;

  return (
    <main id="main-content" className="admin-workspace">
      <header className="admin-page-head">
        <div>
          <h1>Users</h1>
          <p>Manage accounts. Admins sort to the top automatically.</p>
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
      {notice && (
        <div className="message success" role="status">
          {notice}
        </div>
      )}

      {loading && !data && !error && <div className="admin-skeleton-row" aria-busy="true" />}

      {data && (
        <>
          <div className="admin-overview">
            <div className="admin-overview-item">
              <span>Total</span>
              <strong>{data.totalUsers}</strong>
            </div>
            <div className="admin-overview-item">
              <span>Admins</span>
              <strong>{data.adminUsers}</strong>
            </div>
            <div className="admin-overview-item">
              <span>Members</span>
              <strong>{memberUsers}</strong>
            </div>
          </div>

          <section className="admin-panel">
            <div className="admin-table-toolbar">
              <h2>All users</h2>
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

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Balance</th>
                    <th scope="col">Requests</th>
                    <th scope="col">Joined</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((u) => {
                    const draft = drafts[u.id] ?? {
                      email: u.email,
                      role: u.role,
                      balanceUsd: u.balanceUsd,
                    };
                    const dirty = rowDirty(u);
                    const saving = savingId === u.id;
                    return (
                      <tr
                        key={u.id}
                        className={[dirty && "row-dirty", isAdmin(u.role) && "row-admin"]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <td>
                          <input
                            className="table-input"
                            type="email"
                            value={draft.email}
                            maxLength={254}
                            disabled={saving}
                            aria-label={`Email for ${u.email}`}
                            onChange={(e) => setDraft(u.id, { email: e.target.value })}
                          />
                        </td>
                        <td>
                          <select
                            className="table-select"
                            value={draft.role}
                            disabled={saving}
                            aria-label={`Role for ${u.email}`}
                            onChange={(e) => setDraft(u.id, { role: Number(e.target.value) })}
                          >
                            <option value={ROLE_USER}>User (0)</option>
                            <option value={ROLE_ADMIN}>Admin (1)</option>
                          </select>
                          <span className="admin-role-tag">{roleLabel(draft.role)}</span>
                        </td>
                        <td>
                          <input
                            className="table-input table-input-narrow"
                            type="number"
                            min={0}
                            step={0.01}
                            value={draft.balanceUsd}
                            disabled={saving}
                            aria-label={`Balance for ${u.email}`}
                            onChange={(e) => setDraft(u.id, { balanceUsd: e.target.value })}
                          />
                        </td>
                        <td className="table-muted">{u.requestCount}</td>
                        <td className="table-muted">
                          {new Date(u.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                        </td>
                        <td className="table-actions">
                          <button
                            className="button dark small"
                            type="button"
                            disabled={!dirty || saving}
                            onClick={() => void saveRow(u)}
                          >
                            {saving ? <LoaderCircle size={14} className="spin" /> : <Check size={14} />}
                            Save
                          </button>
                          <button
                            className="button outline small"
                            type="button"
                            disabled={!dirty || saving}
                            onClick={() => resetRow(u)}
                            aria-label={`Reset ${u.email}`}
                          >
                            <RotateCcw size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pagination">
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
        </>
      )}
    </main>
  );
}
"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, LoaderCircle, RefreshCw, RotateCcw, Shield, UserRound, Users } from "lucide-react";
import { ROLE_ADMIN, ROLE_USER, isAdmin, roleLabel } from "@backend/lib/roles";

type AdminUser = { id: string; email: string; role: number; balanceUsd: string; createdAt: string };

type AdminData = {
  totalUsers: number;
  adminUsers: number;
  users: AdminUser[];
  page: number;
  pageSize: number;
};

type RowDraft = { email: string; role: number; balanceUsd: string };

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export function Admin() {
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
        const res = await fetch(`/api/admin?page=${page}&pageSize=${pageSize}`, {
          cache: "no-store",
        });
        const body = (await res.json()) as AdminData & { error?: { message: string } };
        if (!res.ok) throw new Error(body.error?.message ?? "Could not load admin data.");
        applyAdminPayload(body);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load admin data.");
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
    function onFocus() {
      void load({ silent: true });
    }
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
      setNotice(`Saved ${saved.email}.`);
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

  const statCards = [
    { label: "Total users", value: data?.totalUsers, icon: Users },
    { label: "Administrators", value: data?.adminUsers, icon: Shield },
    { label: "Members", value: memberUsers, icon: UserRound },
  ] as const;

  return (
    <main id="main-content" className="workspace admin-workspace">
      <div className="admin-topbar">
        <div>
          <span className="eyebrow">Administration</span>
          <h1>User management</h1>
          <p>
            Admins appear first. Edits save to the database and the table refreshes automatically. Role{" "}
            <strong>0</strong> = user, <strong>1</strong> = admin.
          </p>
          <div className="admin-topbar-meta">
            <span className="admin-meta-chip">
              <Shield size={13} aria-hidden /> Secure session
            </span>
            <span className="admin-meta-chip">
              <RefreshCw size={13} aria-hidden /> Live on focus
            </span>
          </div>
        </div>
        <button
          className="button outline small"
          type="button"
          disabled={loading}
          onClick={() => void load()}
        >
          <RefreshCw size={16} className={loading ? "spin" : undefined} aria-hidden />
          Refresh data
        </button>
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

      {loading && !data && !error && (
        <div className="admin-stats" aria-busy="true" aria-label="Loading admin data">
          <div className="skeleton-block" />
          <div className="skeleton-block" />
          <div className="skeleton-block" />
        </div>
      )}

      {data && (
        <>
          <div className="admin-stats">
            {statCards.map(({ label, value, icon: Icon }) => (
              <div className="admin-stat-card" key={label}>
                <span className="admin-stat-icon" aria-hidden>
                  <Icon size={20} />
                </span>
                <div>
                  <p>{label}</p>
                  <strong>{value ?? "—"}</strong>
                </div>
              </div>
            ))}
          </div>

          <section className="admin-panel" aria-labelledby="admin-users-heading">
            <div className="admin-table-toolbar">
              <h2 id="admin-users-heading">All users</h2>
              <label className="page-size-control">
                <span>Rows per page</span>
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

            <div className="table-wrap admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col">Balance (USD)</th>
                  <th scope="col">Created</th>
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
                      className={[dirty && "row-dirty", isAdmin(u.role) && "row-admin"].filter(Boolean).join(" ")}
                    >
                      <td>
                        <label className="sr-only" htmlFor={`email-${u.id}`}>
                          Email for {u.email}
                        </label>
                        <input
                          id={`email-${u.id}`}
                          className="table-input"
                          type="email"
                          value={draft.email}
                          maxLength={254}
                          disabled={saving}
                          onChange={(e) => setDraft(u.id, { email: e.target.value })}
                        />
                      </td>
                      <td>
                        <label className="sr-only" htmlFor={`role-${u.id}`}>
                          Role for {u.email}
                        </label>
                        <select
                          id={`role-${u.id}`}
                          className="table-select"
                          value={draft.role}
                          disabled={saving}
                          onChange={(e) => setDraft(u.id, { role: Number(e.target.value) })}
                        >
                          <option value={ROLE_USER}>0 — {roleLabel(ROLE_USER)}</option>
                          <option value={ROLE_ADMIN}>1 — {roleLabel(ROLE_ADMIN)}</option>
                        </select>
                      </td>
                      <td>
                        <label className="sr-only" htmlFor={`balance-${u.id}`}>
                          Balance in USD for {u.email}
                        </label>
                        <input
                          id={`balance-${u.id}`}
                          className="table-input table-input-narrow"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step={0.01}
                          value={draft.balanceUsd}
                          disabled={saving}
                          onChange={(e) => setDraft(u.id, { balanceUsd: e.target.value })}
                        />
                      </td>
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
                          {saving ? (
                            <LoaderCircle size={15} className="spin" aria-hidden />
                          ) : (
                            <Check size={15} aria-hidden />
                          )}
                          Save
                        </button>
                        <button
                          className="button outline small"
                          type="button"
                          disabled={!dirty || saving}
                          onClick={() => resetRow(u)}
                          title="Reset row"
                        >
                          <RotateCcw size={15} aria-hidden />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!data.users.length && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Users size={24} aria-hidden />
                </div>
                <h3>No users on this page</h3>
                <p>Try the previous page or wait for new sign-ups.</p>
              </div>
            )}

            <div className="pagination" aria-label="User list pagination">
              <span>
                Page {page} of {totalPages} · {data.totalUsers} user{data.totalUsers === 1 ? "" : "s"} total ·{" "}
                {effectivePageSize} per page
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
          </div>
          </section>
        </>
      )}

      {loading && data && (
        <p className="admin-loading-hint" role="status">
          <LoaderCircle size={14} className="spin" aria-hidden /> Updating list…
        </p>
      )}
    </main>
  );
}
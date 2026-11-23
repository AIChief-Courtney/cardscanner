"use client";



import { useCallback, useEffect, useRef, useState } from "react";

import { LoaderCircle, RefreshCw } from "lucide-react";

import { formatUsd } from "@/lib/money";

import { roleLabel, isAdmin } from "@backend/lib/roles";

import { AdminAreaChart, AdminHBarChart, AdminKpiGrid } from "./charts";



type ActivityRow = {

  id: string;

  kind?: string;

  action: string;

  summary: string;

  amountUsd?: string | null;

  balanceAfterUsd?: string | null;

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

  activityByDay: { date: string; count: number }[];

  trendDays: number;

  actionTypes: { action: string; count: number }[];

  activities: ActivityRow[];

};



const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;



type ListSlice = Pick<ActivityData, "page" | "pageSize" | "total" | "activities">;



export function AdminActivity({

  initialData = null,

  initialError = null,

}: {

  initialData?: ActivityData | null;

  initialError?: string | null;

}) {

  const [page, setPage] = useState(initialData?.page ?? 1);

  const [pageSize, setPageSize] = useState(initialData?.pageSize ?? 20);

  const [actionFilter, setActionFilter] = useState("");

  const [data, setData] = useState<ActivityData | null>(initialData);

  const [error, setError] = useState(initialError ?? "");

  const [loading, setLoading] = useState(!initialData && !initialError);

  const [listLoading, setListLoading] = useState(false);



  const statsKeyRef = useRef(actionFilter);
  const hasStatsRef = useRef(!!initialData);
  const skipFirstFetch = useRef(!!initialData);




  const applyList = useCallback((slice: ListSlice) => {

    setData((prev) => (prev ? { ...prev, ...slice } : null));

  }, []);



  const loadFull = useCallback(async (opts?: { silent?: boolean }) => {

    if (!opts?.silent) setLoading(true);

    try {

      const params = new URLSearchParams({

        page: String(page),

        pageSize: String(pageSize),

      });

      if (actionFilter) params.set("action", actionFilter);

      const res = await fetch(`/api/admin/activity?${params}`);

      const body = (await res.json()) as ActivityData & { error?: { message: string } };

      if (!res.ok) throw new Error(body.error?.message ?? "Could not load activity.");

      setData(body);

      statsKeyRef.current = actionFilter;
      hasStatsRef.current = true;

      setError("");

    } catch (e) {

      setError(e instanceof Error ? e.message : "Could not load activity.");

    } finally {

      if (!opts?.silent) setLoading(false);

    }

  }, [page, pageSize, actionFilter]);



  const loadListOnly = useCallback(async () => {

    setListLoading(true);

    try {

      const params = new URLSearchParams({

        page: String(page),

        pageSize: String(pageSize),

        listOnly: "1",

      });

      if (actionFilter) params.set("action", actionFilter);

      const res = await fetch(`/api/admin/activity?${params}`);

      const body = (await res.json()) as ListSlice & { error?: { message: string } };

      if (!res.ok) throw new Error(body.error?.message ?? "Could not load events.");

      applyList(body);

      setError("");

    } catch (e) {

      setError(e instanceof Error ? e.message : "Could not load events.");

    } finally {

      setListLoading(false);

    }

  }, [page, pageSize, actionFilter, applyList]);



  useEffect(() => {
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return;
    }

    const needFull = !hasStatsRef.current || statsKeyRef.current !== actionFilter;
    if (needFull) {
      void loadFull({ silent: hasStatsRef.current });
    } else {
      void loadListOnly();
    }
  }, [page, pageSize, actionFilter, loadFull, loadListOnly]);



  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;

  const busy = loading || listLoading;



  return (

    <main id="main-content" className="admin-workspace admin-workspace--wide">

      <header className="admin-page-head">

        <div>

          <h1>Activity</h1>

          <p>Audit trail with trends — sign-ins, updates, and admin actions.</p>

        </div>

        <button

          className="button outline small"

          type="button"

          disabled={busy}

          onClick={() => void loadFull({ silent: !!data })}

        >

          <RefreshCw size={15} className={busy ? "spin" : undefined} aria-hidden />

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

          <AdminKpiGrid

            items={[

              { label: "Matching events", value: data.total.toLocaleString() },

              { label: "All events", value: data.totalActivities.toLocaleString() },

              { label: "User requests", value: data.totalRequests.toLocaleString() },

            ]}

          />



          <div className="admin-chart-stack">

            <AdminAreaChart

              points={data.activityByDay}

              title="Event volume"

              subtitle={`Last ${data.trendDays} days — all event types`}

              tall

            />

            <AdminHBarChart items={data.actionTypes.slice(0, 8)} title="By type" />

          </div>



          <section className="admin-panel">

            <div className="admin-table-toolbar">

              <h2>Event log</h2>

              <div className="admin-filters">

                <label className="page-size-control">

                  Type

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



            <div className="admin-table-wrap admin-table-wrap--scroll">

              <table className="admin-table admin-table--readable admin-table--comfort">

                <thead>

                  <tr>

                    <th scope="col">When</th>

                    <th scope="col">Event</th>

                    <th scope="col">User</th>

                  </tr>

                </thead>

                <tbody>

                  {data.activities.map((row) => (

                    <tr key={row.id}>

                      <td className="admin-cell-when">

                        <time dateTime={row.createdAt}>

                          {new Date(row.createdAt).toLocaleString(undefined, {

                            dateStyle: "medium",

                            timeStyle: "short",

                          })}

                        </time>

                      </td>

                      <td className="admin-cell-event">

                        <span className="admin-pill admin-pill--action">{row.action}</span>

                        <p className="admin-event-summary">{row.summary}</p>

                      </td>

                      <td className="admin-cell-user">

                        <span className="admin-cell-email">{row.user?.email ?? "System"}</span>

                        {row.user ? (

                          <span

                            className={`admin-pill admin-pill--sm ${

                              isAdmin(row.user.role) ? "admin-pill--admin" : "admin-pill--user"

                            }`}

                          >

                            {roleLabel(row.user.role)}

                          </span>

                        ) : null}

                      </td>

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

                {listLoading ? (

                  <>

                    {" "}

                    <LoaderCircle size={14} className="spin" style={{ display: "inline", verticalAlign: "-2px" }} />

                  </>

                ) : null}

              </span>

              <div>

                <button

                  className="button outline small"

                  type="button"

                  disabled={page <= 1 || busy}

                  onClick={() => setPage((p) => p - 1)}

                >

                  Previous

                </button>

                <button

                  className="button outline small"

                  type="button"

                  disabled={page >= totalPages || busy}

                  onClick={() => setPage((p) => p + 1)}

                >

                  Next

                </button>

              </div>

            </div>

          </section>

        </>

      )}



      {loading && data && (

        <p className="table-muted admin-refresh-hint" role="status">

          <LoaderCircle size={14} className="spin" style={{ display: "inline" }} /> Updating metrics…

        </p>

      )}

    </main>

  );

}

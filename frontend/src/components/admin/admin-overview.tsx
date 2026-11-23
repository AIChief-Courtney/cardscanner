"use client";



import { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";

import { ArrowRight, RefreshCw } from "lucide-react";

import { formatUsd } from "@/lib/money";

import { AdminKpiGrid } from "./charts";
import { AdminChartDetailModal } from "./chart-detail-modal";
import {
  CHART_STYLE_OPTIONS,
  OverviewActivityDetail,
  OverviewActivityPreview,
  OverviewEventsDetail,
  OverviewEventsPreview,
  OverviewSignupsDetail,
  OverviewSignupsPreview,
  type OverviewChartId,
  type OverviewChartStyle,
} from "./overview-charts";



export type OverviewRange = "today" | "week" | "month";



type OverviewData = {

  range: OverviewRange;

  totalUsers: number;

  adminUsers: number;

  memberUsers: number;

  totalActivities: number;

  totalRequests: number;

  totalBalanceUsd: string;

  signupsInPeriod: number;

  activityByDay: { date: string; count: number }[];

  signupsByDay: { date: string; count: number }[];

  trendDays: number;

  recentActivities: {

    id: string;

    action: string;

    summary: string;

    email: string | null;

    createdAt: string;

  }[];

  activityByAction: { action: string; count: number }[];

};



const RANGE_OPTIONS: { id: OverviewRange; label: string }[] = [

  { id: "today", label: "Today" },

  { id: "week", label: "Last week" },

  { id: "month", label: "Last month" },

];



function signupHint(range: OverviewRange, count: number): string {

  if (range === "today") return `${count} new today`;

  if (range === "month") return `${count} new this month`;

  return `${count} new this week`;

}



function periodEventsLabel(range: OverviewRange): string {

  if (range === "today") return "Events (today)";

  if (range === "month") return "Events (30d)";

  return "Events (7d)";

}



export function AdminOverview({

  initialData = null,

  initialError = null,

}: {

  initialData?: OverviewData | null;

  initialError?: string | null;

}) {

  const [range, setRange] = useState<OverviewRange>(initialData?.range ?? "week");

  const [data, setData] = useState<OverviewData | null>(initialData);

  const [error, setError] = useState(initialError ?? "");

  const [loading, setLoading] = useState(!initialData && !initialError);

  const skipRangeFetch = useRef(!!initialData);
  const [detailChart, setDetailChart] = useState<OverviewChartId | null>(null);
  const [chartStyle, setChartStyle] = useState<OverviewChartStyle>("area");

  useEffect(() => {
    const stored = localStorage.getItem("adminOverviewChartStyle");
    if (stored === "area" || stored === "bar" || stored === "line") setChartStyle(stored);
  }, []);

  const pickChartStyle = (style: OverviewChartStyle) => {
    setChartStyle(style);
    localStorage.setItem("adminOverviewChartStyle", style);
  };



  const load = useCallback(async (nextRange: OverviewRange, opts?: { silent?: boolean }) => {

    const silent = opts?.silent ?? false;

    if (!silent) setLoading(true);

    try {

      const res = await fetch(`/api/admin/overview?range=${nextRange}`);

      const body = await res.json();

      if (!res.ok) throw new Error(body.error?.message ?? "Could not load overview.");

      setData(body);

      setRange(body.range ?? nextRange);

      setError("");

    } catch (e) {

      setError(e instanceof Error ? e.message : "Could not load overview.");

    } finally {

      if (!silent) setLoading(false);

    }

  }, []);



  useEffect(() => {

    if (!initialData) void load("week");

  }, [load, initialData]);



  useEffect(() => {

    if (skipRangeFetch.current) {

      skipRangeFetch.current = false;

      return;

    }

    void load(range, { silent: true });

  }, [range, load]);



  const eventsInPeriod = data?.activityByDay.reduce((s, d) => s + d.count, 0) ?? 0;



  return (

    <main id="main-content" className="admin-workspace admin-workspace--wide">

      <header className="admin-page-head">

        <div>

          <h1>Overview</h1>

          <p>Metrics, trends, and the latest events across your platform.</p>

        </div>

        <div className="admin-page-head-actions">
          <div className="admin-range-toggle" role="tablist" aria-label="Chart style">
            {CHART_STYLE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={chartStyle === opt.id}
                className={chartStyle === opt.id ? "is-active" : undefined}
                onClick={() => pickChartStyle(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="admin-range-toggle" role="tablist" aria-label="Time range">

            {RANGE_OPTIONS.map((opt) => (

              <button

                key={opt.id}

                type="button"

                role="tab"

                aria-selected={range === opt.id}

                className={range === opt.id ? "is-active" : undefined}

                disabled={loading}

                onClick={() => setRange(opt.id)}

              >

                {opt.label}

              </button>

            ))}

          </div>

          <button

            className="button outline small"

            type="button"

            disabled={loading}

            onClick={() => void load(range, { silent: !!data })}

          >

            <RefreshCw size={15} className={loading ? "spin" : undefined} aria-hidden />

            Refresh

          </button>

        </div>

      </header>



      {error && (

        <div className="message error" role="alert">

          <p>{error}</p>

          {error.toLowerCase().includes("database") || error.includes("P20") ? (

            <p className="admin-error-hint">Run <code>npm run db:migrate</code> from the project root, then refresh.</p>

          ) : null}

        </div>

      )}



      {loading && !data && (

        <div className="admin-loading-panel" aria-busy="true" aria-label="Loading overview">

          <div className="admin-skeleton-row" />

          <div className="admin-chart-grid">

            <div className="admin-skeleton-row admin-skeleton-chart" />

            <div className="admin-skeleton-row admin-skeleton-chart" />

          </div>

        </div>

      )}



      {data && (

        <>

          <AdminKpiGrid

            items={[

              {

                label: "Users",

                value: data.totalUsers,

                hint: data ? signupHint(data.range, data.signupsInPeriod) : undefined,

              },

              { label: "Admins", value: data.adminUsers, hint: `${data.memberUsers} members` },

              { label: "Total balance", value: formatUsd(data.totalBalanceUsd) },

              { label: "API requests", value: data.totalRequests.toLocaleString() },

              {

                label: periodEventsLabel(data.range),

                value: eventsInPeriod,

                hint: `${data.totalActivities} all time`,

              },

            ]}

          />



          <div className="admin-overview-dashboard">

            <div className="admin-chart-row admin-chart-row--trends">
              <OverviewActivityPreview
                points={data.activityByDay}
                trendDays={data.trendDays}
                style={chartStyle}
                onOpen={() => setDetailChart("activity")}
              />
              <OverviewSignupsPreview
                points={data.signupsByDay}
                trendDays={data.trendDays}
                style={chartStyle}
                onOpen={() => setDetailChart("signups")}
              />
            </div>

            <div className="admin-chart-row admin-chart-row--split">
              <OverviewEventsPreview
                items={data.activityByAction}
                style={chartStyle}
                onOpen={() => setDetailChart("events")}
              />

              <section className="admin-panel admin-panel--pad admin-panel--flush" aria-labelledby="recent-activity">

                <div className="admin-panel-title-row">

                  <h2 id="recent-activity">Latest events</h2>

                  <Link className="admin-link" href="/admin/activity">

                    View all <ArrowRight size={14} aria-hidden />

                  </Link>

                </div>

                <ul className="admin-activity-feed admin-activity-feed--dense">

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

            </div>

          </div>

          <AdminChartDetailModal
            open={detailChart === "activity"}
            title="Activity — detail"
            subtitle={`${chartStyle} chart · ${data.trendDays} day${data.trendDays === 1 ? "" : "s"}`}
            onClose={() => setDetailChart(null)}
          >
            <OverviewActivityDetail points={data.activityByDay} trendDays={data.trendDays} style={chartStyle} />
          </AdminChartDetailModal>

          <AdminChartDetailModal
            open={detailChart === "signups"}
            title="New sign-ups — detail"
            subtitle={`${chartStyle} chart · ${data.trendDays} day${data.trendDays === 1 ? "" : "s"}`}
            onClose={() => setDetailChart(null)}
          >
            <OverviewSignupsDetail points={data.signupsByDay} trendDays={data.trendDays} style={chartStyle} />
          </AdminChartDetailModal>

          <AdminChartDetailModal
            open={detailChart === "events"}
            title="Events by type — detail"
            subtitle="Full breakdown for the selected period"
            onClose={() => setDetailChart(null)}
          >
            <OverviewEventsDetail items={data.activityByAction} style={chartStyle} />
          </AdminChartDetailModal>
        </>

      )}

    </main>

  );

}



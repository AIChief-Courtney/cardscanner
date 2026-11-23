"use client";

import { useId, type ReactNode } from "react";
import { niceYTop, SvgCartesianAxes } from "./chart-axis";
import {
  AdminAreaChart,
  AdminBarChart,
  AdminDonutChart,
  AdminHBarChart,
  axisDateLabel,
} from "./charts";

type Point = { date: string; count: number };
type NamedCount = { action: string; count: number };

export type OverviewChartId = "activity" | "signups" | "events";
export type OverviewChartStyle = "area" | "bar" | "line";

export const CHART_STYLE_OPTIONS: { id: OverviewChartStyle; label: string }[] = [
  { id: "area", label: "Area" },
  { id: "bar", label: "Bar" },
  { id: "line", label: "Line" },
];

const PREVIEW_W = 420;
const PREVIEW_H = 176;
const P = { t: 20, r: 16, b: 40, l: 42 };
const DONUT_PREVIEW = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

function maxCount(points: Point[]) {
  return Math.max(0, ...points.map((p) => p.count));
}

function yAxisTop(max: number) {
  return niceYTop(max);
}

function axisTickChar(iso: string, total: number) {
  const d = new Date(iso + "T12:00:00Z");
  if (total <= 1) return "•";
  if (total <= 7) {
    const n = d.toLocaleDateString(undefined, { weekday: "narrow" });
    return (n[0] ?? "d").toUpperCase();
  }
  return String(d.getUTCDate());
}

function previewLabelStep(total: number) {
  if (total <= 7) return 1;
  if (total <= 14) return 2;
  return 4;
}

function coordsForPoints(points: Point[]) {
  const max = maxCount(points);
  const top = yAxisTop(max);
  const innerW = PREVIEW_W - P.l - P.r;
  const innerH = PREVIEW_H - P.t - P.b;
  const n = Math.max(1, points.length);
  const step = n > 1 ? innerW / (n - 1) : innerW;
  const coords = points.map((p, i) => {
    const x = P.l + i * step;
    const y = P.t + innerH - (top === 0 ? 0 : (p.count / top) * innerH);
    return { x, y, ...p };
  });
  return { coords, top, innerH, innerW, n, step };
}

function PreviewShell({
  title,
  caption,
  onOpen,
  children,
}: {
  title: string;
  caption: string;
  onOpen: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" className="admin-chart-preview" onClick={onOpen}>
      <span className="admin-chart-preview-title">{title}</span>
      <div className="admin-chart-preview-plot">{children}</div>
      <span className="admin-chart-preview-caption">{caption}</span>
      <span className="admin-chart-preview-open">View details</span>
    </button>
  );
}


function PreviewTimeSeriesPlot({
  points,
  style,
  stroke,
  fillTop,
  fillBottom,
}: {
  points: Point[];
  style: OverviewChartStyle;
  stroke: string;
  fillTop: string;
  fillBottom: string;
}) {
  const gradId = useId().replace(/:/g, "");
  const { coords, top, innerH, innerW, n } = coordsForPoints(points);
  const line = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const area =
    coords.length > 0
      ? `${P.l},${P.t + innerH} ${line} ${P.l + innerW},${P.t + innerH}`
      : `${P.l},${P.t + innerH}`;
  const barW = Math.max(4, (innerW / n) * 0.55);
  const xMarks = coords
    .filter((_, i) => i === 0 || i === n - 1 || i % previewLabelStep(n) === 0)
    .map((c) => ({ x: c.x, label: axisTickChar(c.date, n) }));

  return (
    <svg className="admin-chart-preview-svg" viewBox={`0 0 ${PREVIEW_W} ${PREVIEW_H}`} aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillTop} stopOpacity="0.55" />
          <stop offset="100%" stopColor={fillBottom} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <SvgCartesianAxes
        width={PREVIEW_W}
        height={PREVIEW_H}
        pad={P}
        yTop={top}
        innerH={innerH}
        innerW={innerW}
        xMarks={xMarks}
        theme="light"
      />
      {style === "area" && coords.length > 0 && (
        <>
          <polygon points={area} fill={`url(#${gradId})`} />
          <polyline points={line} fill="none" stroke={stroke} strokeWidth="2.25" strokeLinejoin="round" />
        </>
      )}
      {style === "line" && coords.length > 0 && (
        <>
          <polyline
            points={line}
            fill="none"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {coords.map((c) => (
            <circle key={c.date} cx={c.x} cy={c.y} r={3.5} fill="#fff" stroke={stroke} strokeWidth="2" />
          ))}
        </>
      )}
      {style === "bar" &&
        coords.map((c) => {
          const h = P.t + innerH - c.y;
          return (
            <rect
              key={c.date}
              x={c.x - barW / 2}
              y={c.y}
              width={barW}
              height={Math.max(0, h)}
              rx={3}
              fill={fillTop}
              opacity={0.9}
            >
              <title>
                {axisDateLabel(c.date, n)}: {c.count}
              </title>
            </rect>
          );
        })}
    </svg>
  );
}

function PreviewEventsPlot({ items, style }: { items: NamedCount[]; style: OverviewChartStyle }) {
  const topItems = items.slice(0, style === "line" ? 6 : 5);
  const max = Math.max(1, ...topItems.map((i) => i.count));
  const total = topItems.reduce((s, i) => s + i.count, 0) || 1;

  if (style === "area") {
    let angle = -90;
    const cx = 88;
    const cy = 88;
    const r = 62;
    const ir = 38;
    return (
      <svg className="admin-chart-preview-svg admin-chart-preview-svg--donut" viewBox="0 0 176 176" aria-hidden>
        {topItems.map((item, i) => {
          const sweep = (item.count / total) * 360;
          const a0 = (angle * Math.PI) / 180;
          const a1 = ((angle + sweep) * Math.PI) / 180;
          angle += sweep;
          const x0o = cx + r * Math.cos(a0);
          const y0o = cy + r * Math.sin(a0);
          const x1o = cx + r * Math.cos(a1);
          const y1o = cy + r * Math.sin(a1);
          const x0i = cx + ir * Math.cos(a0);
          const y0i = cy + ir * Math.sin(a0);
          const x1i = cx + ir * Math.cos(a1);
          const y1i = cy + ir * Math.sin(a1);
          const large = sweep > 180 ? 1 : 0;
          const d = `M ${x0o} ${y0o} A ${r} ${r} 0 ${large} 1 ${x1o} ${y1o} L ${x1i} ${y1i} A ${ir} ${ir} 0 ${large} 0 ${x0i} ${y0i} Z`;
          return <path key={item.action} d={d} fill={DONUT_PREVIEW[i % DONUT_PREVIEW.length]} />;
        })}
      </svg>
    );
  }

  if (style === "line") {
    return (
      <div className="admin-chart-preview-vbars" aria-hidden>
        {topItems.map((item) => (
          <div key={item.action} className="admin-chart-preview-vbar-col" title={`${item.action}: ${item.count}`}>
            <div className="admin-chart-preview-vbar-fill" style={{ height: `${(item.count / max) * 100}%` }} />
            <span>{item.count}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul className="admin-chart-preview-hbars" aria-hidden>
      {topItems.map((item) => (
        <li key={item.action}>
          <span>{item.action}</span>
          <span className="admin-chart-preview-hbars-track">
            <span style={{ width: `${(item.count / max) * 100}%` }} />
          </span>
        </li>
      ))}
      {!topItems.length && <li className="admin-chart-preview-empty">No events yet</li>}
    </ul>
  );
}

const CAPTION: Record<OverviewChartStyle, string> = {
  area: "Area — filled trend or share",
  bar: "Bar — compare daily values",
  line: "Line — clean trend with points",
};

function TimeSeriesPreview({
  title,
  points,
  style,
  colors,
  onOpen,
}: {
  title: string;
  points: Point[];
  style: OverviewChartStyle;
  colors: { stroke: string; fillTop: string; fillBottom: string };
  onOpen: () => void;
}) {
  return (
    <PreviewShell title={title} caption={CAPTION[style]} onOpen={onOpen}>
      <PreviewTimeSeriesPlot points={points} style={style} {...colors} />
    </PreviewShell>
  );
}

export function OverviewActivityPreview({
  points,
  style,
  onOpen,
}: {
  points: Point[];
  trendDays: number;
  style: OverviewChartStyle;
  onOpen: () => void;
}) {
  return (
    <TimeSeriesPreview
      title="Activity"
      points={points}
      style={style}
      colors={{ stroke: "rgb(37 99 235)", fillTop: "rgb(59 130 246)", fillBottom: "rgb(59 130 246)" }}
      onOpen={onOpen}
    />
  );
}

export function OverviewSignupsPreview({
  points,
  style,
  onOpen,
}: {
  points: Point[];
  trendDays: number;
  style: OverviewChartStyle;
  onOpen: () => void;
}) {
  return (
    <TimeSeriesPreview
      title="New sign-ups"
      points={points}
      style={style}
      colors={{ stroke: "rgb(124 58 237)", fillTop: "rgb(139 92 246)", fillBottom: "rgb(139 92 246)" }}
      onOpen={onOpen}
    />
  );
}

export function OverviewEventsPreview({
  items,
  style,
  onOpen,
}: {
  items: NamedCount[];
  style: OverviewChartStyle;
  onOpen: () => void;
}) {
  const caption =
    style === "area"
      ? "Donut — share of each event type"
      : style === "line"
        ? "Columns — count by type"
        : "Bars — rank event types";
  return (
    <PreviewShell title="Events by type" caption={caption} onOpen={onOpen}>
      <PreviewEventsPlot items={items} style={style} />
    </PreviewShell>
  );
}

function detailSubtitle(style: OverviewChartStyle, trendDays: number) {
  const days = `${trendDays} day${trendDays === 1 ? "" : "s"}`;
  if (style === "bar") return `Bar chart · ${days}`;
  if (style === "line") return `Line chart · ${days}`;
  return `Area chart · ${days}`;
}

export function OverviewActivityDetail({
  points,
  trendDays,
  style,
}: {
  points: Point[];
  trendDays: number;
  style: OverviewChartStyle;
}) {
  if (style === "bar") {
    return (
      <AdminBarChart
        points={points}
        title="Activity"
        subtitle={detailSubtitle(style, trendDays)}
        accent="blue"
        showAllDates
      />
    );
  }
  return (
    <AdminAreaChart
      points={points}
      title="Activity"
      subtitle={detailSubtitle(style, trendDays)}
      tall={trendDays > 7}
      filled={style === "area"}
    />
  );
}

export function OverviewSignupsDetail({
  points,
  trendDays,
  style,
}: {
  points: Point[];
  trendDays: number;
  style: OverviewChartStyle;
}) {
  if (style === "bar") {
    return (
      <AdminBarChart
        points={points}
        title="New sign-ups"
        subtitle={detailSubtitle(style, trendDays)}
        accent="violet"
        showAllDates
      />
    );
  }
  return (
    <AdminAreaChart
      points={points}
      title="New sign-ups"
      subtitle={detailSubtitle(style, trendDays)}
      tall={trendDays > 7}
      filled={style === "area"}
    />
  );
}

export function OverviewEventsDetail({
  items,
  style,
}: {
  items: NamedCount[];
  style: OverviewChartStyle;
}) {
  if (style === "area") {
    return <AdminDonutChart items={items} title="Events by type" subtitle="Donut — proportional breakdown" />;
  }
  if (style === "line") {
    return (
      <AdminBarChart
        points={items.map((i) => ({ date: i.action, count: i.count }))}
        title="Events by type"
        subtitle="Column view — counts by type"
        accent="blue"
        showAllDates
        categoryLabels
      />
    );
  }
  return <AdminHBarChart items={items} title="Events by type" />;
}
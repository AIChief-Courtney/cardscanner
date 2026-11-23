"use client";



import { useId } from "react";
import { niceYTop, SvgCartesianAxes } from "./chart-axis";



type Point = { date: string; count: number };

type NamedCount = { action: string; count: number };



const CHART_W = 640;

const CHART_H = 200;

const CHART_H_TALL = 240;

const PAD = { t: 18, r: 18, b: 42, l: 46 };



/** Fixed-width style axis labels so bar columns stay even. */

export function axisDateLabel(iso: string, totalPoints: number): string {

  const d = new Date(iso + "T12:00:00Z");

  const m = d.getUTCMonth() + 1;

  const day = d.getUTCDate();

  if (totalPoints <= 1) {

    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  }

  if (totalPoints <= 7) {

    return d.toLocaleDateString(undefined, { weekday: "short" });

  }

  return `${m}/${day}`;

}

export function chartPointLabel(date: string, totalPoints: number, categoryLabels = false): string {
  if (categoryLabels || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date.length > 10 ? `${date.slice(0, 9)}…` : date;
  }
  return axisDateLabel(date, totalPoints);
}



function shortDate(iso: string) {

  return axisDateLabel(iso, 7);

}



function maxCount(points: Point[]) {

  return Math.max(1, ...points.map((p) => p.count));

}



function labelStep(totalPoints: number): number {

  if (totalPoints <= 7) return 1;

  if (totalPoints <= 14) return 2;

  return 3;

}



export function AdminAreaChart({

  points,

  title,

  subtitle,

  tall = false,

  filled = true,

}: {

  points: Point[];

  title: string;

  subtitle?: string;

  tall?: boolean;

  filled?: boolean;

}) {

  const gradId = useId().replace(/:/g, "");

  const dataMax = maxCount(points);

  const yTop = niceYTop(dataMax);

  const chartH = tall ? CHART_H_TALL : CHART_H;

  const innerW = CHART_W - PAD.l - PAD.r;

  const innerH = chartH - PAD.t - PAD.b;

  const step = points.length > 1 ? innerW / (points.length - 1) : innerW;

  const stepLabels = labelStep(points.length);



  const coords = points.map((p, i) => {

    const x = PAD.l + i * step;

    const y = PAD.t + innerH - (yTop === 0 ? 0 : (p.count / yTop) * innerH);

    return { x, y, ...p };

  });



  const line = coords.map((c) => `${c.x},${c.y}`).join(" ");

  const area = `${PAD.l},${PAD.t + innerH} ${line} ${PAD.l + innerW},${PAD.t + innerH}`;

  const xMarks = coords

    .filter((_, i) => i === 0 || i === coords.length - 1 || i % stepLabels === 0)

    .map((c) => ({ x: c.x, label: axisDateLabel(c.date, points.length) }));



  return (

    <figure className="admin-chart-card">

      <figcaption className="admin-chart-head">

        <div>

          <h3>{title}</h3>

          {subtitle && <p>{subtitle}</p>}

        </div>

        <span className="admin-chart-peak">

          Peak <strong>{dataMax}</strong>

        </span>

      </figcaption>

      <svg

        className="admin-chart-svg"

        viewBox={`0 0 ${CHART_W} ${chartH}`}

        role="img"

        aria-label={`${title} trend chart`}

      >

        <defs>

          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">

            <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity="0.45" />

            <stop offset="100%" stopColor="rgb(59 130 246)" stopOpacity="0.02" />

          </linearGradient>

        </defs>

        <SvgCartesianAxes
          width={CHART_W}
          height={chartH}
          pad={PAD}
          yTop={yTop}
          innerH={innerH}
          innerW={innerW}
          xMarks={xMarks}
          theme="dark"
        />

        {filled ? <polygon points={area} fill={`url(#${gradId})`} /> : null}

        <polyline points={line} fill="none" className="admin-chart-line" />

        {coords.map((c) => (

          <g key={c.date}>

            <circle cx={c.x} cy={c.y} r={c.count > 0 ? 4 : 2.5} className="admin-chart-dot">

              <title>

                {axisDateLabel(c.date, points.length)}: {c.count}

              </title>

            </circle>

          </g>

        ))}

      </svg>

    </figure>

  );

}



export function AdminBarChart({

  points,

  title,

  subtitle,

  accent = "blue",

  showAllDates = false,

  categoryLabels = false,

}: {

  points: Point[];

  title: string;

  subtitle?: string;

  accent?: "blue" | "violet";

  showAllDates?: boolean;

  categoryLabels?: boolean;

}) {

  const dataMax = maxCount(points);

  const yTop = niceYTop(dataMax);

  const chartH = CHART_H_TALL;

  const n = Math.max(1, points.length);

  const innerW = CHART_W - PAD.l - PAD.r;

  const innerH = chartH - PAD.t - PAD.b;

  const labelEvery = showAllDates ? (n > 14 ? 2 : 1) : labelStep(n);

  const slotW = innerW / n;

  const barW = Math.min(32, Math.max(8, slotW * 0.55));

  const fillClass = accent === "violet" ? "admin-bar-fill-svg--violet" : "admin-bar-fill-svg--blue";

  const xMarks = points

    .map((p, i) => ({ p, i, cx: PAD.l + i * slotW + slotW / 2 }))

    .filter(({ i }) => showAllDates || i === 0 || i === n - 1 || i % labelEvery === 0)

  .map(({ p, i, cx }) => ({

      x: cx,

      label: chartPointLabel(p.date, n, categoryLabels),

    }));

  return (

    <figure className={`admin-chart-card${showAllDates ? " admin-chart-card--bars-dated" : ""}`}>

      <figcaption className="admin-chart-head">

        <div>

          <h3>{title}</h3>

          {subtitle && <p>{subtitle}</p>}

        </div>

        <span className="admin-chart-peak">

          Peak <strong>{dataMax}</strong>

        </span>

      </figcaption>

      <svg

        className="admin-chart-svg"

        viewBox={`0 0 ${CHART_W} ${chartH}`}

        role="img"

        aria-label={`${title} bar chart`}

      >

        <SvgCartesianAxes

          width={CHART_W}

          height={chartH}

          pad={PAD}

          yTop={yTop}

          innerH={innerH}

          innerW={innerW}

          xMarks={xMarks}

          theme="dark"

        />

        {points.map((p, i) => {

          const h = yTop === 0 ? 0 : (p.count / yTop) * innerH;

          const x = PAD.l + i * slotW + (slotW - barW) / 2;

          const y = PAD.t + innerH - h;

          return (

            <g key={p.date}>

              <rect

                x={x}

                y={y}

                width={barW}

                height={Math.max(p.count > 0 ? 2 : 0, h)}

                rx={4}

                className={fillClass}

              >

                <title>

                  {chartPointLabel(p.date, n, categoryLabels)}: {p.count}

                </title>

              </rect>

              {p.count > 0 && (

                <text x={x + barW / 2} y={y - 4} className="admin-bar-value-svg" textAnchor="middle">

                  {p.count}

                </text>

              )}

            </g>

          );

        })}

      </svg>

    </figure>

  );

}



export function AdminHBarChart({ items, title }: { items: NamedCount[]; title: string }) {

  const max = Math.max(1, ...items.map((i) => i.count));

  return (

    <figure className="admin-chart-card admin-chart-card--compact">

      <figcaption className="admin-chart-head">

        <h3>{title}</h3>

      </figcaption>

      <ul className="admin-hbar-list">

        {items.map((item) => (

          <li key={item.action}>

            <span className="admin-hbar-label">{item.action}</span>

            <span className="admin-hbar-track" aria-hidden>

              <span

                className="admin-hbar-fill"

                style={{ width: `${(item.count / max) * 100}%` }}

              />

            </span>

            <strong>{item.count}</strong>

          </li>

        ))}

        {!items.length && <li className="admin-activity-empty">No events yet.</li>}

      </ul>

    </figure>

  );

}



const DONUT_COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#6366f1", "#84cc16"];

export function AdminDonutChart({ items, title, subtitle }: { items: NamedCount[]; title: string; subtitle?: string }) {
  const total = items.reduce((s, i) => s + i.count, 0) || 1;
  const slices = items.slice(0, 8);
  let angle = -90;
  const cx = 120;
  const cy = 120;
  const r = 72;
  const ir = 46;

  const arcs = slices.map((item, i) => {
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
    return { d, color: DONUT_COLORS[i % DONUT_COLORS.length], item };
  });

  return (
    <figure className="admin-chart-card">
      <figcaption className="admin-chart-head">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <span className="admin-chart-peak">
          Total <strong>{total}</strong>
        </span>
      </figcaption>
      <div className="admin-donut-layout">
        <svg className="admin-donut-svg" viewBox="0 0 240 240" role="img" aria-label={title}>
          {arcs.map((a) => (
            <path key={a.item.action} d={a.d} fill={a.color} stroke="#171a1f" strokeWidth="1.5">
              <title>
                {a.item.action}: {a.item.count}
              </title>
            </path>
          ))}
          <text x={cx} y={cy - 4} className="admin-donut-center" textAnchor="middle">
            {total}
          </text>
          <text x={cx} y={cy + 14} className="admin-donut-center-sub" textAnchor="middle">
            events
          </text>
        </svg>
        <ul className="admin-donut-legend">
          {slices.map((item, i) => (
            <li key={item.action}>
              <span className="admin-donut-swatch" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
              <span className="admin-donut-legend-label">{item.action}</span>
              <strong>{item.count}</strong>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

export function AdminKpiGrid({

  items,

}: {

  items: { label: string; value: string | number; hint?: string }[];

}) {

  return (

    <div className="admin-kpi-grid">

      {items.map((item) => (

        <div key={item.label} className="admin-kpi">

          <span className="admin-kpi-label">{item.label}</span>

          <strong className="admin-kpi-value">{item.value}</strong>

          {item.hint && <span className="admin-kpi-hint">{item.hint}</span>}

        </div>

      ))}

    </div>

  );

}



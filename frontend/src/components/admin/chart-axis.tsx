export type ChartPad = { t: number; r: number; b: number; l: number };

export function niceYTop(max: number): number {
  if (max <= 0) return 4;
  if (max <= 4) return 4;
  if (max <= 8) return 8;
  return Math.ceil(max / 4) * 4;
}

export function yTickValues(top: number): number[] {
  return [0, top / 2, top];
}

export function SvgCartesianAxes({
  width,
  height,
  pad,
  yTop,
  innerH,
  innerW,
  xMarks,
  theme = "dark",
}: {
  width: number;
  height: number;
  pad: ChartPad;
  yTop: number;
  innerH: number;
  innerW: number;
  xMarks: { x: number; label: string }[];
  theme?: "dark" | "light";
}) {
  const yBase = pad.t + innerH;
  const xLeft = pad.l;
  const xRight = pad.l + innerW;
  const axisClass = theme === "light" ? "admin-chart-preview-axis-line" : "admin-chart-axis-line";
  const gridClass = theme === "light" ? "admin-chart-preview-grid" : "admin-chart-grid-h";
  const yClass = theme === "light" ? "admin-chart-preview-y" : "admin-chart-axis-y";
  const xClass = theme === "light" ? "admin-chart-preview-x" : "admin-chart-axis-x";
  const tickClass = theme === "light" ? "admin-chart-preview-axis-tick" : "admin-chart-axis-tick";

  return (
    <>
      {yTickValues(yTop).map((v) => {
        const y = pad.t + innerH - (v / yTop) * innerH;
        return (
          <g key={`y-${v}`}>
            <line x1={xLeft} x2={xRight} y1={y} y2={y} className={gridClass} />
            <text x={xLeft - 8} y={y + 4} className={yClass} textAnchor="end">
              {Math.round(v)}
            </text>
          </g>
        );
      })}
      <line x1={xLeft} y1={pad.t} x2={xLeft} y2={yBase} className={axisClass} />
      <line x1={xLeft} y1={yBase} x2={xRight} y2={yBase} className={axisClass} />
      {xMarks.map((m) => (
        <g key={`${m.label}-${m.x}`}>
          <line x1={m.x} y1={yBase} x2={m.x} y2={yBase + 5} className={tickClass} />
          <text x={m.x} y={height - 8} className={xClass} textAnchor="middle">
            {m.label}
          </text>
        </g>
      ))}
    </>
  );
}